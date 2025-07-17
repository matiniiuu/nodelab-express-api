import nodeCron from "node-cron";

import {
    IAutoMessage,
    IAutoMessagesRepository,
    IAutoMessagesService,
    IChatsService,
    IMessagesRepository,
    IRedisRepository,
    IUser,
    IUsersRepository,
} from "@src/domain";
import { AutoMessageDto } from "@src/dto";
import { log } from "@src/helpers";
import { eventBus } from "@src/transport/event-bus";
import { ProducerMessagesRabbitMQ } from "@src/transport/rabbitmq";

export class AutoMessagesService implements IAutoMessagesService {
    constructor(
        private readonly producer: ProducerMessagesRabbitMQ,
        private readonly autoMessageRepository: IAutoMessagesRepository,
        private readonly redisRepository: IRedisRepository,
        private readonly usersRepository: IUsersRepository,
        private readonly messagesRepository: IMessagesRepository,
        private readonly chatsService: IChatsService,
    ) {
        nodeCron.schedule("0 2 * * *", () => this.generateAutoMessagesCron());
        nodeCron.schedule("* * * * *", () => this.autoMessagesToQueueCron());
    }
    //! Auto Generate Messages
    async generateAutoMessagesCron() {
        log.info("Running scheduled auto-message generation");
        const count = await this.generateAutoMessagesCron();
        log.info(`Generated ${count} auto messages`);
    }
    private shuffle<T>(array: T[]): T[] {
        return array.sort(() => Math.random() - 0.5);
    }

    async generateAutoMessages(): Promise<number> {
        const users = await this.usersRepository.getUserByIds(
            await this.redisRepository.getOnlineUsers(),
        );
        const shuffled = this.shuffle<IUser>(users);

        const pairs: AutoMessageDto[] = [];
        for (let i = 0; i < shuffled.length - 1; i += 2) {
            const sender = shuffled[i];
            const receiver = shuffled[i + 1];

            pairs.push({
                sender: sender._id,
                receiver: receiver._id,
                message: `Hi ${receiver.name}, this is an auto message from ${sender.name}`,
                sendDate: this.randomFutureDate(),
            });
        }

        await this.autoMessageRepository.insertMany(pairs);
        return pairs.length;
    }
    private randomFutureDate(): Date {
        const now = new Date();
        const offsetMinutes = Math.floor(Math.random() * 60); //? random within next hour
        return new Date(now.getTime() + offsetMinutes * 60 * 1000);
    }
    //! Send Auto Generated Messages to the queue
    async autoMessagesToQueueCron() {
        log.info("Running scheduled auto-message senders");
        const count = await this.sendAutoMessagesToQueue();
        log.info(`Sent ${count} auto messages to the queue`);
    }
    async sendAutoMessagesToQueue() {
        const messages = await this.autoMessageRepository.getMessagesToSend();
        for (const message of messages) {
            await this.producer.PublishInMessages(
                "message.auto-message",
                JSON.stringify(message),
            );
            await this.autoMessageRepository.updateIsQueued(message._id, true);
        }
        return messages.length;
    }
    //! Handle Auto Message Send
    async handleAutoMessageSend(dto: IAutoMessage) {
        //! 1) Save a new Message document
        const chatId = await this.chatsService.getOrCreateChatId(
            dto.sender.toHexString(),
            dto.receiver.toHexString(),
        );
        const messageId = await this.messagesRepository.create({
            content: dto.message,
            from: dto.sender.toHexString(),
            to: dto.receiver.toHexString(),
            chatId,
        });
        await this.chatsService.updateLastMessage(chatId, messageId);
        //! 2) Publish an in‑process event
        eventBus.emit("auto-message.received", dto);

        //! 3) Mark the AutoMessage as sent
        await this.autoMessageRepository.updateIsSent(dto._id, true);
    }
}
