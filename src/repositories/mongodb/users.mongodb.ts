import { IUser, User } from "@src/domain";
import { IUserRepository } from "@src/domain/repositories/user.repository";
import { RegisterUserDto, UpdateProfileDto } from "@src/dto";

export class UsersMongoDB implements IUserRepository {
    async create(dto: RegisterUserDto): Promise<void> {
        await User.create(dto);
    }
    async profile(email: string): Promise<IUser | null> {
        return User.findOne({ email });
    }
    async update(email: string, dto: UpdateProfileDto): Promise<void> {
        await User.updateOne({ email }, { $set: { name: dto.name } });
    }
}
