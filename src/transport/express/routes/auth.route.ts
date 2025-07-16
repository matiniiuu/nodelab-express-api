import express from "express";

import { IAuthService } from "@src/domain";
import { LoginUserDto, RegisterUserDto } from "@src/dto";

import { AuthController } from "../controllers";
import { authentication } from "../middleware/authentication";
import { validator } from "../middleware/validation";

export const createAuthRoutes = (authService: IAuthService): express.Router => {
    const router = express.Router();
    const authController = new AuthController(authService);
    router.post(
        "/register",
        validator(RegisterUserDto, "body"),
        authController.register.bind(authController),
    );
    router.post(
        "/login",
        validator(LoginUserDto, "body"),
        authController.login.bind(authController),
    );

    router.post(
        "/refresh",
        authentication(true),
        authController.refresh.bind(authController),
    );

    return router;
};
