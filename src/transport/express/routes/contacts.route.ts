import express from "express";
import {
    ContactsListRequest,
    ContactsRequest,
    ContactsSuggestionsRequest,
    ContactsUpdateStatusRequest,
    IdDto,
} from "../../../dto";
import { IContactsService } from "../../../services";
import { ContactsController } from "../controllers";
import { validator } from "../middleware/validation";
export const createContactsRoutes = (
    contactsService: IContactsService,
): express.Router => {
    const router = express.Router();
    const contactsController = new ContactsController(contactsService);

    router.post(
        "",
        validator(ContactsRequest, "body"),
        contactsController.add.bind(contactsController),
    );
    router.get(
        "",
        validator(ContactsListRequest, "query"),
        contactsController.list.bind(contactsController),
    );
    router.get(
        "/suggestions",
        validator(ContactsSuggestionsRequest, "query"),
        contactsController.suggestions.bind(contactsController),
    );
    router.put(
        "/:id",
        validator(IdDto, "params"),
        validator(ContactsUpdateStatusRequest, "body"),
        contactsController.updateStatus.bind(contactsController),
    );
    router.delete(
        "/:id",
        validator(IdDto, "params"),
        contactsController.delete.bind(contactsController),
    );
    return router;
};
