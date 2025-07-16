import express from "express";
import { authentication } from "../middleware/authentication";
import { ExpressServerAttr } from "../server";
import { createAuthRoutes } from "./auth.route";
import { createChallengesRoutes } from "./challenges.route";
import { createContactsRoutes } from "./contacts.route";
import { createFilesRoutes } from "./files.route";
import { createUsersRoutes } from "./users.route";
export const createRoutes = (attrs: ExpressServerAttr) => {
    const router = express.Router();
    router.use("/auth", createAuthRoutes(attrs.AuthService));
    router.use(
        "/users",
        authentication(),
        createUsersRoutes(attrs.UsersService),
    );
    router.use(
        "/contacts",
        authentication(),
        createContactsRoutes(attrs.ContactsService),
    );
    router.use(
        "/challenges",
        authentication(),
        createChallengesRoutes(attrs.ChallengesService),
    );
    router.use("/files", authentication(), createFilesRoutes());
    return router;
};
