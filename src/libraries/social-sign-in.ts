import { OAuth2Client } from "google-auth-library";
import config from "../config";
import { SocialSignInRequest } from "../dto";
import { SocialUser } from "../entities";
import { IdentityProvider } from "../enums";
import { decodeJwtToken } from "../helpers/json";
const oauthClient = new OAuth2Client(config.google_client_id);
export const getSocialSignInUser = async ({
    identityProvider,
    token,
}: SocialSignInRequest): Promise<SocialUser> => {
    let user: SocialUser;
    switch (identityProvider) {
        case IdentityProvider.GOOGLE:
            user = await signInByGoogle(token);
            break;
        case IdentityProvider.APPLE:
            user = await signInByApple(token);
            break;
    }
    return user;
};
const signInByGoogle = async (token: string): Promise<SocialUser> => {
    const ticket = await oauthClient.verifyIdToken({
        idToken: token,
        audience: config.google_client_id,
    });
    const {
        sub,
        email,
        picture,
        name,
        family_name,
        given_name,
        email_verified,
    } = ticket.getPayload();
    return {
        password: sub,
        email,
        picture,
        name,
        firstName: given_name,
        lastName: family_name,
        emailVerified: email_verified?.toString(),
    };
};

const signInByApple = async (token: string): Promise<SocialUser> => {
    const { sub, email, name, email_verified } = decodeJwtToken(token).payload;
    return { password: sub, email, name, emailVerified: email_verified };
};
