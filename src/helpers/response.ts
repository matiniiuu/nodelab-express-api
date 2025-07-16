import { Response } from "express";
import { Send } from "express-serve-static-core";

import { DataResponse, SuccessResponse } from "@src/dto";
export interface TypedResponse<ResBody> extends Response {
    json: Send<DataResponse<ResBody>, this>;
}
export interface StandardResponse extends Response {
    json: Send<SuccessResponse, this>;
}
