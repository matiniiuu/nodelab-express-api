import { CognitoIdentityServiceProvider } from "aws-sdk";
import config from "../../../config";
import * as AmazonCognitoIdentity from "amazon-cognito-identity-js";

export const cognitoClient = new CognitoIdentityServiceProvider({
    apiVersion: "2016-04-18",
    region: config.aws_remote_config.region,
});

export const userPool = new AmazonCognitoIdentity.CognitoUserPool({
    UserPoolId: config.cognito_userpool, // user pool id here
    ClientId: config.cognito_client, // client id here
});
