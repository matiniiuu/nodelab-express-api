import { Entity, Column } from "typeorm";
import { RegistrationType } from "../enums";
import { Base } from "./base";

@Entity()
export class User extends Base {
    @Column({ unique: true })
    sub: string;

    @Column({ nullable: true })
    name: string;

    @Column({ nullable: true })
    firstName: string;

    @Column({ nullable: true })
    lastName: string;

    @Column()
    email: string;

    @Column({ nullable: true, default: "" })
    phoneNumber: string = "";

    @Column("boolean", { default: false })
    emailVerified: boolean;

    @Column("boolean", { default: false })
    phoneNumberVerified: boolean;

    @Column({
        type: "enum",
        enum: RegistrationType,
        default: RegistrationType.EMAIL_PASSWORD,
    })
    registrationType: RegistrationType;

    @Column({ nullable: true })
    picture: string;
    @Column({ nullable: true })
    location: string;
    @Column({ nullable: true })
    bio: string;
}

export class SocialUser {
    email: string;
    password: string;
    emailVerified: string;
    name?: string;
    firstName?: string;
    lastName?: string;
    picture?: string;
}
