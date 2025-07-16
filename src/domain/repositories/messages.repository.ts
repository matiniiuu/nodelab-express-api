import { AutoMessageDto } from "@app/shared";

export interface IRepository {
    insertMany(dto: AutoMessageDto[]): Promise<void>;
}
