import { IdentityProvider } from "../enums";

export const invalidIdentityProvider = `must choose between ${Object.values(
    IdentityProvider,
).join(", ")}`;

export const socialUserAlreadyExist = (registrationType: string) => {
    return `email already exist. please try to sign in with ${registrationType}`;
};
