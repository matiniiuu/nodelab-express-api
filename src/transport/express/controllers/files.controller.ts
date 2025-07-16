import httpStatus from "http-status";
import { Request } from "express";
import { StandardResponse } from "../../../helpers/response";
import { upload } from "../../../helpers/express-file-upload";
import { BadRequestError } from "../../../packages/errors/bad-request-error";
import { fileRequired } from "../../../constants";

export class FilesController {
    constructor() {}
    async upload(req: Request, res: StandardResponse) {
        if (!req.files || !req.files["file"]) {
            throw new BadRequestError(fileRequired);
        }
        const url = await upload(req.files["file"]);
        res.status(httpStatus.OK).json({
            payload: { url },
            success: true,
        });
    }
}
