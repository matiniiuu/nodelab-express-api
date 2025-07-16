import { DataSource, ILike, Repository } from "typeorm";
import { UserNotFound } from "../constants";
import { User } from "../entities";
import { NotFoundError } from "../packages/errors/not-found-error";

export class UsersRepository implements IUsersRepository {
    userRepository: Repository<User>;
    constructor(dataSource: DataSource) {
        this.userRepository = dataSource.getRepository(User);
    }
    async create(user: User) {
        await this.userRepository.save(user);
    }
    async findOne(id: string): Promise<User> {
        const user = await this.userRepository.findOneBy({
            id: id,
        });
        if (!user) throw new NotFoundError(UserNotFound);
        return user;
    }
    async findOneByEmail(email: string): Promise<User> {
        const user = await this.userRepository.findOneBy({
            email: email,
        });
        if (!user) throw new NotFoundError(UserNotFound);
        return user;
    }
    async search(name: string): Promise<User[]> {
        const users = await this.userRepository.find({
            where: {
                name: ILike(`%${name}%`),
            },
        });
        return users;
    }
    async update(user: User) {
        await this.userRepository.update({ id: user.id }, user);
    }
    async verifyAttribute(email: string, field: string) {
        await this.userRepository.update({ email: email }, { [field]: true });
    }
}
export interface IUsersRepository {
    create(user: User);
    findOne(id: string): Promise<User>;
    findOneByEmail(email: string): Promise<User>;
    search(name: string): Promise<User[]>;
    update(user: User);
    verifyAttribute(email: string, field: string);
}
