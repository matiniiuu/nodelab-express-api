import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { envVariables, RefreshTokenRequired } from "@src/config";
import { UserJwtPayload } from "@src/domain";
import { NotAuthenticatedException } from "@src/packages";

export const authentication = (refreshTokenRequired: boolean = false) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const accessToken = req.headers["authorization"]?.split(" ")[1];
        if (!accessToken) throw new NotAuthenticatedException();
        const refreshToken = (req.headers["refresh"] as string)?.split(" ")[1];
        if (refreshTokenRequired && !refreshToken)
            throw new NotAuthenticatedException(RefreshTokenRequired);

        req.user = jwt.verify(
            accessToken,
            envVariables.JWT_ACCESS_SECRET,
        ) as UserJwtPayload;

        req.accessToken = accessToken;
        req.refreshToken = refreshToken;
        next();
    };
};
