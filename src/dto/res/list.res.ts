import { BaseResponse } from "./base.res";

export class ListResponseData<T> {
    result: T[];

    total: number;
}

export class ListResponse<T> extends BaseResponse {
    data: ListResponseData<T>;

    constructor(result: T[], total: number) {
        super();
        this.data = {
            result: result?.length ? result : [],
            total: total ? total : 0,
        };
    }
}

export type ListReply<T> = Promise<ListResponse<T>>;
