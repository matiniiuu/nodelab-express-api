import express from "express";
import { EditProfileRequest, IdDto, SearchUsersRequest } from "../../../dto";
import { IUsersService } from "../../../services";
import { UsersController } from "../controllers";
import { validator } from "../middleware/validation";
export const createUsersRoutes = (
    usersService: IUsersService,
): express.Router => {
    const router = express.Router();
    const usersController = new UsersController(usersService);

    router.get("/profile", usersController.profile.bind(usersController));
    router.get(
        "/profile/:id",
        validator(IdDto, "params"),
        usersController.findOne.bind(usersController),
    );
    router.put(
        "/profile",
        validator(EditProfileRequest, "body"),
        usersController.editProfile.bind(usersController),
    );
    router.get(
        "/search",
        validator(SearchUsersRequest, "query"),
        usersController.searchUsers.bind(usersController),
    );
    return router;
};
