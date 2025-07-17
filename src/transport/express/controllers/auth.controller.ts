import { Request } from "express";
import httpStatus from "http-status";

import { Success } from "@src/config";
import { IAuthService } from "@src/domain";
import {
    DataResponse,
    LoginResponse,
    LoginUserDto,
    RegisterUserDto,
    SuccessResponse,
} from "@src/dto";
import {
    StandardResponse,
    TypedRequestBody,
    TypedResponse,
} from "@src/helpers";

export class AuthController {
    constructor(private readonly authService: IAuthService) {}
    async register(
        req: TypedRequestBody<RegisterUserDto>,
        res: StandardResponse,
    ) {
        res.status(httpStatus.OK).json(
            await this.authService.register(req.body),
        );
    }
    async login(
        req: TypedRequestBody<LoginUserDto>,
        res: TypedResponse<LoginResponse>,
    ) {
        const tokens = await this.authService.login(req.body);

        req.session = {
            jwt: tokens,
        };
        res.status(httpStatus.OK).json(new DataResponse(tokens));
    }

    refresh(req: Request, res: TypedResponse<LoginResponse>) {
        const tokens = new LoginResponse(
            this.authService.generateAccessToken(req.user),
            req.refreshToken,
        );
        req.session = {
            jwt: tokens,
        };
        res.status(httpStatus.OK).json(new DataResponse(tokens));
    }
    logout(req: Request, res: StandardResponse) {
        req.session = null;
        res.status(httpStatus.OK).json(new SuccessResponse(Success));
    }
}
