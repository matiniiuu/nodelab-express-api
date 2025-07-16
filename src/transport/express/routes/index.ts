import express from "express";

import { authentication } from "../middleware/authentication";
import { authLimiter } from "../middleware/rate-limit";

import { ExpressServerAttr } from "../server";
import { createAuthRoutes } from "./auth.route";
import { createProfileRoutes } from "./profile.route";

export const createRoutes = (attrs: ExpressServerAttr) => {
    const router = express.Router();
    router.use("/auth", authLimiter, createAuthRoutes(attrs.authService));
    router.use(
        "/profile",
        authentication(),
        createProfileRoutes(attrs.profileService),
    );

    return router;
};
