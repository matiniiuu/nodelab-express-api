import config from "../config";
import { DataSource } from "typeorm";

export const PostgresqlDataSource = new DataSource({
    type: "postgres",
    host: config.postgres_host,
    username: config.postgres_username,
    password: config.postgres_password,
    database: config.postgres_database,
    synchronize: true,
    logging: false,
    entities: [__dirname + "/../**/*.entity.{js,ts}"],
    migrations: [],
    subscribers: [],
});
export class Postgresql {
    async init() {
        try {
            await this.connect();
        } catch (error) {
            throw error;
        }
    }
    connect() {
        return new Promise<void>((resolve, reject) => {
            PostgresqlDataSource.initialize()
                .then(() => {
                    resolve();
                })
                .catch((error) => reject(error));
        });
    }
    async close() {
        await PostgresqlDataSource.close();
    }

    migration() {}
}
