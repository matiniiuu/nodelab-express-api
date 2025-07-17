import express from "express";

import { IChatsService } from "@src/domain";
import { ListRequest } from "@src/dto";

import { ChatsController } from "../controllers";
import { validator } from "../middleware/validation";

export const createChatsRoutes = (service: IChatsService): express.Router => {
    const router = express.Router();
    const controller = new ChatsController(service);
    router.get(
        "",
        validator(ListRequest, "query"),
        controller.findALl.bind(controller),
    );

    return router;
};
