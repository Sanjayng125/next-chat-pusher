import bycrpt from "bcryptjs"

export const verifyPassword = async (password: string, hashedPassword: string) => {
    const isPasswordMatch = await bycrpt.compare(password, hashedPassword)
    return isPasswordMatch;
};

export const encPassword = async (password: string) => {
    const hashedPassword = await bycrpt.hash(password, 10)
    return hashedPassword;
};