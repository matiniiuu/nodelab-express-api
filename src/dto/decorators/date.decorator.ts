import { IsISO8601, IsOptional } from "class-validator";

export const IsRequiredStringDateTime = () => {
    return function (target: any, propertyKey: string) {
        IsISO8601()(target, propertyKey);
    };
};

export const IsOptionalStringDateTime = () => {
    return function (target: any, propertyKey: string) {
        IsOptional()(target, propertyKey);
        IsISO8601()(target, propertyKey);
    };
};
