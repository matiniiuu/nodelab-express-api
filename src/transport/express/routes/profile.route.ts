import express from "express";

import { IProfileService } from "@src/domain";
import { UpdateProfileDto } from "@src/dto";

import { ProfileController } from "../controllers";
import { authentication } from "../middleware";
import { validator } from "../middleware/validation";

export const createProfileRoutes = (
    service: IProfileService,
): express.Router => {
    const router = express.Router();
    const controller = new ProfileController(service);
    router.patch(
        "",
        validator(UpdateProfileDto, "body"),
        controller.update.bind(controller),
    );
    router.get("/me", authentication(), controller.me.bind(controller));

    return router;
};
