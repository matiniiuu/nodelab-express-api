import { CustomException } from "./custom-exception";

export class AwsError extends CustomException {
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
