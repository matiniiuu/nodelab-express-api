import { Request } from "express";
import {
    ForgotPasswordRequest,
    ResetPasswordRequest,
    SignInRequest,
    SignUpRequest,
    SocialSignInRequest,
    VerifyRequest,
} from "../../../dto";
import { IAuthService } from "../../../services";
import httpStatus from "http-status";
import { StandardResponse } from "../../../helpers/response";
import { TypedRequestBody } from "../../../helpers/request";
import { RequiredVerificationField } from "../../../enums";
export class AuthController {
    constructor(private readonly authService: IAuthService) {}
    async signUp(req: TypedRequestBody<SignUpRequest>, res: StandardResponse) {
        const tokens = await this.authService.signUp(req.body);
        res.status(httpStatus.OK).json({
            payload: tokens,
            success: true,
        });
    }
    async signIn(req: TypedRequestBody<SignInRequest>, res: StandardResponse) {
        const tokens = await this.authService.signIn(req.body);
        res.status(httpStatus.OK).json({
            payload: tokens,
            success: true,
        });
    }

    async socialSignIn(
        req: TypedRequestBody<SocialSignInRequest>,
        res: StandardResponse,
    ) {
        const tokens = await this.authService.socialSignIn(req.body);
        res.status(httpStatus.OK).json({
            payload: tokens,
            success: true,
        });
    }

    async getEmailVerificationCode(req: Request, res: StandardResponse) {
        await this.authService.getVerificationCode(
            RequiredVerificationField.EMAIL,
            req.accessToken,
        );
        res.status(httpStatus.OK).json({
            success: true,
        });
    }
    async getPhoneNumberVerificationCode(req: Request, res: StandardResponse) {
        await this.authService.getVerificationCode(
            RequiredVerificationField.PHONE_NUMBER,
            req.accessToken,
        );
        res.status(httpStatus.OK).json({
            success: true,
        });
    }

    async verifyEmail(
        req: TypedRequestBody<VerifyRequest>,
        res: StandardResponse,
    ) {
        await this.authService.verifyAttribute(
            req.user.username,
            RequiredVerificationField.EMAIL,
            req.accessToken,
            req.body.code,
        );
        res.status(httpStatus.OK).json({
            success: true,
        });
    }
    async verifyPhoneNumber(
        req: TypedRequestBody<VerifyRequest>,
        res: StandardResponse,
    ) {
        await this.authService.verifyAttribute(
            req.user.username,
            RequiredVerificationField.PHONE_NUMBER,
            req.accessToken,
            req.body.code,
        );
        res.status(httpStatus.OK).json({
            success: true,
        });
    }

    async refreshToken(req: Request, res: StandardResponse) {
        const tokens = await this.authService.refreshToken(
            req.user.username,
            req.refreshToken,
        );
        res.status(httpStatus.OK).json({
            payload: tokens,
            success: true,
        });
    }

    async signOut(req: Request, res: StandardResponse) {
        await this.authService.signOut(req.refreshToken);
        res.status(httpStatus.OK).json({
            success: true,
        });
    }

    async forgotPassword(
        req: TypedRequestBody<ForgotPasswordRequest>,
        res: StandardResponse,
    ) {
        const tokens = await this.authService.forgotPassword(req.body);
        res.status(httpStatus.OK).json({
            payload: tokens,
            success: true,
        });
    }
    async resetPassword(
        req: TypedRequestBody<ResetPasswordRequest>,
        res: StandardResponse,
    ) {
        const tokens = await this.authService.resetPassword(req.body);
        res.status(httpStatus.OK).json({
            payload: tokens,
            success: true,
        });
    }
}
