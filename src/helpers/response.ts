import { Response } from "express";
import { Send } from "express-serve-static-core";
import { HttpResponse } from "../constants";

export interface TypedResponse<ResBody> extends Response {
    json: Send<ResBody, this>;
}
export interface StandardResponse extends Response {
    json: Send<HttpResponse, this>;
}
