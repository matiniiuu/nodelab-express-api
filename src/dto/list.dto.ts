import { SortEnum } from "@src/domain";
import { IsOptionalEnum, IsOptionalInt, IsOptionalString } from "./decorators";

export class ListRequest {
    [key: string]: any;

    @IsOptionalEnum(SortEnum)
    sort: SortEnum = SortEnum.desc;

    @IsOptionalInt()
    page: number = 1;

    @IsOptionalInt()
    limit: number = 10;

    @IsOptionalString()
    searchText?: string;
}
