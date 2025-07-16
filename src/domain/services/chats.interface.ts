import { IChat } from "../entities";

import { ListReply, ListRequest } from "@src/dto";

export interface IChatsService {
    list(userId: string, dto: ListRequest): ListReply<IChat>;

    getOrCreateChatId(from: string, to: string): Promise<string>;
    updateLastMessage(chatId: string, lastMessageId: string): Promise<void>;
}
