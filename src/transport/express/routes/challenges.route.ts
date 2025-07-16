import express from "express";
import {
    ChallengesListRequest,
    ChallengesRequest,
    ChallengesUpdateStatusRequest,
    IdDto,
} from "../../../dto";
import { IChallengesService } from "../../../services/challenges.service";
import { ChallengesController } from "../controllers";
import { validator } from "../middleware/validation";
export const createChallengesRoutes = (
    challengesService: IChallengesService,
): express.Router => {
    const router = express.Router();
    const challengesController = new ChallengesController(challengesService);

    router.post(
        "",
        validator(ChallengesRequest, "body"),
        challengesController.add.bind(challengesController),
    );
    router.get(
        "",
        validator(ChallengesListRequest, "query"),
        challengesController.list.bind(challengesController),
    );
    router.put(
        "/:id",
        validator(IdDto, "params"),
        validator(ChallengesUpdateStatusRequest, "body"),
        challengesController.updateStatus.bind(challengesController),
    );
    router.delete(
        "/:id",
        validator(IdDto, "params"),
        challengesController.delete.bind(challengesController),
    );
    return router;
};
