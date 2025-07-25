import { envVariables } from "@src/config";
import { createLogger, format, transports } from "winston";
const { combine, timestamp, colorize, printf } = format;

const loggerFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} ${level}: ${message}`;
});

export const apiLogger = createLogger({
    level: envVariables.LOGGER_LEVEL,
    format: combine(timestamp(), loggerFormat),
    transports: [
        new transports.Console(),
        new transports.File({ filename: "./logs/error.log", level: "error" }),
        new transports.File({ filename: "./logs/combined.log" }),
    ],
});
