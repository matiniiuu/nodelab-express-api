import express from "express";

import { IAuthService } from "@src/domain";
import { LoginUserDto, RegisterUserDto } from "@src/dto";

import { AuthController } from "../controllers";
import { authentication } from "../middleware/authentication";
import { validator } from "../middleware/validation";

export const createAuthRoutes = (authService: IAuthService): express.Router => {
    const router = express.Router();
    const controller = new AuthController(authService);
    router.post(
        "/register",
        validator(RegisterUserDto, "body"),
        controller.register.bind(controller),
    );
    router.post(
        "/login",
        validator(LoginUserDto, "body"),
        controller.login.bind(controller),
    );

    router.post(
        "/refresh",
        authentication(true),
        controller.refresh.bind(controller),
    );

    return router;
};
