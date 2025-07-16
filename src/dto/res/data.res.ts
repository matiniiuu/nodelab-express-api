import { BaseResponse } from "./base.res";

export class DataResponse<T> extends BaseResponse {
    data: T;

    constructor(data: T) {
        super();
        this.data = data;
    }
}
export type DataReply<T> = Promise<DataResponse<T>>;
