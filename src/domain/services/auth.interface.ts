import {
    LoginResponse,
    LoginUserDto,
    RegisterUserDto,
    SuccessReply,
} from "@src/dto";
import { UserJwtPayload } from "../entities";

export interface IAuthService {
    register(dto: RegisterUserDto): SuccessReply;
    login(dto: LoginUserDto): Promise<LoginResponse>;

    generateAccessToken(user: UserJwtPayload): string;
}
