import { AuthenticationRequired } from "@src/config";

import { CustomException } from "./custom-exception";

export class NotAuthenticatedException extends CustomException {
    statusCode = 401;
    constructor(message: string = AuthenticationRequired) {
        super(message);
        Object.setPrototypeOf(this, NotAuthenticatedException.prototype);
    }
    serializeErrors() {
        return [{ message: this.message }];
    }
}
