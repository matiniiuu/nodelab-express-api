import { IMessagesRepository, Message } from "@src/domain";
import { PublishMessageDto, PublishReadReceiptDto } from "@src/dto";

export class MessagesMongoDB implements IMessagesRepository {
    async create(dto: PublishMessageDto): Promise<string> {
        return (await Message.create(dto))._id;
    }
    async updateReadReceipt(dto: PublishReadReceiptDto): Promise<void> {
        await Message.updateOne(
            { _id: dto.messageId },
            { $set: { isRead: true } },
        );
    }
}
