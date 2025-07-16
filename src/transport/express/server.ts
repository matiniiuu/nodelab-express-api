import "./instrument";

import * as Sentry from "@sentry/node";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import http from "http";

import { IAuthService, IProfileService } from "@src/domain";
import { log } from "@src/helpers";
import { NotFoundException } from "@src/packages";
import { errorHandler } from "./middleware/error-handler";
import { morganMiddleware } from "./middleware/morgan";
import { limiter } from "./middleware/rate-limit";
import { createRoutes } from "./routes";
import swaggerDocs from "./swagger";

export type ExpressServerAttr = {
    authService: IAuthService;
    profileService: IProfileService;
};

export class ExpressServer {
    constructor(private readonly attrs: ExpressServerAttr) {
        this.Init();
    }

    app = express();
    server: http.Server = http.createServer(this.app);

    Init() {
        this.app.use(helmet());
        this.use(
            cors({
                origin: "*",
                methods: ["GET, POST, OPTIONS, PUT, PATCH, DELETE"],
                credentials: true,
            }),
        );
        this.app.use(express.json());
        this.app.use(morganMiddleware);
        this.app.use(limiter);
        this.app.use("/v1", createRoutes(this.attrs));
        swaggerDocs(this.app);
        this.app.all(/(.*)/, async () => {
            throw new NotFoundException();
        });
        Sentry.setupExpressErrorHandler(this.app);
        this.app.use(errorHandler);
    }
    private use(middleware: any) {
        this.app.use(middleware);
    }
    Start(port: number) {
        this.server.listen(port, () => {
            log.info(`Listening on port ${port}`);
        });
    }
    Shutdown() {
        log.info("Received kill signal, shutting down gracefully");
        this.server.close(() => log.info("Closed out remaining connections"));
        setTimeout(() => {
            console.error(
                "Could not close connections in time, forcefully shutting down",
            );
            process.exit(1);
        }, 10000);
    }
    get serverInstance(): http.Server {
        return this.server;
    }
}
