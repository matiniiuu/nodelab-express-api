import { Type } from "class-transformer";
import {
    IsEmail,
    IsInt,
    IsNotEmpty,
    IsNumberString,
    IsOptional,
    IsUUID,
    Length,
    MaxLength,
    MinLength,
} from "class-validator";

import { invalidPassword } from "../constants";
type Constructor<T = {}> = new (...args: any[]) => T;

export function Email<TBase extends Constructor>(Base: TBase) {
    class Email extends Base {
        @IsEmail()
        email: string;
    }

    return Email;
}
export function Password<TBase extends Constructor>(Base: TBase) {
    class Password extends Base {
        @IsNotEmpty()
        @MinLength(6, { message: invalidPassword })
        @MaxLength(20, { message: invalidPassword })
        // @Matches(passwordRegex, { message: invalidPassword })
        password: string;
    }

    return Password;
}
export function PhoneNumber<TBase extends Constructor>(Base: TBase) {
    class PhoneNumber extends Base {
        @IsNumberString()
        @Length(10, 10)
        phoneNumber: string;
    }

    return PhoneNumber;
}
export class IdDto {
    @IsUUID()
    id: string;
}
export class ListRequest {
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    size: number = 10;

    @IsOptional()
    @IsInt()
    @Type(() => Number)
    page: number = 1;

    @IsOptional()
    sort: string;
}
export class ListResponse<T> {
    payload: T[];
    meta: {
        page: number;
        size: number;
        totalNumberOfPages: number;
        nextPage: number;
    };
}
export * from "./auth.dto";
export * from "./challenges.dto";
export * from "./contacts.dto";
export * from "./users.dto";
