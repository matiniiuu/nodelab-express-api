import httpStatus from "http-status";
import { ChallengesRequest, ChallengesUpdateStatusRequest } from "../../../dto";
import {
    TypedRequestBody,
    TypedRequestParams,
    TypedRequestQB,
    TypedRequestQuery,
} from "../../../helpers/request";
import { StandardResponse } from "../../../helpers/response";
import { IChallengesService } from "../../../services/challenges.service";

export class ChallengesController {
    constructor(private readonly challengesService: IChallengesService) {}
    async add(req: TypedRequestBody<ChallengesRequest>, res: StandardResponse) {
        await this.challengesService.add(req.user.username, req.body);
        res.status(httpStatus.OK).json({
            success: true,
        });
    }
    async list(
        //TODO use dto
        req: TypedRequestQuery<any>,
        res: StandardResponse,
    ) {
        const result = await this.challengesService.list(
            req.user.username,
            req.query,
        );
        res.status(httpStatus.OK).json({
            ...result,
            success: true,
        });
    }
    async updateStatus(
        req: TypedRequestQB<{ id: string }, ChallengesUpdateStatusRequest>,
        res: StandardResponse,
    ) {
        const contact = await this.challengesService.updateStatus(
            req.params.id,
            req.body,
        );
        res.status(httpStatus.OK).json({ payload: contact, success: true });
    }
    async delete(
        req: TypedRequestParams<{ id: string }>,
        res: StandardResponse,
    ) {
        await this.challengesService.delete(req.params.id, req.user.username);
        res.status(httpStatus.OK).json({
            success: true,
        });
    }
}
