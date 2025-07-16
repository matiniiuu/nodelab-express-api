import { CustomError } from "./custom-exception";

export class DataNotFoundError extends CustomError {
    statusCode = 404;

    constructor(public message: string) {
        super(message);

        Object.setPrototypeOf(this, DataNotFoundError.prototype);
    }

    serializeErrors() {
        return [{ message: this.message }];
    }
}
