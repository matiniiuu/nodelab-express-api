import { ArrayMin } from "@src/config";
import { ArrayMinSize, IsArray, IsEnum, IsOptional } from "class-validator";

//* Enum
export const IsOptionalEnum = (enumType: any) => {
    return function (target: any, propertyKey: string) {
        IsOptional()(target, propertyKey);
        IsRequiredEnum(enumType)(target, propertyKey);
    };
};
export const IsRequiredEnum = (enumType: any) => {
    return function (target: any, propertyKey: string) {
        IsEnum(enumType)(target, propertyKey);
    };
};
export const IsRequiredEnumArray = (enumType: any) => {
    return function (target: any, propertyKey: string) {
        IsArray()(target, propertyKey);
        ArrayMinSize(1, { message: ArrayMin(propertyKey) })(
            target,
            propertyKey,
        );
        IsEnum(enumType, { each: true })(target, propertyKey);
    };
};
