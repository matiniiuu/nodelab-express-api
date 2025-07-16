import { ValidationError } from "class-validator";
import { CustomException } from "./custom-exception";

export class RequestValidationException extends CustomException {
    statusCode = 400;

    constructor(public errors: ValidationError[]) {
        super("Invalid request parameters");

        // Only because we are extending a built in class
        Object.setPrototypeOf(this, RequestValidationException.prototype);
    }

    serializeErrors() {
        return this.errors.map((err) => {
            return {
                message: (Object as any).values(err.constraints).join(", "),
                field: err.property,
            };
        });
    }
}
