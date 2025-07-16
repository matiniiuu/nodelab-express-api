import { PublishMessageDto, PublishReadReceiptDto } from "@src/dto";

export interface IMessagesRepository {
    create(dto: PublishMessageDto): Promise<string>;
    updateReadReceipt(dto: PublishReadReceiptDto): Promise<void>;
}
