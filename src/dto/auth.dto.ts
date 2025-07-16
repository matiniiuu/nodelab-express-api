import { Type } from "class-transformer";
import {
    IsEnum,
    IsInt,
    IsJWT,
    IsNotEmpty,
    IsOptional,
    IsPhoneNumber,
    IsString,
    MinLength,
} from "class-validator";
import { Email, Password, PhoneNumber } from "./index";
import { IdentityProvider } from "../enums";
import { invalidIdentityProvider } from "../constants";
export class SignUpRequest extends PhoneNumber(Email(Password(class {}))) {
    @IsString()
    @MinLength(3)
    firstName: string;

    @IsString()
    lastName: string;
}
export class SignInRequest extends Email(Password(class {})) {}
export class SocialSignInRequest {
    @IsEnum(IdentityProvider, { message: invalidIdentityProvider })
    identityProvider: IdentityProvider;

    @IsJWT()
    token: string;
}

export class VerifyRequest {
    @IsInt()
    @Type(() => Number)
    code: number;
}
export class ForgotPasswordRequest extends Email(class {}) {}
export class ResetPasswordRequest extends Email(Password(class {})) {
    @IsInt()
    @Type(() => Number)
    code: number;
}

export class AuthTokensResponse {
    accessToken: string;
    refreshToken: string;
}
