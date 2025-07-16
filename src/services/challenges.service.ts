import {
    ChallengesListRequest,
    ChallengesRequest,
    ChallengesUpdateStatusRequest,
    ListResponse,
} from "../dto";
import { Challenge } from "../entities";
import { IChallengesRepository, IUsersRepository } from "../repositories";

export class ChallengesService implements IChallengesService {
    constructor(
        private readonly challengesRepository: IChallengesRepository,
        private readonly usersRepository: IUsersRepository,
    ) {}
    async add(email: string, data: ChallengesRequest) {
        const challenger = await this.usersRepository.findOneByEmail(email);
        const challengee = await this.usersRepository.findOne(data.opponent);
        await this.challengesRepository.create({
            challenger: challenger,
            challengee: challengee,
            title: data.title,
            description: data.description,
            amount: data.amount,
            media: data.media,
        });
    }
    async list(
        email: string,
        clr: ChallengesListRequest,
    ): Promise<ListResponse<Challenge>> {
        const user = await this.usersRepository.findOneByEmail(email);
        const { challenges, total } =
            await this.challengesRepository.listChallengesForUser(user.id, clr);
        const totalNumberOfPages = Math.ceil(total / clr.size) || 1;
        const nextPage = totalNumberOfPages > clr.page ? clr.page + 1 : null;
        return {
            payload: challenges,
            meta: {
                page: clr.page,
                size: clr.size,
                nextPage: nextPage,
                totalNumberOfPages,
            },
        };
    }
    async updateStatus(
        id: string,
        { status }: ChallengesUpdateStatusRequest,
    ): Promise<Challenge> {
        await this.challengesRepository.updateStatus(id, status);
        return this.challengesRepository.findOne(id);
    }
    async delete(id: string, email: string) {
        const user = await this.usersRepository.findOneByEmail(email);
        await this.challengesRepository.delete(id, user.id);
    }
}
export interface IChallengesService {
    add(email: string, cr: ChallengesRequest);
    list(
        email: string,
        clr: ChallengesListRequest,
    ): Promise<ListResponse<Challenge>>;
    updateStatus(
        id: string,
        cusr: ChallengesUpdateStatusRequest,
    ): Promise<Challenge>;
    delete(id: string, email: string);
}
