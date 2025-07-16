export class LoginResponse {
    constructor(
        readonly accessToken: string,
        readonly refreshToken: string,
    ) {}
}
