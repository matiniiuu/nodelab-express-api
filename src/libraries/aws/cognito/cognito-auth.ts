import { camelCase } from "lodash";
import { AWSError } from "aws-sdk";
import * as AmazonCognitoIdentity from "amazon-cognito-identity-js";
import config from "../../../config";
import {
    AuthTokensResponse,
    ForgotPasswordRequest,
    ResetPasswordRequest,
    SignInRequest,
    SignUpRequest,
    EditProfileRequest,
    SocialSignInRequest,
} from "../../../dto";
import { AwsError } from "../../../packages/errors/aws-error";
import { SocialUser, User } from "../../../entities";
import { convertUserPoolCodeToHttp } from "../../../helpers/user-pool";
import { getSocialSignInUser } from "../../social-sign-in";
import { BadRequestError } from "../../../packages/errors/bad-request-error";
import { socialUserAlreadyExist } from "../../../constants";
import { IdentityProvider } from "../../../enums";
import { userPool, cognitoClient } from "./cognito-common";
//TODO refactor it with clean code
export const socialSignIn = async (
    ssiReq: SocialSignInRequest,
): Promise<{ tokens: AuthTokensResponse; newUser: boolean; email: string }> => {
    //TODO this method should verify email too
    const socialUser = await getSocialSignInUser(ssiReq);
    const { email, password } = socialUser;
    const userExist = await isUserExist(email);
    if (!userExist) {
        return {
            tokens: await createSocialUser(socialUser, ssiReq.identityProvider),
            email,
            newUser: true,
        };
    }
    return new Promise((resolve, reject) => {
        new AmazonCognitoIdentity.CognitoUser({
            Pool: userPool,
            Username: email,
        }).authenticateUser(
            new AmazonCognitoIdentity.AuthenticationDetails({
                Username: email,
                Password: password,
            }),
            {
                onSuccess: (result) => {
                    resolve({
                        tokens: {
                            accessToken: result.getAccessToken().getJwtToken(),
                            refreshToken: result.getRefreshToken().getToken(),
                        },
                        email: email,
                        newUser: false,
                    });
                },
                onFailure: async (err: AWSError) => {
                    //TODO better error handling
                    if (err.code == "NotAuthorizedException") {
                        try {
                            const registrationType = (await getUser(email))
                                .registrationType;
                            return reject(
                                new BadRequestError(
                                    socialUserAlreadyExist(registrationType),
                                ),
                            );
                        } catch (err) {
                            return reject(err);
                        }
                    }
                    reject(
                        new AwsError(
                            convertUserPoolCodeToHttp(err.code),
                            err.message,
                        ),
                    );
                },
            },
        );
    });
};
export const signUp = async ({
    email,
    password,
    phoneNumber,
    firstName,
    lastName,
}: SignUpRequest): Promise<AuthTokensResponse> => {
    const attributeList = [
        new AmazonCognitoIdentity.CognitoUserAttribute({
            Name: "name",
            Value: `${firstName} ${lastName}`,
        }),
        new AmazonCognitoIdentity.CognitoUserAttribute({
            Name: "given_name",
            Value: firstName,
        }),
        new AmazonCognitoIdentity.CognitoUserAttribute({
            Name: "family_name",
            Value: lastName,
        }),
        new AmazonCognitoIdentity.CognitoUserAttribute({
            Name: "email",
            Value: email,
        }),
        new AmazonCognitoIdentity.CognitoUserAttribute({
            Name: "phone_number",
            Value: phoneNumber,
        }),
        new AmazonCognitoIdentity.CognitoUserAttribute({
            Name: "custom:registration_type",
            Value: "email/password",
        }),
    ];
    return createUser(email, password, attributeList);
};
export const signIn = async ({ email, password }: SignInRequest) => {
    const authenticationDetails =
        new AmazonCognitoIdentity.AuthenticationDetails({
            Username: email,
            Password: password,
        });
    const user = new AmazonCognitoIdentity.CognitoUser({
        Pool: userPool,
        Username: email,
    });
    return authenticateUser(user, authenticationDetails);
};

export const refreshToken = async (email: string, refreshToken: string) => {
    const user = new AmazonCognitoIdentity.CognitoUser({
        Pool: userPool,
        Username: email,
    });
    const authenticationDetails = new AmazonCognitoIdentity.CognitoRefreshToken(
        {
            RefreshToken: refreshToken,
        },
    );
    return new Promise<AuthTokensResponse>((resolve, reject) => {
        user.refreshSession(authenticationDetails, (err: AWSError, result) => {
            if (err)
                return reject(
                    new AwsError(
                        convertUserPoolCodeToHttp(err.code),
                        err.message,
                    ),
                );
            return resolve({
                accessToken: result.getAccessToken().getJwtToken(),
                refreshToken: result.getRefreshToken().getToken(),
            });
        });
    });
};

