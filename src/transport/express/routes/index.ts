import express from "express";

import { authentication } from "../middleware/authentication";
import { ExpressServerAttr } from "../server";
import { createAuthRoutes } from "./auth.route";
import { createProfileRoutes } from "./profile.route";

export const createRoutes = (attrs: ExpressServerAttr) => {
    const router = express.Router();
    router.use("/auth", createAuthRoutes(attrs.AuthService));
    router.use(
        "/profile",
        authentication(),
        createProfileRoutes(attrs.ProfileService),
    );

    return router;
};
