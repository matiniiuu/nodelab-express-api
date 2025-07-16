import { Type } from "class-transformer";
import {
    IsEnum,
    IsInt,
    IsNotEmptyObject,
    IsOptional,
    IsString,
    IsUUID,
} from "class-validator";
import { ListRequest } from ".";
import { ContactsStatus } from "../domain/enums";

export class ContactsRequest {
    @IsUUID()
    recipient: string;
}
export class ContactsUpdateStatusRequest {
    @IsEnum(ContactsStatus)
    status: ContactsStatus;
}
export class ContactsListFilterRequest {
    status: string;
    @IsUUID()
    "profile.id": string;
}

export class ContactsListRequest extends ListRequest {
    filter: ContactsListFilterRequest;
}

export class ContactsSuggestionsFilterRequest {
    @IsString()
    name: string;
}
export class ContactsSuggestionsRequest {
    @IsNotEmptyObject()
    filter: ContactsSuggestionsFilterRequest;

    @IsOptional()
    @IsInt()
    @Type(() => Number)
    size: number = 10;
}
