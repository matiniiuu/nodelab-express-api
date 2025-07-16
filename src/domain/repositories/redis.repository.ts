export interface IRedisRepository {
    socketAdapter();
    setOnlineUser(userId: string, socketId: string): Promise<void>;
    deleteOnlineUser(userId: string): Promise<void>;
    getOnlineUser(userId: string): Promise<string>;
}
