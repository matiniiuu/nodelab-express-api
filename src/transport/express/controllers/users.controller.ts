import { Request } from "express";
import { IUsersService } from "../../../services";
import httpStatus from "http-status";
import { StandardResponse } from "../../../helpers/response";
import {
    TypedRequestBody,
    TypedRequestParams,
    TypedRequestQuery,
} from "../../../helpers/request";
import { EditProfileRequest } from "../../../dto";

export class UsersController {
    constructor(private readonly usersService: IUsersService) {}
    async profile(req: Request, res: StandardResponse) {
        const user = await this.usersService.findOneByEmail(req.user.username);
        res.status(httpStatus.OK).json({
            payload: user,
            success: true,
        });
    }
    async findOne(
        req: TypedRequestParams<{ id: string }>,
        res: StandardResponse,
    ) {
        const user = await this.usersService.findOne(req.params.id);
        res.status(httpStatus.OK).json({
            payload: user,
            success: true,
        });
    }
    async searchUsers(
        //TODO use dto
        req: TypedRequestQuery<{ name: string }>,
        res: StandardResponse,
    ) {
        const users = await this.usersService.searchUsers(req.query.name);
        res.status(httpStatus.OK).json({ payload: users, success: true });
    }
    async editProfile(
        req: TypedRequestBody<EditProfileRequest>,
        res: StandardResponse,
    ) {
        const user = await this.usersService.editProfile(
            req.accessToken,
            req.user.username,
            req.body,
        );
        res.status(httpStatus.OK).json({ payload: user, success: true });
    }
}
