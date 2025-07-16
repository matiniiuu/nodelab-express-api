import { CustomException } from "./custom-exception";

export class DatabaseConnectionError extends CustomException {
    statusCode = 500;
    reason = "Error connecting to database";

    constructor() {
        super("Error connecting to db");

        Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
    }

    serializeErrors() {
        return [{ message: this.reason }];
    }
}
