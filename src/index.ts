import * as dotenv from "dotenv";
import "reflect-metadata";
dotenv.config();

import config from "./config";
import { config as AWSConfig } from "aws-sdk";
AWSConfig.update(config.aws_remote_config);
import { Postgresql, PostgresqlDataSource } from "./databases";
import {
    ChallengesRepository,
    ContactsRepository,
    UsersRepository,
} from "./repositories";
import { AuthService, ContactsService, UsersService } from "./services";
import { ChallengesService } from "./services/challenges.service";
import { ExpressServer } from "./transport/express/server";

(async (): Promise<void> => {
    try {
        const postgresql = new Postgresql();
        await postgresql.init();
        const usersRepository = new UsersRepository(PostgresqlDataSource);
        const contactsRepository = new ContactsRepository(PostgresqlDataSource);
        const challengesRepository = new ChallengesRepository(
            PostgresqlDataSource,
        );
        const authService = new AuthService(usersRepository);
        const usersService = new UsersService(usersRepository);
        const contactsService = new ContactsService(
            contactsRepository,
            usersRepository,
        );
        const challengesService = new ChallengesService(
            challengesRepository,
            usersRepository,
        );
        const expressServer = new ExpressServer({
            AuthService: authService,
            UsersService: usersService,
            ContactsService: contactsService,
            ChallengesService: challengesService,
        });
        expressServer.Start(config.port);
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
