import { CognitoJwtVerifier } from "aws-jwt-verify";
import { CognitoAccessTokenPayload } from "aws-jwt-verify/jwt-model";
import config from "../../../config";
import { NotAuthorizedError } from "../../../packages/errors/not-authorized-error";

// Verifier that expects valid access tokens:
const accessTokenVerifier = CognitoJwtVerifier.create({
    userPoolId: config.cognito_userpool,
    tokenUse: "access",
    clientId: config.cognito_client,
});

export const verifyAccessToken = async (
    token: string,
): Promise<CognitoAccessTokenPayload> => {
    try {
        return await accessTokenVerifier.verify(token);
    } catch {
        throw new NotAuthorizedError();
    }
};
