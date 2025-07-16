import { ArrayMin } from "@src/config";
import { ArrayMinSize, IsArray, IsOptional, IsUUID } from "class-validator";

export const IsOptionalUuid = () => {
    return function (target: any, propertyKey: string) {
        IsOptional()(target, propertyKey);
        IsRequiredUuid()(target, propertyKey);
    };
};

export const IsRequiredUuidArray = (version?: validator.UUIDVersion) => {
    return function (target: any, propertyKey: string) {
        IsArray()(target, propertyKey);
        ArrayMinSize(1, { message: ArrayMin(propertyKey) })(
            target,
            propertyKey,
        );
        IsUUID(version, { each: true })(target, propertyKey);
    };
};

export const IsRequiredUuid = (version?: validator.UUIDVersion) => {
    return function (target: any, propertyKey: string) {
        IsUUID(version)(target, propertyKey);
    };
};
