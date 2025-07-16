import { plainToClass, plainToInstance } from "class-transformer";
import { validate, ValidationError } from "class-validator";
import { Request, Response, NextFunction, RequestHandler } from "express";
import { sanitize } from "class-sanitizer";
import { RequestValidationError } from "../../../packages/errors/request-validation-error";

export const validator = (
    schema: any,
    reqSection: "body" | "query" | "params",
): RequestHandler => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const dtoObj = plainToInstance(schema, req[reqSection]);
        const errors = await validate(dtoObj);
        if (!errors.length) {
            //sanitize the object and call the next middleware
            sanitize(dtoObj);
            req[reqSection] = dtoObj;
            return next();
        }
        throw new RequestValidationError(errors);
    };
};
