import { AutoMessageDto } from "@src/dto";
import { IAutoMessage } from "../entities";

export interface IAutoMessagesRepository {
    insertMany(dto: AutoMessageDto[]): Promise<void>;
    updateIsQueued(id: string, isQueued: boolean): Promise<void>;
    updateIsSent(id: string, isSent: boolean): Promise<void>;
    getMessagesToSend(): Promise<IAutoMessage[]>;
}
