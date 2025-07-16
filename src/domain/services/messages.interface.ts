import {
    PublishMessageDto,
    PublishReadReceiptDto,
    SendMessagePushNotificationDto,
} from "@src/dto";

export interface IMessagesService {
    sendPushNotification(dto: SendMessagePushNotificationDto): Promise<void>;
    publishReadReceipt(dto: PublishReadReceiptDto): Promise<void>;
    publishMessage(dto: PublishMessageDto): Promise<void>;
}
