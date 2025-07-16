import { sanitize } from "class-sanitizer";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { NextFunction, Request, RequestHandler, Response } from "express";

import { RequestValidationException } from "@src/packages";

export const validator = (
    schema: any,
    reqSection: "body" | "query" | "params",
): RequestHandler => {
    return async (req: Request, res: Response, next: NextFunction) => {
        if (!req[reqSection]) {
            req[reqSection] = {};
        }
        const dtoObj = plainToInstance(schema, req[reqSection]);
        const errors = await validate(dtoObj);
        if (!errors.length) {
            //sanitize the object and call the next middleware
            sanitize(dtoObj);
            req[reqSection] = dtoObj;
            return next();
        }
        throw new RequestValidationException(errors);
    };
};
