import express from "express";

import { authentication } from "../middleware/authentication";
import { getAuthLimiter } from "../middleware/rate-limit";

import { ExpressServerAttr } from "../server";
import { createAuthRoutes } from "./auth.route";
import { createChatsRoutes } from "./chats.route";
import { createProfileRoutes } from "./profile.route";

export const createRoutes = async (attrs: ExpressServerAttr) => {
    const router = express.Router();

    const authLimiter = await getAuthLimiter();
    router.use("/auth", authLimiter, createAuthRoutes(attrs.authService));
    router.use(
        "/profile",
        authentication(),
        createProfileRoutes(attrs.profileService),
    );
    router.use(
        "/chats",
        authentication(),
        createChatsRoutes(attrs.chatsService),
    );

    return router;
};
