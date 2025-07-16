import {
    ContactAddSelf,
    ContactAlreadyExists,
    ContactRequestAlreadyExists,
} from "../constants";
import {
    ContactsListRequest,
    ContactsRequest,
    ContactsSuggestionsRequest,
    ContactsUpdateStatusRequest,
    ListResponse,
} from "../dto";
import { Contact } from "../entities";
import { ContactsStatus } from "../enums";
import { BadRequestError } from "../packages/errors/bad-request-error";
import { IContactsRepository, IUsersRepository } from "../repositories";

export class ContactsService implements IContactsService {
    constructor(
        private readonly contactsRepository: IContactsRepository,
        private readonly usersRepository: IUsersRepository,
    ) {}
    async add(email: string, { recipient }: ContactsRequest) {
        const recipientUser = await this.usersRepository.findOne(recipient);
        const requesterUser = await this.usersRepository.findOneByEmail(email);

        if (recipientUser.id === requesterUser.id)
            throw new BadRequestError(ContactAddSelf);

        const existingContactRequest =
            await this.contactsRepository.getContactByUserId(
                requesterUser.id,
                recipientUser.id,
            );
        if (existingContactRequest) {
            if (existingContactRequest.status === ContactsStatus.PENDING)
                throw new BadRequestError(ContactRequestAlreadyExists);
            throw new BadRequestError(ContactAlreadyExists);
        }

        const contactRequest = await this.contactsRepository.create({
            requester: requesterUser,
            profile: recipientUser,
        });

        return {
            payload: contactRequest,
        };
    }
    async list(
        email: string,
        clr: ContactsListRequest,
    ): Promise<ListResponse<any>> {
        const requesterUser = await this.usersRepository.findOneByEmail(email);
        const { contacts, total } = await this.contactsRepository.list(
            requesterUser.id,
            clr,
        );
        const totalNumberOfPages = Math.ceil(total / clr.size) || 1;
        const nextPage = totalNumberOfPages > clr.page ? clr.page + 1 : null;
        return {
            payload: contacts,
            meta: {
                page: clr.page,
                size: clr.size,
                nextPage: nextPage,
                totalNumberOfPages,
            },
        };
    }

    async suggestions(
        email: string,
        csr: ContactsSuggestionsRequest,
    ): Promise<{ payload: { id: string; name: string }[] }> {
        const currentUser = await this.usersRepository.findOneByEmail(email);

        const { contacts } = await this.contactsRepository.suggestions(
            currentUser.id,
            csr,
        );
        return {
            payload: contacts,
        };
    }

    async updateStatus(
        email: string,
        id: string,
        { status }: ContactsUpdateStatusRequest,
    ): Promise<Contact> {
        const currentUser = await this.usersRepository.findOneByEmail(email);
        await this.contactsRepository.updateStatus(currentUser.id, id, status);
        return this.contactsRepository.findOne(id);
    }
    async delete(id: string, email: string) {
        const requesterUser = await this.usersRepository.findOneByEmail(email);

        //* in case of needs delete by recipient
        // async delete(email: string, { recipient }: ContactsRequest) {
        // const recipientUser = await this.usersRepository.findOne(recipient);
        // const requesterUser = await this.usersRepository.findOneByEmail(email);
        // const contact = await this.contactsRepository.findOne(
        //     requesterUser.id,
        //     recipientUser.id,
        // );
        await this.contactsRepository.delete(id, requesterUser.id);
    }
}
export interface IContactsService {
    add(email: string, cr: ContactsRequest);
    list(email: string, clr: ContactsListRequest): Promise<ListResponse<any>>;
    updateStatus(
        email: string,
        id: string,
        cusr: ContactsUpdateStatusRequest,
    ): Promise<Contact>;
    suggestions(
        requesterId: string,
        csr: ContactsSuggestionsRequest,
    ): Promise<{ payload: { id: string; name: string }[] }>;
    delete(id: string, email: string);
}
