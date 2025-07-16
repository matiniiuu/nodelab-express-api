import { Chat, IChat, IChatsRepository } from "@src/domain";
import { ListRepositoryDto, ListRequest } from "@src/dto";
import { CalculateOffset } from "@src/helpers";

export class ChatsMongoDB implements IChatsRepository {
    async create(from: string, to: string): Promise<IChat> {
        return new Chat({ participants: [from, to] }).save();
    }
    async findOne(from: string, to: string): Promise<IChat | null> {
        return Chat.findOne({ participants: { $all: [from, to] } });
    }

    async updateLastMessage(
        chatId: string,
        lastMessageId: string,
    ): Promise<void> {
        await Chat.updateOne(
            { _id: chatId },
            { $set: { lastMessage: lastMessageId } },
        );
    }

    async findAll(userId: string, dto: ListRequest): ListRepositoryDto<IChat> {
        const { limit, page, sort } = dto;
        return Promise.all([
            Chat.find<IChat>({ participants: userId })
                .sort({ createdAt: sort })
                .skip(CalculateOffset(page, limit))
                .limit(limit)
                .lean<IChat[]>(true),
            Chat.countDocuments().lean<number>(true),
        ]);
    }
}
