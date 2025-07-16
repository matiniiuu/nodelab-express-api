import { DataSource, Repository } from "typeorm";
import { ContactNotFound } from "../constants";
import { ContactsListRequest, ContactsSuggestionsRequest } from "../dto";
import { Contact, NewContactAttr, User } from "../entities";
import { ContactsStatus } from "../enums";
import { calculateOffset, transformSort } from "../helpers/list";
import { NotFoundError } from "../packages/errors/not-found-error";

export class ContactsRepository implements IContactsRepository {
    contactRepository: Repository<Contact>;
    dataSource: DataSource;
    constructor(dataSource: DataSource) {
        this.contactRepository = dataSource.getRepository(Contact);
        this.dataSource = dataSource;
    }
    async create(contact: NewContactAttr) {
        return this.contactRepository.save(contact);
    }
    async findOne(id: string): Promise<Contact> {
        const contact = await this.contactRepository.findOne({
            relations: ["profile"],
            where: {
                id,
            },
        });
        if (!contact) throw new NotFoundError(ContactNotFound);
        return contact;
    }
    async list(
        requesterId: string,
        { filter, page, size, sort }: ContactsListRequest,
    ): Promise<{ contacts: Contact[]; total: number }> {
        const statuses = filter?.status?.split(",") || [];
        let order;
        if (sort) {
            const { field, sOrder } = transformSort(sort);
            order = {
                [field]: sOrder,
            };
        }

        const query = this.dataSource
            .createQueryBuilder()
            .from((qd) => {
                const subQ = qd
                    .select([
                        `case 
                    when "requesterId" = :userId then "profileId"
                    when "profileId" = :userId then "requesterId"
                    end as "_profileId"`,
                        'id as "contactRequestId"',
                        '"createdAt"',
                        '"status"',
                        '"acceptedAt"',
                        '"declinedAt"',
                        '"profileId"',
                        '"requesterId"',
                    ])
                    .from(Contact, "contact")
                    .where(`"requesterId" = :userId OR "profileId" = :userId`);

                if (statuses.length)
                    subQ.andWhere("status IN (:...statues)").setParameter(
                        "statues",
                        statuses,
                    );

                return subQ;
            }, "contact")
            .innerJoin(User, "profile", '"_profileId" = "profile"."id"')
            .setParameter("userId", requesterId);

        if (filter?.["profile.id"]) {
            query
                .where('"profileId" = :id')
                .setParameter("id", filter["profile.id"]);
        }

        if (order) {
            Object.keys(order).forEach((key) => {
                query.addOrderBy(`contact."${key}"`, order[key].toUpperCase());
            });
        }

        console.log(
            "q",
            query
                .clone()
                .select(["*"])
                .offset(calculateOffset(page, size))
                .limit(size)
                .getSql(),
        );

        const countQuery = await query
            .clone()
            .select(["count(*)"])
            .orderBy({})
            .getRawMany()
            .then(([{ count }]) => Number(count));
        const contactsQuery = query
            .clone()
            .select(["*"])
            .offset(calculateOffset(page, size))
            .limit(size)
            .getRawMany()
            .then((rawContacts) =>
                rawContacts.map(
                    ({
                        contactRequestId,
                        id,
                        profileId,
                        requesterId,
                        status,
                        createdAt,
                        acceptedAt,
                        declinedAt,
                        _profileId,
                        ...profile
                    }) =>
                        ({
                            id: contactRequestId,
                            status,
                            createdAt,
                            acceptedAt,
                            declinedAt,
                            profileId,
                            requesterId,
                            profile: {
                                id: _profileId,
                                ...profile,
                            },
                        } as Contact),
                ),
            );

        const [contacts, total] = await Promise.all([
            contactsQuery,
            countQuery,
        ]);

        return { contacts, total };
    }

    async suggestions(
        userId: string,
        { filter, size }: ContactsSuggestionsRequest,
    ): Promise<{ contacts: { name: string; id: string }[] }> {
        const contacts = await this.contactRepository.query(
            `select id, name, picture from 
                (select distinct "case" as "profileId", "status" from (select 
                    case 
                        when "requesterId" = $1 then "profileId"
                        when "profileId" = $1 then "requesterId"
                    end,
                *
                from 
                    contact 
                Where 
                    ("requesterId" = $1 or
                    "profileId" = $1) and status = 'accepted' ) a)
                b 
                inner join "user" on b."profileId" = "user"."id" where LOWER("user"."name") LIKE $2 limit $3;
        `,
            [userId, `%${filter.name}%`, size],
        );
        return { contacts };
    }

    async updateStatus(
        requesterId: string,
        id: string,
        status: ContactsStatus,
    ) {
        let timestampField = "";
        if (status === ContactsStatus.ACCEPTED) timestampField = "acceptedAt";
        else if (status === ContactsStatus.DECLINED)
            timestampField = "declinedAt";
        await this.contactRepository.update(
            {
                id,
                status: ContactsStatus.PENDING,
                profileId: requesterId,
            },
            {
                status,
                ...(timestampField && { [timestampField]: new Date() }),
            },
        );
    }
    async delete(id: string, requesterId: string) {
        await this.contactRepository.delete({
            id,
            requesterId,
        });
    }
    async getContactByUserId(currentUserId, userId) {
        return this.contactRepository
            .createQueryBuilder()
            .select("*")
            .where(`("requesterId" = :currentUserId AND "profileId" = :userId)`)
            .orWhere(
                `("requesterId" = :userId AND "profileId" = :currentUserId)`,
            )
            .setParameters({ currentUserId, userId })
            .limit(1)
            .getRawOne();
    }
}
export interface IContactsRepository {
    create(contact: NewContactAttr): Promise<Contact>;
    findOne(id: string): Promise<Contact>;
    list(
        requesterId: string,
        clr: ContactsListRequest,
    ): Promise<{ contacts: Contact[]; total: number }>;
    suggestions(
        requesterId: string,
        csr: ContactsSuggestionsRequest,
    ): Promise<{ contacts: { name: string; id: string }[] }>;
    updateStatus(requesterId: string, id: string, status: ContactsStatus);
    delete(id: string, requesterId: string);
    getContactByUserId(
        currentUserId: string,
        userId: string,
    ): Promise<Contact | undefined>;
}
