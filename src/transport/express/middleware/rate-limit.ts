import { RedisRateLimiter } from "@src/repositories/redis/rate-limiter";
import { rateLimit } from "express-rate-limit";

export const getLimiter = async () => {
    const store = await new RedisRateLimiter().init();
    return rateLimit({
        windowMs: 1 * 60 * 1000,
        limit: 100,
        standardHeaders: "draft-8",
        legacyHeaders: false,
        ipv6Subnet: 56,
        store,
    });
};
export const getAuthLimiter = async () => {
    const store = await new RedisRateLimiter().init();

    return rateLimit({
        windowMs: 1 * 60 * 1000,
        limit: 50,
        standardHeaders: "draft-8",
        legacyHeaders: false,
        ipv6Subnet: 56,
        store,
    });
};
