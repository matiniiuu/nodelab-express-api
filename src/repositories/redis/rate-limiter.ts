import { createClient } from "redis";

import { envVariables } from "@src/config";
import { RedisStore } from "rate-limit-redis";

export class RedisRateLimiter {
    constructor() {
        this.init();
    }
    async init() {
        const client = createClient({
            url: envVariables.REDIS_URL,
            password: envVariables.REDIS_PASSWORD,
        });
        await client.connect();
        return new RedisStore({
            sendCommand: (...args: string[]) => client.sendCommand(args),
        });
    }
}
