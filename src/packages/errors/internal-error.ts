import { CustomException } from "./custom-exception";

export class InternalError extends CustomException {
    statusCode = 500;

    constructor(message: string = "SomethingWentWrong") {
        super(message);

        Object.setPrototypeOf(this, InternalError.prototype);
    }

    serializeErrors() {
        return [{ message: this.message }];
    }
}
