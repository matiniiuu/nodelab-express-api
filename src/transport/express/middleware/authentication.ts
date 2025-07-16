import { bool } from "aws-sdk/clients/signer";
import { NextFunction, Request, Response } from "express";
import { RefreshTokenRequired } from "../../../constants";
import { verifyAccessToken } from "../../../libraries/aws";
import { NotAuthenticatedError } from "../../../packages/errors/not-authenticated-error";

export const authentication = (refreshTokenRequired: bool = false) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const accessToken = req.headers["authorization"]?.split(" ")[1];
        if (!accessToken) throw new NotAuthenticatedError();
        const refreshToken = (req.headers["refresh"] as string)?.split(" ")[1];
        if (refreshTokenRequired && !refreshToken)
            throw new NotAuthenticatedError(RefreshTokenRequired);

        req.user = await verifyAccessToken(accessToken);
        req.accessToken = accessToken;
        req.refreshToken = refreshToken;
        next();
    };
};
