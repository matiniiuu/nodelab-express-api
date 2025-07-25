import joi from "joi";
const config = {
    PORT: "PORT",
    //* Mongodb
    MONGODB_DB_URL: "MONGODB_DB_URL",
    MONGODB_DB_NAME: "MONGODB_DB_NAME",
    //* Logger
    NODE_ENV: "NODE_ENV",
    LOGGER_LEVEL: "LOGGER_LEVEL",
    //* Auth
    JWT_ACCESS_SECRET: "JWT_ACCESS_SECRET",
    JWT_ACCESS_EXPIRATION_TIME: "JWT_ACCESS_EXPIRATION_TIME",
    JWT_REFRESH_SECRET: "JWT_REFRESH_SECRET",
    JWT_REFRESH_EXPIRATION_TIME: "JWT_REFRESH_EXPIRATION_TIME",

    SENTRY_DSN: "SENTRY_DSN",

    REDIS_URL: "REDIS_URL",
    REDIS_PASSWORD: "REDIS_PASSWORD",

    RABBITMQ_URI: "RABBITMQ_URI",

    SWAGGER_USERNAME: "SWAGGER_USERNAME",
    SWAGGER_PASSWORD: "SWAGGER_PASSWORD",
};
const envSchema = joi
    .object({
        [config.PORT]: joi.number().required(),
        //* Mongodb
        [config.MONGODB_DB_URL]: joi.string().required(),
        [config.MONGODB_DB_NAME]: joi.string().required(),
        //* Logger
        [config.NODE_ENV]: joi
            .string()
            .allow("development", "production", "test")
            .default("development"),
        [config.LOGGER_LEVEL]: joi
            .string()
            .allow("test", "error", "warn", "info", "verbose", "debug", "silly")
            .when("NODE_ENV", {
                is: "development",
                then: joi.string().default("silly"),
            })
            .when("NODE_ENV", {
                is: "production",
                then: joi.string().default("info"),
            })
            .when("NODE_ENV", {
                is: "test",
                then: joi.string().default("warn"),
            }),
        //* Auth
        [config.JWT_ACCESS_SECRET]: joi.string().required(),
        [config.JWT_ACCESS_EXPIRATION_TIME]: joi.string().required(),
        [config.JWT_REFRESH_SECRET]: joi.string().required(),
        [config.JWT_REFRESH_EXPIRATION_TIME]: joi.string().required(),

        [config.SENTRY_DSN]: joi.string().required(),

        [config.REDIS_URL]: joi.string().required(),
        [config.REDIS_PASSWORD]: joi.string().required(),

        [config.RABBITMQ_URI]: joi.string().required(),

        [config.SWAGGER_USERNAME]: joi.string().required(),
        [config.SWAGGER_PASSWORD]: joi.string().required(),
    })
    .unknown()
    .required();

const { error, value } = envSchema.validate(process.env);

if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}
export const envVariables: typeof config = value as typeof config;
