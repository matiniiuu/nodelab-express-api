import http from "http";
import { Server as SocketIOServer } from "socket.io";

import { log } from "@src/helpers";
export class SocketIoServer {
    public io: SocketIOServer;
    constructor(private readonly server: http.Server) {
        log.info("Initializing Socket", "");

        this.io = new SocketIOServer(this.server, {
            cors: {
                origin: "*", // You can restrict this to your frontend origin
                methods: ["GET", "POST"],
            },
        });

        this.setupListeners();
    }
    private setupListeners(): void {
        this.io.on("connection", (socket) => {
            log.info("New client connected:", socket.id);

            socket.on("disconnect", () => {
                log.info("Client disconnected:", socket.id);
            });
        });
    }
}
