import { EditProfileRequest } from "../dto";
import { User } from "../entities/users.entity";
import { phoneNumberPreprocessing } from "../helpers/user";
import { getUser, updateUser, deleteObject } from "../libraries/aws";
import { IUsersRepository } from "../repositories";

export class UsersService implements IUsersService {
    constructor(private readonly usersRepository: IUsersRepository) {}
    async findOneByEmail(email: string): Promise<User> {
        return this.usersRepository.findOneByEmail(email);
    }
    async findOne(id: string): Promise<User> {
        return this.usersRepository.findOne(id);
    }
    //TODO improve performance
    async editProfile(
        access_token: string,
        email: string,
        newUserInfo: EditProfileRequest,
    ): Promise<User> {
        newUserInfo.phoneNumber = phoneNumberPreprocessing(
            newUserInfo.phoneNumber,
        );
        const user = await this.findOneByEmail(email);
        await updateUser(access_token, newUserInfo);
        if (user.picture && newUserInfo.picture !== user.picture) {
            await deleteObject(user.picture);
        }
        const newUser = { id: user.id, ...(await getUser(email)) };
        await this.usersRepository.update(newUser);
        return newUser;
    }
    async searchUsers(name: string): Promise<User[]> {
        return this.usersRepository.search(name);
    }
}

export interface IUsersService {
    findOneByEmail(email: string): Promise<User>;
    findOne(id: string): Promise<User>;
    editProfile(
        access_token: string,
        email: string,
        user: EditProfileRequest,
    ): Promise<User>;
    searchUsers(name: string): Promise<User[]>;
}
