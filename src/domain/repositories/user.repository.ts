import { RegisterUserDto, UpdateProfileDto } from "@src/dto";
import { IUser } from "../entities";

export interface IUserRepository {
    create(dto: RegisterUserDto): Promise<void>;
    profile(email: string): Promise<IUser | null>;
    update(email: string, dto: UpdateProfileDto): Promise<void>;
}
