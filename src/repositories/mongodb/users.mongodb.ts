import { IUser, IUsersRepository, User } from "@src/domain";
import { RegisterUserDto, UpdateProfileDto } from "@src/dto";

export class UsersMongoDB implements IUsersRepository {
    async create(dto: RegisterUserDto): Promise<void> {
        await User.create(dto);
    }
    async profile(email: string): Promise<IUser | null> {
        return User.findOne({ email });
    }
    async update(email: string, dto: UpdateProfileDto): Promise<void> {
        await User.updateOne({ email }, { $set: { name: dto.name } });
    }

    async getUserByIds(ids: string[]): Promise<IUser[]> {
        return User.find({ _id: ids });
    }
}
