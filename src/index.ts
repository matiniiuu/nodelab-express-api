import * as dotenv from "dotenv";
import mongoose from "mongoose";
import "reflect-metadata";
dotenv.config();

import { envVariables } from "./config";
import { log } from "./helpers";
import { UserMongoDB } from "./repositories/mongodb";
import { AuthService, ProfileService } from "./services";
import { ExpressServer } from "./transport/express/server";

(async (): Promise<void> => {
    try {
        try {
            await mongoose.connect(envVariables.MONGODB_DB_URL, {
                dbName: envVariables.MONGODB_DB_NAME,
            });
            log.info("DB connected");
        } catch (error) {
            log.error("Could not connect to db");
            process.exit(1);
        }

        const usersRepository = new UserMongoDB();

        const authService = new AuthService(usersRepository);
        const profileService = new ProfileService(usersRepository);

        const expressServer = new ExpressServer({
            AuthService: authService,
            ProfileService: profileService,
        });

        expressServer.Start(+envVariables.PORT);
        // process
        //     .on("SIGTERM", expressServer.Shutdown.bind(expressServer))
        //     .on("SIGINT", expressServer.Shutdown.bind(expressServer))
        //     .on(
        //         "uncaughtException",
        //         expressServer.Shutdown.bind(expressServer),
        //     );
    } catch (error) {
        log.error(error);
    }
})();
