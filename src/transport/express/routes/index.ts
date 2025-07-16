import express from "express";

import { authentication } from "../middleware/authentication";
import { authLimiter } from "../middleware/rate-limit";

import { ExpressServerAttr } from "../server";
import { createAuthRoutes } from "./auth.route";
import { createProfileRoutes } from "./profile.route";

export const createRoutes = (attrs: ExpressServerAttr) => {
    const router = express.Router();
    router.use("/auth", authLimiter, createAuthRoutes(attrs.AuthService));
    router.use(
        "/profile",
        authentication(),
        createProfileRoutes(attrs.ProfileService),
    );

    return router;
};
