import {
    AutoMessage,
    IAutoMessage,
    IAutoMessagesRepository,
} from "@src/domain";
import { AutoMessageDto } from "@src/dto";

export class AutoMessagesMongoDB implements IAutoMessagesRepository {
    async updateIsQueued(id: string, isQueued: boolean): Promise<void> {
        await AutoMessage.updateOne({ _id: id }, { $set: { isQueued } });
    }
    async updateIsSent(id: string, isSent: boolean): Promise<void> {
        await AutoMessage.updateOne({ _id: id }, { $set: { isSent } });
    }
    getMessagesToSend(): Promise<IAutoMessage[]> {
        return AutoMessage.find({
            sendDate: { $lte: Date.now() },
            isQueued: false,
            isSent: false,
        });
    }
    async insertMany(dto: AutoMessageDto[]): Promise<void> {
        await AutoMessage.insertMany(dto);
    }
}
