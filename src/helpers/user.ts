export const phoneNumberPreprocessing = (phoneNumber: string) => {
    return `+1${phoneNumber.replace(/[^\d]/g, "")}`;
};
