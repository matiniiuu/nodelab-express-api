import http from "http";
import jwt from "jsonwebtoken";
import { Server as SocketIOServer } from "socket.io";

import { envVariables } from "@src/config";
import { IRedisRepository, UserJwtPayload } from "@src/domain";
import { log } from "@src/helpers";
export class SocketIoServer {
    public io: SocketIOServer;
    constructor(
        private readonly server: http.Server,
        private readonly redisRepository: IRedisRepository,
        private readonly messageService: IRedisRepository,
    ) {
        this.Init();
    }
    async Init() {
        log.info("Initializing Socket");
        this.io = new SocketIOServer(this.server, {
            cors: { origin: "*" },
            adapter: await this.redisRepository.socketAdapter(),
        });

        this.setupListeners();
    }
    private setupListeners(): void {
        this.io.on("connection", async (socket) => {
            log.info("New client is trying to connect:", socket.id);
            const token = socket.handshake.query.authorization as string;
            const userId = socket.handshake.query.userId as string;
            log.info("Client Connection token", token);
            log.info("Client User Id", userId);
            if (!token || !userId) socket.disconnect();
            try {
                const { email } = jwt.verify(
                    token,
                    envVariables.JWT_ACCESS_SECRET,
                ) as UserJwtPayload;
                log.info("Client User Email", email);

                await this.redisRepository.setOnlineUser(userId, socket.id);
                //!Send to all yours except the client
                socket.broadcast.emit("user_online", "world");
            } catch (error) {
                log.error(error);
                socket.disconnect();
            }
            socket.on(
                "typing",
                async ({ to, isTyping }: { to: string; isTyping: boolean }) => {
                    const socketId = await this.redisRepository.getOnlineUser(
                        to,
                    );
                    if (socketId) {
                        this.io
                            .to(socketId)
                            .emit("typing", { from: to, isTyping });
                    }
                },
            );
            socket.on(
                "send_message",
                async ({ to, content }: { to: string; content: string }) => {
                    const from = socket.handshake.query.userId as string;
                    const socketId = await this.redisRepository.getOnlineUser(
                        to,
                    );
                    if (socketId) {
                        //! Real-time delivery
                        this.io
                            .to(socketId)
                            .emit("new_message", { from, content });
                    } else {
                        //! trigger push notification for offline user
                        this.messageService.sendPushNotification({
                            to,
                            content,
                        });
                    }
                    //! publish to RabbitMQ
                    await this.messageService.publishMessage({
                        from,
                        to,
                        content,
                    });
                },
            );
            socket.on(
                "read_receipt",
                async ({
                    messageId,
                    to,
                }: {
                    messageId: string;
                    to: string;
                }) => {
                    const socketId = await this.redisRepository.getOnlineUser(
                        to,
                    );
                    if (socketId) {
                        this.io
                            .to(socketId)
                            .emit("read_receipt", { messageId });
                    }
                    //! optionally persist read receipt
                    await this.messageService.publishReadReceipt({ messageId });
                },
            );
            socket.on("disconnect", async () => {
                const userId = socket.handshake.query.userId as string;
                await this.redisRepository.deleteOnlineUser(userId);
                socket.broadcast.emit("user_offline", userId);
                log.info("Client disconnected:", socket.id, " User Id", userId);
            });
        });
    }
}
