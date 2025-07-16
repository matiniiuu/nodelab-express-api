import { CustomError } from "./custom-error";

export class AwsError extends CustomError {
    statusCode = 500;

    constructor(statusCode: number, message: string) {
        super(message);
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, AwsError.prototype);
    }

    serializeErrors() {
        return [{ message: this.message }];
    }
}
