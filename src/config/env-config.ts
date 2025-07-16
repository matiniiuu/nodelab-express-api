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
            .default("production"),
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
    })
    .unknown()
    .required();

const { error, value } = envSchema.validate(process.env);

if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}
export const envVariables: typeof config = value as typeof config;
