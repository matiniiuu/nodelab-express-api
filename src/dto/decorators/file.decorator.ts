import { IsOptional } from 'class-validator';
import { IsFile } from 'nestjs-form-data';

export const IsRequiredFile = () => {
    return function (target: any, propertyKey: string) {
        IsFile()(target, propertyKey);
    };
};

export const IsOptionalFile = () => {
    return function (target: any, propertyKey: string) {
        IsOptional()(target, propertyKey);
        IsFile()(target, propertyKey);
    };
};
