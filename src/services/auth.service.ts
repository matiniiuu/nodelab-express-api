import jwt from "jsonwebtoken";

import { envVariables, InvalidEmailOrPassword, ItemCreated } from "@src/config";
import { IAuthService, IUserRepository, UserJwtPayload } from "@src/domain";
import {
    DataReply,
    DataResponse,
    LoginResponse,
    LoginUserDto,
    RegisterUserDto,
    SuccessReply,
    SuccessResponse,
} from "@src/dto";
import { NotFoundException } from "@src/packages";

export class AuthService implements IAuthService {
    constructor(private readonly userRepository: IUserRepository) {}
    async register(dto: RegisterUserDto): SuccessReply {
        await this.userRepository.create(dto);
        return new SuccessResponse(ItemCreated);
    }

    async login({ email, password }: LoginUserDto): DataReply<LoginResponse> {
        const user = await this.userRepository.profile(email);
        if (!user) {
            throw new NotFoundException(InvalidEmailOrPassword);
        }
        const isPasswordsMatch = await user.comparePassword(password);
        if (!isPasswordsMatch) {
            throw new NotFoundException(InvalidEmailOrPassword);
        }
        const tokenPayload = new UserJwtPayload(user.email, user._id);

        return new DataResponse(
            new LoginResponse(
                this.generateAccessToken(tokenPayload),
                this.generateRefreshToken(tokenPayload),
            ),
        );
    }
    generateAccessToken({ tokenPayload }: UserJwtPayload): string {
        return jwt.sign(tokenPayload, envVariables.JWT_ACCESS_SECRET, {
            expiresIn:
                envVariables.JWT_ACCESS_EXPIRATION_TIME as jwt.SignOptions["expiresIn"],
        });
    }
    generateRefreshToken({ tokenPayload }: UserJwtPayload): string {
        return jwt.sign(tokenPayload, envVariables.JWT_ACCESS_SECRET, {
            expiresIn:
                envVariables.JWT_ACCESS_EXPIRATION_TIME as jwt.SignOptions["expiresIn"],
        });
    }
}
