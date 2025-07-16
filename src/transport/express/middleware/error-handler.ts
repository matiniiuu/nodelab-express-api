import { NextFunction, Request, Response } from "express";

import { CustomException } from "@src/packages";
export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    if (err instanceof CustomException) {
        return res
            .status(err.statusCode)
            .send({ errors: err.serializeErrors() });
    }

    res.status(500).send({
        errors: [{ message: err.message }],
    });
};
