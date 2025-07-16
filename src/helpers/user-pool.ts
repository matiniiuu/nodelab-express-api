import httpStatus from "http-status";

const codes = {
    InvalidParameterException: httpStatus.BAD_REQUEST,
    UsernameExistsException: httpStatus.BAD_REQUEST,
    NotAuthorizedException: httpStatus.FORBIDDEN,
};
export const convertUserPoolCodeToHttp = (code: string): number => {
    if (codes[code]) return codes[code];
    return httpStatus.INTERNAL_SERVER_ERROR;
};
