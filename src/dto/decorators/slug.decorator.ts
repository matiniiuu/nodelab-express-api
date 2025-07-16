import { Transform } from "class-transformer";
import { IsOptional, IsString } from "class-validator";

export const IsOptionalSlug = () => {
    return function (target: any, propertyKey: string) {
        IsOptional()(target, propertyKey);
        IsRequiredSlug()(target, propertyKey);
    };
};

export const IsRequiredSlug = () => {
    return function (target: any, propertyKey: string) {
        IsString()(target, propertyKey);
        Transform(({ value }) => value.toLowerCase().replace(/\s+/g, "-"))(
            target,
            propertyKey,
        );
    };
};