export const signOut = async (token: string) => {
    return new Promise<void>((resolve, reject) => {
        cognitoClient.revokeToken(
            {
                ClientId: config.cognito_client,
                Token: token,
            },
            (err: AWSError, result) => {
                if (err)
                    return reject(new AwsError(err.statusCode, err.message));
                return resolve();
            },
        );
    });
};

export const forgotPassword = async ({ email }: ForgotPasswordRequest) => {
    const user = new AmazonCognitoIdentity.CognitoUser({
        Pool: userPool,
        Username: email,
    });
    return new Promise<void>((resolve, reject) => {
        user.forgotPassword({
            onSuccess: (result) => {
                resolve();
            },
            onFailure: (err: AWSError) => {
                reject(
                    new AwsError(
                        convertUserPoolCodeToHttp(err.code),
                        err.message,
                    ),
                );
            },
        });
    });
};

export const changePassword = async ({
    email,
    code,
    password,
}: ResetPasswordRequest) => {
    const user = new AmazonCognitoIdentity.CognitoUser({
        Pool: userPool,
        Username: email,
    });
    return new Promise<void>((resolve, reject) => {
        user.confirmPassword(`${code}`, password, {
            onSuccess: (result) => {
                resolve();
            },
            onFailure: (err: AWSError) => {
                reject(
                    new AwsError(
                        convertUserPoolCodeToHttp(err.code),
                        err.message,
                    ),
                );
            },
        });
    });
};

export const getUser = async (email: string): Promise<User> => {
    return new Promise<User>((resolve, reject) => {
        cognitoClient.adminGetUser(
            {
                UserPoolId: config.cognito_userpool,
                Username: email,
            },
            async (err, data) => {
                if (err)
                    return reject(new AwsError(err.statusCode, err.message));
                const userObj = {};
                data.UserAttributes.forEach((attrObj) => {
                    let attrObjName = attrObj.Name;
                    if (attrObjName.includes("custom:"))
                        attrObjName = attrObjName.replace("custom:", "");
                    if (attrObjName === "given_name") attrObjName = "firstName";
                    if (attrObjName === "family_name") attrObjName = "lastName";
                    if (["true", "false"].indexOf(attrObj.Value) > -1)
                        attrObj.Value = JSON.parse(attrObj.Value);
                    attrObjName = camelCase(attrObjName);
                    userObj[attrObjName] = attrObj.Value;
                });
                resolve(userObj as User);
            },
        );
    });
};

