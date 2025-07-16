import winston from "winston";
import path from "path";
import { ILogger } from ".";
const errorsFile = path.join(__dirname, "..", "..", "logs", "errors.log");

export const logger: ILogger = winston.createLogger({
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: errorsFile, level: "error" }),
    ],
});
