import httpStatus from "http-status";

import { IChatsService } from "@src/domain";
import { ListRequest } from "@src/dto";
import { StandardResponse, TypedRequestQuery } from "@src/helpers";

export class ChatsController {
    constructor(private readonly service: IChatsService) {}

    async findALl(req: TypedRequestQuery<ListRequest>, res: StandardResponse) {
        res.status(httpStatus.OK).json(
            await this.service.list(req.user.id, req.query),
        );
    }
}
