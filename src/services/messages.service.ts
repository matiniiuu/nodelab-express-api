import {
    IChatsService,
    IMessagesRepository,
    IMessagesService,
} from "@src/domain";
import {
    PublishMessageDto,
    PublishReadReceiptDto,
    SendMessagePushNotificationDto,
} from "@src/dto";
import { ProducerMessagesRabbitMQ } from "@src/transport/rabbitmq";

export class MessagesService implements IMessagesService {
    constructor(
        private readonly producer: ProducerMessagesRabbitMQ,
        private readonly repository: IMessagesRepository,
        private readonly chatService: IChatsService,
    ) {}

    async sendPushNotification(
        dto: SendMessagePushNotificationDto,
    ): Promise<void> {
        //! Integrate with FCM/APNs
    }

    async publishReadReceipt(dto: PublishReadReceiptDto): Promise<void> {
        await this.producer.PublishInMessages(
            "message.read",
            JSON.stringify(dto),
        );
    }

    async publishMessage(dto: PublishMessageDto): Promise<void> {
        await this.producer.PublishInMessages(
            "message.new",
            JSON.stringify(dto),
        );
    }

    async handleNewMessage(dto: PublishMessageDto): Promise<void> {
        const chatId = await this.chatService.getOrCreateChatId(
            dto.from,
            dto.to,
        );
        const messageId = await this.repository.create({ ...dto, chatId });
        await this.chatService.updateLastMessage(chatId, messageId);
    }
    async handleReadReceipt(dto: PublishReadReceiptDto): Promise<void> {
        await this.repository.updateReadReceipt(dto);
    }
}
