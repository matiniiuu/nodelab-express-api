import { AuthorizationFailed } from "../../constants";
import { CustomException } from "./custom-exception";

export class NotAuthorizedError extends CustomException {
    statusCode = 403;
    constructor() {
        super(AuthorizationFailed);
        Object.setPrototypeOf(this, NotAuthorizedError.prototype);
    }
    serializeErrors() {
        return [{ message: AuthorizationFailed }];
    }
}
