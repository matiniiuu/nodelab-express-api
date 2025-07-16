import * as dotenv from "dotenv";
import "reflect-metadata";
dotenv.config();

import { envVariables } from "./config";
import { UserMongoDB } from "./repositories/mongodb";
import { AuthService } from "./services";
import { ExpressServer } from "./transport/express/server";

(async (): Promise<void> => {
    try {
        const usersRepository = new UserMongoDB();

        const authService = new AuthService(usersRepository);
        const expressServer = new ExpressServer({
            AuthService: authService,
        });
        console.log(envVariables.PORT);

        expressServer.Start(+envVariables.PORT);
        // process
        //     .on("SIGTERM", expressServer.Shutdown.bind(expressServer))
        //     .on("SIGINT", expressServer.Shutdown.bind(expressServer))
        //     .on(
        //         "uncaughtException",
        //         expressServer.Shutdown.bind(expressServer),
        //     );
    } catch (error) {
        console.log(error);
    }
})();
