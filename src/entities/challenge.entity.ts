import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { ChallengeStatus } from "../enums";
import { Base } from "./base";
import { User } from "./users.entity";

@Entity()
export class Challenge extends Base {
    @Column()
    challengerId: string;

    @Column()
    challengeeId: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: "challengerId" })
    challenger: User;

    @ManyToOne(() => User)
    @JoinColumn({ name: "challengeeId" })
    challengee: User;

    @Column({
        type: "enum",
        enum: ChallengeStatus,
        default: ChallengeStatus.PENDING,
    })
    status: ChallengeStatus;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    media: string;

    @Column({ type: "float" })
    amount: number;

    @Column("timestamp", { name: "acceptedAt", nullable: true })
    acceptedAt: Date;
    @Column("timestamp", { name: "declinedAt", nullable: true })
    declinedAt: Date;
}
export class NewChallengeAttr {
    challenger: User;
    challengee: User;
    title: string;
    description: string;
    amount: number;
    media: string;
}
