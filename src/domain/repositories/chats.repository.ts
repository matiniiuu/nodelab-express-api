import { Chat } from "@src/domain";
import { ListRepositoryDto, ListRequest } from "@src/dto";

export interface IRepository {
    create(from: string, to: string): Promise<Chat>;
    findOne(from: string, to: string): Promise<Chat | null>;

    updateLastMessage(chatId: string, lastMessageId: string): Promise<void>;

    findAll(userId: string, dto: ListRequest): ListRepositoryDto<Chat>;
}
