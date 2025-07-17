export const InvalidNumber = (propertyKey: string) => {
    return `${propertyKey} must be a valid number`;
};
export const ArrayMin = (propertyKey: string) => {
    return `${propertyKey} At least one item is required`;
};

//* general Errors
export const DataRequired = "DataRequired";
export const NotFound = "NotFound";
export const NotAuthorized = "NotAuthorized";
export const InvalidEmailOrPassword = "InvalidEmailOrPassword";
export const RefreshTokenRequired = "RefreshTokenRequired";
export const AuthenticationRequired = "AuthenticationRequired";

export const DocumentNotFound = (documentName: string = "Document") => {
    return `${documentName}NotFound`;
};
//* information
export const Success = "Success";
export const ItemCreated = "ItemCreated";
export const ItemDeleted = "ItemDeleted";
export const ItemUpdated = "ItemUpdated";
