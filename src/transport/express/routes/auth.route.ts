import express from "express";
import {
    ForgotPasswordRequest,
    ResetPasswordRequest,
    SignInRequest,
    SignUpRequest,
    SocialSignInRequest,
    VerifyRequest,
} from "../../../dto";
import { IAuthService } from "../../../services";
import { AuthController } from "../controllers";
import { authentication } from "../middleware/authentication";
import { validator } from "../middleware/validation";
export const createAuthRoutes = (authService: IAuthService): express.Router => {
    const router = express.Router();
    const authController = new AuthController(authService);
    router.post(
        "/sign-up",
        validator(SignUpRequest, "body"),
        authController.signUp.bind(authController),
    );
    router.post(
        "/sign-in",
        validator(SignInRequest, "body"),
        authController.signIn.bind(authController),
    );
    router.post(
        "/social-sign-in",
        validator(SocialSignInRequest, "body"),
        authController.socialSignIn.bind(authController),
    );

    router.patch(
        "/verify-email",
        authentication(),
        validator(VerifyRequest, "body"),
        authController.verifyEmail.bind(authController),
    );
    router.patch(
        "/verify-phone-number",
        authentication(),
        validator(VerifyRequest, "body"),
        authController.verifyPhoneNumber.bind(authController),
    );

    router.get(
        "/email-verification-code",
        authentication(),
        authController.getEmailVerificationCode.bind(authController),
    );
    router.get(
        "/phone-number-verification-code",
        authentication(),
        authController.getPhoneNumberVerificationCode.bind(authController),
    );

    router.get(
        "/refresh-token",
        authentication(true),
        authController.refreshToken.bind(authController),
    );

    router.post(
        "/sign-out",
        authentication(true),
        authController.signOut.bind(authController),
    );

    router.post(
        "/forgot-password",
        validator(ForgotPasswordRequest, "body"),
        authController.forgotPassword.bind(authController),
    );
    router.patch(
        "/reset-password",
        validator(ResetPasswordRequest, "body"),
        authController.resetPassword.bind(authController),
    );
    return router;
};
