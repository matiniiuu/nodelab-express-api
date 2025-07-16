import { AuthorizationFailed } from "../../constants";
import { CustomError } from "./custom-error";

export class NotAuthorizedError extends CustomError {
    statusCode = 403;
    constructor() {
        super(AuthorizationFailed);
        Object.setPrototypeOf(this, NotAuthorizedError.prototype);
    }
    serializeErrors() {
        return [{ message: AuthorizationFailed }];
    }
}
