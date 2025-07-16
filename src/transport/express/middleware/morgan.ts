import chalk from "chalk";
import morgan from "morgan";
export const morganMiddleware = morgan(function (tokens, req, res) {
    return [
        chalk.cyanBright(" - " + tokens.date(req, res)),
        chalk.green(tokens.method(req, res)),
        chalk.yellowBright(tokens.status(req, res)),
        chalk.bold(tokens.url(req, res)),
        chalk.bgWhiteBright.black.bold(
            tokens["response-time"](req, res) + " ms",
        ),
        chalk.blueBright(tokens["remote-addr"](req, res)),
        chalk.redBright("from " + tokens.referrer(req, res)),
        chalk.yellowBright(tokens["user-agent"](req, res)),
    ].join(" ");
});
