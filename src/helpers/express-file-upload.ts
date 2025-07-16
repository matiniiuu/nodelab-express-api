import "core-js/features/array/at";

import eFileUpload from "express-fileupload";
import { v4 as uuid } from "uuid";

import config from "../config";
import { invalidFileType } from "../constants";
import { uploadObject } from "../libraries/aws";
import { BadRequestError } from "../packages/errors/bad-request-error";

const generateFilename = (originalFilename: string): string => {
    return `${uuid()}.${originalFilename.split(".").at(-1)}`;
};

export const upload = async (
    reqFile: eFileUpload.UploadedFile | eFileUpload.UploadedFile[],
): Promise<string> => {
    let files: eFileUpload.UploadedFile[] = [];
    files = files.concat(reqFile);
    const file = files[0];

    if (!config.allowed_image_mimetype.includes(file.mimetype))
        throw new BadRequestError(invalidFileType);
    const folder = file.mimetype.split("/")[0];
    const filename = `${folder}/${generateFilename(file.name)}`;
    return uploadObject(filename, file.data);
};
