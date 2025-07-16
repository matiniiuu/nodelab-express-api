import { DataReply, SuccessReply, UpdateProfileDto } from "@src/dto";
import { IUser, UserJwtPayload } from "../entities";

export interface IProfileService {
    me(user: UserJwtPayload): DataReply<IUser>;
    update(email: string, dto: UpdateProfileDto): SuccessReply;
}
