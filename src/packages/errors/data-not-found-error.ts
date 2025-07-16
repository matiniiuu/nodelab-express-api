import { CustomException } from "./custom-exception";

export class DataNotFoundError extends CustomException {
    statusCode = 404;

    constructor(public message: string) {
        super(message);

        Object.setPrototypeOf(this, DataNotFoundError.prototype);
    }

    serializeErrors() {
        return [{ message: this.message }];
    }
}