export const updateUser = async (
    accessToken: string,
    {
        bio,
        location,
        lastName,
        firstName,
        phoneNumber,
        picture,
    }: EditProfileRequest,
) => {
    const attributes = [
        new AmazonCognitoIdentity.CognitoUserAttribute({
            Name: "name",
            Value: `${firstName} ${lastName}`,
        }),
        new AmazonCognitoIdentity.CognitoUserAttribute({
            Name: "given_name",
            Value: firstName,
        }),
        new AmazonCognitoIdentity.CognitoUserAttribute({
            Name: "family_name",
            Value: lastName,
        }),
        new AmazonCognitoIdentity.CognitoUserAttribute({
            Name: "phone_number",
            Value: phoneNumber,
        }),
    ];
    location &&
        attributes.push(
            new AmazonCognitoIdentity.CognitoUserAttribute({
                Name: "custom:location",
                Value: location,
            }),
        );
    bio &&
        attributes.push(
            new AmazonCognitoIdentity.CognitoUserAttribute({
                Name: "custom:bio",
                Value: bio,
            }),
        );
    picture &&
        attributes.push(
            new AmazonCognitoIdentity.CognitoUserAttribute({
                Name: "picture",
                Value: picture,
            }),
        );
    return new Promise<void>((resolve, reject) => {
        cognitoClient.updateUserAttributes(
            {
                AccessToken: accessToken,
                UserAttributes: attributes,
            },
            (err: AWSError, result) => {
                if (err)
                    return reject(new AwsError(err.statusCode, err.message));
                resolve();
            },
        );
    });
};
export const verifyAttribute = async (
    attributeName: string,
    accessToken: string,
    code: number,
) => {
    return new Promise<void>((resolve, reject) => {
        cognitoClient.verifyUserAttribute(
            {
                AccessToken: accessToken,
                AttributeName: attributeName,
                Code: `${code}`,
            },
            (err: AWSError, data) => {
                if (err)
                    return reject(new AwsError(err.statusCode, err.message));
                return resolve();
            },
        );
    });
};
export const getVerificationCode = async (
    attributeName: string,
    accessToken: string,
) => {
    return new Promise<void>((resolve, reject) => {
        cognitoClient.getUserAttributeVerificationCode(
            {
                AccessToken: accessToken,
                AttributeName: attributeName,
                ClientMetadata: {
                    drdtoken: accessToken,
                },
            },
            (err: AWSError, data) => {
                if (err)
                    return reject(new AwsError(err.statusCode, err.message));
                return resolve();
            },
        );
    });
};
const createSocialUser = async (
    {
        email,
        emailVerified,
        password,
        name,
        picture,
        lastName,
        firstName,
    }: SocialUser,
    identityProvider: IdentityProvider,
) => {
    const attributeList = [
        new AmazonCognitoIdentity.CognitoUserAttribute({
            Name: "email",
            Value: email,
        }),
        new AmazonCognitoIdentity.CognitoUserAttribute({
            Name: "custom:registration_type",
            Value: identityProvider,
        }),
    ];
    name &&
        attributeList.push(
            new AmazonCognitoIdentity.CognitoUserAttribute({
                Name: "name",
                Value: name,
            }),
        );
    firstName &&
        attributeList.push(
            new AmazonCognitoIdentity.CognitoUserAttribute({
                Name: "given_name",
                Value: firstName,
            }),
        );
    lastName &&
        attributeList.push(
            new AmazonCognitoIdentity.CognitoUserAttribute({
                Name: "family_name",
                Value: lastName,
            }),
        );
    picture &&
        attributeList.push(
            new AmazonCognitoIdentity.CognitoUserAttribute({
                Name: "picture",
                Value: picture,
            }),
        );
    return createUser(email, password, attributeList);
};
const createUser = async (
    email: string,
    password: string,
    userAttributes: AmazonCognitoIdentity.CognitoUserAttribute[],
): Promise<AuthTokensResponse> => {
    return new Promise((resolve, reject) => {
        userPool.signUp(
            email,
            password,
            userAttributes,
            [],
            async (
                err: AWSError,
                result: AmazonCognitoIdentity.ISignUpResult,
            ) => {
                if (err)
                    return reject(
                        new AwsError(
                            convertUserPoolCodeToHttp(err.code),
                            err.message,
                        ),
                    );
                const tokens = await authenticateUser(
                    result.user,
                    new AmazonCognitoIdentity.AuthenticationDetails({
                        Username: email,
                        Password: password,
                    }),
                );
                return resolve(tokens);
            },
        );
    });
};
const isUserExist = (email: string): Promise<boolean> => {
    return new Promise<boolean>((resolve, reject) => {
        cognitoClient.adminGetUser(
            {
                UserPoolId: config.cognito_userpool,
                Username: email,
            },
            async (err: AWSError, data) => {
                if (err) {
                    switch (err.code) {
                        case "UserNotFoundException":
                            return resolve(false);
                        default:
                            return reject(
                                new AwsError(err.statusCode, err.message),
                            );
                    }
                }
                resolve(true);
            },
        );
    });
};
const authenticateUser = async (
    user: AmazonCognitoIdentity.CognitoUser,
    authenticationDetails: AmazonCognitoIdentity.AuthenticationDetails,
): Promise<AuthTokensResponse> => {
    return new Promise((resolve, reject) => {
        user.authenticateUser(authenticationDetails, {
            onSuccess: (result) => {
                resolve({
                    accessToken: result.getAccessToken().getJwtToken(),
                    refreshToken: result.getRefreshToken().getToken(),
                });
            },
            onFailure: (err: AWSError) => {
                reject(
                    new AwsError(
                        convertUserPoolCodeToHttp(err.code),
                        err.message,
                    ),
                );
            },
        });
    });
};

const addCustomAttributes = () => {
    //* Ensure you set read/write permissions: General settings -> App clients -> Show details -> Set attributes permissions link
    return new Promise<void>((resolve, reject) => {
        cognitoClient.addCustomAttributes(
            {
                CustomAttributes: [
                    {
                        Name: "bio",
                        AttributeDataType: "String",
                        Mutable: true,
                        DeveloperOnlyAttribute: false,
                        Required: false,
                    },
                    {
                        Name: "location",
                        AttributeDataType: "String",
                        Mutable: true,
                        DeveloperOnlyAttribute: false,
                        Required: false,
                    },
                ],
                UserPoolId: config.cognito_userpool,
            },
            (err: AWSError, data) => {
                if (err)
                    return reject(new AwsError(err.statusCode, err.message));
                resolve();
            },
        );
    });
};
