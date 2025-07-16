import { ArrayMin } from "@src/config";
import { ArrayMinSize, IsArray, IsMongoId, IsOptional } from "class-validator";

export const IsOptionalMongoId = () => {
    return function (target: any, propertyKey: string) {
        IsOptional()(target, propertyKey);
        IsRequiredMongoId()(target, propertyKey);
    };
};
export const IsRequiredMongoId = () => {
    return function (target: any, propertyKey: string) {
        IsMongoId()(target, propertyKey);
    };
};
export const IsRequiredMongoIdArray = () => {
    return function (target: any, propertyKey: string) {
        IsArray()(target, propertyKey);
        ArrayMinSize(1, { message: ArrayMin(propertyKey) })(
            target,
            propertyKey,
        );
        IsMongoId({ each: true })(target, propertyKey);
    };
};
export const IsOptionalMongoIdArray = () => {
    return function (target: any, propertyKey: string) {
        IsOptional({ each: true })(target, propertyKey);
        IsArray()(target, propertyKey);
        IsMongoId({ each: true })(target, propertyKey);
    };
};
