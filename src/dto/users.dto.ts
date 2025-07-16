import { IsOptional, IsString, IsUrl, MinLength } from "class-validator";
import { PhoneNumber } from "./index";

export class EditProfileRequest extends PhoneNumber(class {}) {
    @IsString()
    @MinLength(3)
    firstName: string;

    @IsString()
    lastName: string;

    @IsOptional()
    @IsString()
    @MinLength(3)
    bio: string;

    @IsOptional()
    @IsString()
    @MinLength(3)
    location: string;

    @IsOptional()
    @IsUrl()
    picture: string;
}
export class SearchUsersRequest {
    @IsString()
    name: string;
}
