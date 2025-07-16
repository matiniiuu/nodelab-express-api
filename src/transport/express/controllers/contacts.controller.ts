import httpStatus from "http-status";
import { ContactsRequest, ContactsUpdateStatusRequest } from "../../../dto";
import {
    TypedRequestBody,
    TypedRequestParams,
    TypedRequestQB,
    TypedRequestQuery,
} from "../../../helpers/request";
import { StandardResponse } from "../../../helpers/response";
import { IContactsService } from "../../../services";

export class ContactsController {
    constructor(private readonly contactsService: IContactsService) {}
    async add(req: TypedRequestBody<ContactsRequest>, res: StandardResponse) {
        const result = await this.contactsService.add(
            req.user.username,
            req.body,
        );
        res.status(httpStatus.OK).json({
            ...result,
            success: true,
        });
    }
    async list(
        //TODO use dto
        req: TypedRequestQuery<any>,
        res: StandardResponse,
    ) {
        const result = await this.contactsService.list(
            req.user.username,
            req.query,
        );
        res.status(httpStatus.OK).json({
            ...result,
            success: true,
        });
    }

    async suggestions(req: TypedRequestQuery<any>, res: StandardResponse) {
        const result = await this.contactsService.suggestions(
            req.user.username,
            req.query,
        );
        res.status(httpStatus.OK).json({
            ...result,
            success: true,
        });
    }

    async updateStatus(
        req: TypedRequestQB<{ id: string }, ContactsUpdateStatusRequest>,
        res: StandardResponse,
    ) {
        const contact = await this.contactsService.updateStatus(
            req.user.username,
            req.params.id,
            req.body,
        );
        res.status(httpStatus.OK).json({ payload: contact, success: true });
    }
    //TODO use dto here
    async delete(
        req: TypedRequestParams<{ id: string }>,
        res: StandardResponse,
    ) {
        await this.contactsService.delete(req.params.id, req.user.username);
        res.status(httpStatus.OK).json({
            success: true,
        });
    }
}
