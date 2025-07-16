import { Type } from "class-transformer";
import { IsInt, IsNumber, IsOptional, IsPositive } from "class-validator";

import { InvalidNumber } from "@src/config";

const numberOptions = {
    allowInfinity: false,
    allowNaN: false,
    maxDecimalPlaces: 2,
};
//* Float
export const IsOptionalFloat = () => {
    return function (target: any, propertyKey: string) {
        IsOptional()(target, propertyKey);
        IsRequiredFloat()(target, propertyKey);
    };
};
export const IsRequiredFloat = () => {
    return function (target: any, propertyKey: string) {
        IsNumber(numberOptions, {
            message: InvalidNumber(propertyKey),
        })(target, propertyKey);
        Type(() => Number)(target, propertyKey);
    };
};

// ------------------------------------------------------------ * 50

//* Int
export const IsOptionalInt = () => {
    return function (target: any, propertyKey: string) {
        IsOptional()(target, propertyKey);
        IsRequiredInt()(target, propertyKey);
    };
};

export const IsRequiredInt = () => {
    return function (target: any, propertyKey: string) {
        IsInt({ message: InvalidNumber(propertyKey) })(target, propertyKey);
        Type(() => Number)(target, propertyKey);
    };
};
export const IsRequiredUInt = () => {
    return function (target: any, propertyKey: string) {
        IsInt({ message: InvalidNumber(propertyKey) })(target, propertyKey);
        IsPositive();
        Type(() => Number)(target, propertyKey);
    };
};
