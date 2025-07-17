import { createClient, RedisClientType } from "redis";

import { createShardedAdapter } from "@socket.io/redis-adapter";
import { envVariables } from "@src/config";
import { IRedisRepository } from "@src/domain";

export class RedisAdapter implements IRedisRepository {
    constructor() {
        this.init();
    }

    private client: RedisClientType;
    async init() {
        this.client = createClient({
            url: envVariables.REDIS_URL,
            password: envVariables.REDIS_PASSWORD,
        });
    }
    async socketAdapter() {
        const subClient = this.client.duplicate();

        await Promise.all([this.client.connect(), subClient.connect()]);
        return createShardedAdapter(this.client, subClient);
    }
    async setOnlineUser(userId: string, socketId: string): Promise<void> {
        await this.client.hSet("online_users", userId, socketId);
    }

    async deleteOnlineUser(userId: string): Promise<void> {
        await this.client.hDel("online_users", userId);
    }
    async getOnlineUser(userId: string): Promise<string | null> {
        return (await this.client.hGet("online_users", userId)) as string;
    }
    async getOnlineUsers(): Promise<string[]> {
        const users = await this.client.hGetAll("online_users");
        return Object.values(users); // returns array of socketIds
    }
}
