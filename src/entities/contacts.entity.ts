import { Entity, Column, JoinColumn, ManyToOne } from "typeorm";
import { ContactsStatus } from "../enums";
import { Base } from "./base";
import { User } from "./users.entity";

@Entity()
export class Contact extends Base {
    @Column()
    requesterId: string;

    @Column()
    profileId: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: "requesterId" })
    requester: User;

    @ManyToOne(() => User)
    @JoinColumn({ name: "profileId" })
    profile: User;

    @Column({
        type: "enum",
        enum: ContactsStatus,
        default: ContactsStatus.PENDING,
    })
    status: ContactsStatus;

    @Column("timestamp", { name: "acceptedAt", nullable: true })
    acceptedAt: Date;
    @Column("timestamp", { name: "declinedAt", nullable: true })
    declinedAt: Date;
}
export class NewContactAttr {
    requester: User;
    profile: User;
}
