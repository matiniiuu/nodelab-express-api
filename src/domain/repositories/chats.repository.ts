import { IChat } from "../entities";

import { ListRepositoryDto, ListRequest } from "@src/dto";

export interface IChatsRepository {
    create(from: string, to: string): Promise<IChat>;
    findOne(from: string, to: string): Promise<IChat | null>;

    updateLastMessage(chatId: string, lastMessageId: string): Promise<void>;

    findAll(userId: string, dto: ListRequest): ListRepositoryDto<IChat>;
}
