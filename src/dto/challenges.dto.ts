import {
    IsEnum,
    IsNumber,
    IsPositive,
    IsString,
    IsUUID,
    MinLength,
} from "class-validator";
import { ListRequest } from ".";
import { ChallengeStatus } from "../enums";

export class ChallengesRequest {
    @IsUUID()
    opponent: string;

    @IsString()
    @MinLength(3)
    title: string;

    @IsString()
    @MinLength(3)
    description: string;

    @IsNumber({ maxDecimalPlaces: 2 })
    @IsPositive()
    amount: number;

    @IsString()
    @MinLength(3)
    media: string;
}
export class ChallengesUpdateStatusRequest {
    @IsEnum(ChallengeStatus)
    status: ChallengeStatus;
}
export class ChallengesListFilterRequest {
    status: string;
}

export class ChallengesListRequest extends ListRequest {
    filter: ChallengesListFilterRequest;
}
