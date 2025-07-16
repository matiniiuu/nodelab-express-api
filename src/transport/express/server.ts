import cors from "cors";
import express from "express";
import helmet from "helmet";
import http from "http";

import { IAuthService, IProfileService } from "@src/domain";
import { NotFoundException } from "@src/packages";

import { errorHandler } from "./middleware/error-handler";
import { createRoutes } from "./routes";

export type ExpressServerAttr = {
    AuthService: IAuthService;
    ProfileService: IProfileService;
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
        this.app.use("/v1", createRoutes(this.attrs));
        this.app.all(/(.*)/, async () => {
            throw new NotFoundException();
        });
        this.app.use(errorHandler);
    }
    private use(middleware: any) {
        this.app.use(middleware);
    }
    Start(port: number) {
        this.server.listen(port, () => {
            console.log(`Listening on port ${port}`);
        });
    }
    Shutdown() {
        console.log("Received kill signal, shutting down gracefully");
        this.server.close(() =>
            console.log("Closed out remaining connections"),
        );
        setTimeout(() => {
            console.error(
                "Could not close connections in time, forcefully shutting down",
            );
            process.exit(1);
        }, 10000);
    }
}
