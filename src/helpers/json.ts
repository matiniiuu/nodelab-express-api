import jwt, { JwtPayload } from "jsonwebtoken";
export const decodeJwtToken = (token: string): JwtPayload => {
    return jwt.decode(token, { complete: true });
};
