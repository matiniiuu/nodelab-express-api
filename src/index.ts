import * as dotenv from "dotenv";
import mongoose from "mongoose";
import "reflect-metadata";
dotenv.config();

import { envVariables } from "./config";
import { log } from "./helpers";
import {
    ChatsMongoDB,
    MessagesMongoDB,
    UsersMongoDB,
} from "./repositories/mongodb";
import { RedisAdapter } from "./repositories/redis";
import { AuthService, ChatsService, ProfileService } from "./services";
import { MessagesService } from "./services/messages.service";
import { ExpressServer } from "./transport/express/server";
import {
    ConsumerMessagesRabbitMQ,
    ProducerMessagesRabbitMQ,
} from "./transport/rabbitmq";
import { SocketIoServer } from "./transport/socket.io";

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

        const producerMessagesRabbitMQ = new ProducerMessagesRabbitMQ();

        const redisRepository = new RedisAdapter();
        const usersRepository = new UsersMongoDB();
        const chatsRepository = new ChatsMongoDB();
        const messagesRepository = new MessagesMongoDB();

        const authService = new AuthService(usersRepository);
        const profileService = new ProfileService(usersRepository);
        const chatsService = new ChatsService(chatsRepository);
        const messageService = new MessagesService(
            producerMessagesRabbitMQ,
            messagesRepository,
            chatsService,
        );

        const expressServer = new ExpressServer({
            authService: authService,
            profileService: profileService,
        });

        expressServer.Start(+envVariables.PORT);
        new SocketIoServer(expressServer.server, {
            redisRepository,
            messageService,
        });
        new ConsumerMessagesRabbitMQ().setupMessagesConsumers(messageService);
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
