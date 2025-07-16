import { DataSource, In, Repository } from "typeorm";
import { ChallengeNotFound } from "../constants";
import { ChallengesListRequest } from "../dto/challenges.dto";
import { Challenge, NewChallengeAttr } from "../entities";
import { ChallengeStatus } from "../enums";
import { calculateOffset, transformSort } from "../helpers/list";
import { NotFoundError } from "../packages/errors/not-found-error";
export class ChallengesRepository implements IChallengesRepository {
    challengeRepository: Repository<Challenge>;
    constructor(dataSource: DataSource) {
        this.challengeRepository = dataSource.getRepository(Challenge);
    }
    async create(challenge: NewChallengeAttr) {
        await this.challengeRepository.save(challenge);
    }
    async findOne(id: string): Promise<Challenge> {
        const challenge = await this.challengeRepository.findOne({
            relations: ["challenger", "challengee"],
            where: {
                id,
            },
        });
        if (!challenge) throw new NotFoundError(ChallengeNotFound);
        return challenge;
    }
    // @todo: map to opponent
    async listChallengesForUser(
        userId: string,
        { filter, page, size, sort }: ChallengesListRequest,
    ): Promise<{ challenges: Challenge[]; total: number }> {
        const statuses = filter?.status?.split(",") || [];
        let order;
        if (sort) {
            const { field, sOrder } = transformSort(sort);
            order = {
                [field]: sOrder,
            };
        }

        // @todo: filter by requesting user
        const [challenges, total] = await this.challengeRepository.findAndCount(
            {
                relations: ["challenger", "challengee"],
                where: {
                    // requesterId,
                    ...(statuses.length && {
                        status: In(statuses),
                    }),
                },
                skip: calculateOffset(page, size),
                take: size,
                ...(order && { order }),
            },
        );
        return { challenges, total };
    }
    async updateStatus(id: string, status: ChallengeStatus) {
        // @todo: handle done
        let timestampField = "";
        if (status === ChallengeStatus.ACCEPTED) timestampField = "acceptedAt";
        else if (status === ChallengeStatus.DECLINED)
            timestampField = "declinedAt";
        await this.challengeRepository.update(id, {
            status,
            ...(timestampField && { [timestampField]: new Date() }),
        });
    }
    async delete(id: string, challengerId: string) {
        await this.challengeRepository.delete({
            id,
            challengerId,
        });
    }
}
export interface IChallengesRepository {
    create(challenge: NewChallengeAttr);
    findOne(id: string): Promise<Challenge>;
    listChallengesForUser(
        requesterId: string,
        clr: ChallengesListRequest,
    ): Promise<{ challenges: Challenge[]; total: number }>;
    updateStatus(id: string, status: ChallengeStatus);
    delete(id: string, challengerId: string);
}
