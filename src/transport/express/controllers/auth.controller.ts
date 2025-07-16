import { Request } from "express";
import httpStatus from "http-status";

import { IAuthService } from "@src/domain";
import {
    DataResponse,
    LoginResponse,
    LoginUserDto,
    RegisterUserDto,
} from "@src/dto";
import { TypedRequestBody } from "@src/helpers/request";
import { StandardResponse, TypedResponse } from "@src/helpers/response";

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
    async login(req: TypedRequestBody<LoginUserDto>, res: StandardResponse) {
        res.status(httpStatus.OK).json(await this.authService.login(req.body));
    }

    refresh(req: Request, res: TypedResponse<LoginResponse>) {
        res.status(httpStatus.OK).json(
            new DataResponse(
                new LoginResponse(
                    this.authService.generateAccessToken(req.user),
                    req.refreshToken,
                ),
            ),
        );
    }
}
