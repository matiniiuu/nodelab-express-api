import { AuthenticationRequired } from "../../constants";
import { CustomError } from "./custom-error";

export class NotAuthenticatedError extends CustomError {
    statusCode = 401;
    constructor(message: string = AuthenticationRequired) {
        super(message);
        Object.setPrototypeOf(this, NotAuthenticatedError.prototype);
    }
    serializeErrors() {
        return [{ message: this.message }];
    }
}
