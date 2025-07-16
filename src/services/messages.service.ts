import { IMessagesService } from "@src/domain";
import {
    PublishMessageDto,
    PublishReadReceiptDto,
    SendMessagePushNotificationDto,
} from "@src/dto";

export class MessagesService implements IMessagesService {
    constructor(private readonly amqpConnection: any) {}

    async sendPushNotification(
        dto: SendMessagePushNotificationDto,
    ): Promise<void> {
        //! Integrate with FCM/APNs
    }

    async publishReadReceipt(dto: PublishReadReceiptDto): Promise<void> {
        await this.amqpConnection.publish("messages", "message.read", {
            dto,
        });
    }

    async publishMessage(dto: PublishMessageDto): Promise<void> {
        await this.amqpConnection.publish("messages", "message.new", dto);
    }
}
