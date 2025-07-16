import { rateLimit } from "express-rate-limit";

export const limiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    limit: 100,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    ipv6Subnet: 56,
});
export const authLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    limit: 50,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    ipv6Subnet: 56,
});
