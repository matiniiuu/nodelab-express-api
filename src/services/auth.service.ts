import { camelCase } from "lodash";
import {
    AuthTokensResponse,
    ForgotPasswordRequest,
    ResetPasswordRequest,
    SignInRequest,
    SignUpRequest,
    SocialSignInRequest,
} from "../dto";
import { RequiredVerificationField } from "../enums";
import { phoneNumberPreprocessing } from "../helpers/user";
import {
    changePassword,
    forgotPassword,
    getUser,
    getVerificationCode,
    refreshToken,
    signIn,
    signOut,
    signUp,
    socialSignIn,
    verifyAttribute,
} from "../libraries/aws";
import { IUsersRepository } from "../repositories";

export class AuthService implements IAuthService {
    constructor(private readonly usersRepository: IUsersRepository) {}
    async signUp(user: SignUpRequest): Promise<AuthTokensResponse> {
        user.phoneNumber = phoneNumberPreprocessing(user.phoneNumber);
        const tokens = await signUp(user);
        await this.usersRepository.create(await getUser(user.email));
        return tokens;
    }
    async signIn(user: SignInRequest): Promise<AuthTokensResponse> {
        return signIn(user);
    }
    async socialSignIn(user: SocialSignInRequest): Promise<AuthTokensResponse> {
        const result = await socialSignIn(user);
        if (result.newUser) {
            await this.usersRepository.create(await getUser(result.email));
        }
        return result.tokens;
    }

    async getVerificationCode(
        field: RequiredVerificationField,
        accessToken: string,
    ): Promise<void> {
        return getVerificationCode(field, accessToken);
    }

    async verifyAttribute(
        email: string,
        field: RequiredVerificationField,
        accessToken: string,
        code: number,
    ): Promise<void> {
        await verifyAttribute(field, accessToken, code);
        await this.usersRepository.verifyAttribute(
            email,
            `${camelCase(field)}Verified`,
        );
    }

    async refreshToken(
        email: string,
        token: string,
    ): Promise<AuthTokensResponse> {
        return refreshToken(email, token);
    }

    async signOut(token: string): Promise<void> {
        return signOut(token);
    }

    async forgotPassword(forgotPasswordParam: ForgotPasswordRequest) {
        await forgotPassword(forgotPasswordParam);
    }
    async resetPassword(resetPassword: ResetPasswordRequest) {
        await changePassword(resetPassword);
    }
}

export interface IAuthService {
    signUp(user: SignUpRequest): Promise<AuthTokensResponse>;
    signIn(user: SignInRequest): Promise<AuthTokensResponse>;
    socialSignIn(user: SocialSignInRequest): Promise<AuthTokensResponse>;

    getVerificationCode(
        field: RequiredVerificationField,
        accessToken: string,
    ): Promise<void>;

    verifyAttribute(
        email: string,
        field: RequiredVerificationField,
        accessToken: string,
        code: number,
    ): Promise<void>;
    refreshToken(email: string, token: string): Promise<AuthTokensResponse>;

    signOut(token: string): Promise<void>;

    forgotPassword(forgotPasswordParam: ForgotPasswordRequest);
    resetPassword(resetPassword: ResetPasswordRequest);
}
