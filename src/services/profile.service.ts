import { InvalidEmailOrPassword, ItemUpdated } from "@src/config";
import {
    IProfileService,
    IUser,
    IUsersRepository,
    UserJwtPayload,
} from "@src/domain";
import {
    DataReply,
    DataResponse,
    SuccessReply,
    SuccessResponse,
    UpdateProfileDto,
} from "@src/dto";
import { NotFoundException } from "@src/packages";

export class ProfileService implements IProfileService {
    constructor(private readonly userRepository: IUsersRepository) {}
    async update(email: string, dto: UpdateProfileDto): SuccessReply {
        await this.userRepository.update(email, dto);
        return new SuccessResponse(ItemUpdated);
    }
    async me({ email }: UserJwtPayload): DataReply<IUser> {
        const user = await this.userRepository.profile(email);
        if (!user) {
            throw new NotFoundException(InvalidEmailOrPassword);
        }
        return new DataResponse(user);
    }
}
