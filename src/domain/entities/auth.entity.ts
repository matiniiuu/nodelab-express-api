export class UserJwtPayload {
    constructor(
        readonly email: string,
        readonly id: string,
    ) {}
    get tokenPayload() {
        return { email: this.email, id: this.id };
    }
}
