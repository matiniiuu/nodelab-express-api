import { IsEmail } from "class-validator";

//* Email
export const IsRequiredEmail = () => {
    return function (target: any, propertyKey: string) {
        IsEmail()(target, propertyKey);
    };
};
