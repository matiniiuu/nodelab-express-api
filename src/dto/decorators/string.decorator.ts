import { ArrayMin } from "@src/config";
import { ArrayMinSize, IsArray, IsOptional, IsString } from "class-validator";

//* String
export const IsOptionalString = () => {
    return function (target: any, propertyKey: string) {
        IsOptional()(target, propertyKey);
        IsRequiredString()(target, propertyKey);
    };
};

export const IsRequiredString = () => {
    return function (target: any, propertyKey: string) {
        IsString()(target, propertyKey);
    };
};
export const IsOptionalStringArray = () => {
    return function (target: any, propertyKey: string) {
        IsOptional()(target, propertyKey);
        IsArray()(target, propertyKey);
        IsString({ each: true })(target, propertyKey);
    };
};

export const IsRequiredStringArray = () => {
    return function (target: any, propertyKey: string) {
        IsArray()(target, propertyKey);
        ArrayMinSize(1, { message: ArrayMin(propertyKey) })(
            target,
            propertyKey,
        );
        IsString({ each: true })(target, propertyKey);
    };
};
