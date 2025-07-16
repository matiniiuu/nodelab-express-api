import { IProfileService, IUser } from "@src/domain";
import { UpdateProfileDto } from "@src/dto";
import { TypedRequestBody } from "@src/helpers/request";
import { StandardResponse, TypedResponse } from "@src/helpers/response";
import { Request } from "express";
import httpStatus from "http-status";

export class ProfileController {
    constructor(private readonly service: IProfileService) {}

    async update(
        req: TypedRequestBody<UpdateProfileDto>,
        res: StandardResponse,
    ) {
        res.status(httpStatus.OK).json(
            await this.service.update(req.user.email, req.body),
        );
    }
    async me(req: Request, res: TypedResponse<IUser>) {
        res.status(httpStatus.OK).json(await this.service.me(req.user));
    }
}
