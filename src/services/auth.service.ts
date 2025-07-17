import jwt from "jsonwebtoken";

import { envVariables, InvalidEmailOrPassword, ItemCreated } from "@src/config";
import { IAuthService, IUsersRepository, UserJwtPayload } from "@src/domain";
import {
    LoginResponse,
    LoginUserDto,
    RegisterUserDto,
    SuccessReply,
    SuccessResponse,
} from "@src/dto";
import { NotFoundException } from "@src/packages";

export class AuthService implements IAuthService {
    constructor(private readonly userRepository: IUsersRepository) {}
    async register(dto: RegisterUserDto): SuccessReply {
        await this.userRepository.create(dto);
        return new SuccessResponse(ItemCreated);
    }

    async login({ email, password }: LoginUserDto): Promise<LoginResponse> {
        const user = await this.userRepository.profile(email);
        if (!user) {
            throw new NotFoundException(InvalidEmailOrPassword);
        }
        const isPasswordsMatch = await user.comparePassword(password);
        if (!isPasswordsMatch) {
            throw new NotFoundException(InvalidEmailOrPassword);
        }

        return new LoginResponse(
            this.generateAccessToken({ email, id: user._id }),
            this.generateRefreshToken({ email, id: user._id }),
        );
    }
    generateAccessToken({ email, id }: UserJwtPayload): string {
        return jwt.sign({ email, id }, envVariables.JWT_ACCESS_SECRET, {
            expiresIn:
                envVariables.JWT_ACCESS_EXPIRATION_TIME as jwt.SignOptions["expiresIn"],
        });
    }
    generateRefreshToken({ email, id }: UserJwtPayload): string {
        return jwt.sign({ email, id }, envVariables.JWT_ACCESS_SECRET, {
            expiresIn:
                envVariables.JWT_ACCESS_EXPIRATION_TIME as jwt.SignOptions["expiresIn"],
        });
    }
}
