import { BaseResponse } from './base.res';

export class SuccessResponse extends BaseResponse {
    constructor(message: string) {
        super();
        this.message = message;
    }
}
export type SuccessReply = Promise<SuccessResponse>;
