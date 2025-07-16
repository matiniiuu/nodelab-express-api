import { Request } from "express";
import { ParamsDictionary, Query } from "express-serve-static-core";

import { UserJwtPayload } from "@src/domain";
declare global {
    namespace Express {
        interface Request {
            user?: UserJwtPayload;
            accessToken: string;
            refreshToken: string;
        }
    }
}
export interface TypedRequestQB<T extends Query, U> extends Request {
    query: T;
    body: U;
}
export interface TypedRequestBody<T> extends Request {
    body: T;
}
export interface TypedRequestQuery<T extends Query> extends Request {
    query: T;
}
export interface TypedRequestParams<T extends ParamsDictionary>
    extends Request {
    params: T;
}
