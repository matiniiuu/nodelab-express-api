import { IChat, IChatsRepository, IChatsService } from "@src/domain";
import { ListReply, ListRequest, ListResponse } from "@src/dto";

export class ChatsService implements IChatsService {
    constructor(private readonly repository: IChatsRepository) {}

    async list(userId: string, dto: ListRequest): ListReply<IChat> {
        const [result, total] = await this.repository.findAll(userId, dto);
        return new ListResponse(result, total);
    }

    async getOrCreateChatId(from: string, to: string): Promise<string> {
        const chat = await this.repository.findOne(from, to);
        if (chat) {
            return chat._id;
        }
        return (await this.repository.create(from, to))._id;
    }

    updateLastMessage(chatId: string, lastMessageId: string): Promise<void> {
        return this.repository.updateLastMessage(chatId, lastMessageId);
    }
}
