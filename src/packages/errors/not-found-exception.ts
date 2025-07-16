import { NotFound } from "@src/config";
import { CustomException } from "./custom-exception";

export class NotFoundException extends CustomException {
    statusCode = 404;

    constructor(public message: string = NotFound) {
        super(message);

        Object.setPrototypeOf(this, NotFoundException.prototype);
    }

    serializeErrors() {
        return [{ message: this.message }];
    }
}
