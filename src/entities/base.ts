import { CreateDateColumn, PrimaryGeneratedColumn } from "typeorm";

export abstract class Base {
    @PrimaryGeneratedColumn("uuid")
    id: string;
    @CreateDateColumn({
        type: "timestamp",
        default: () => "CURRENT_TIMESTAMP(6)",
    })
    createdAt: Date;
}
