export const AuthService = jest.fn().mockReturnValue({
    hashPassword:            jest.fn().mockReturnValue("hashPassword"),
    getJwtToken:             jest.fn().mockReturnValue("getJwtToken"),
    getCookieOptions:        jest.fn().mockReturnValue("getCookieOptions"),
    getSignOutCookieOptions: jest.fn().mockReturnValue("getSignOutCookieOptions"),
});
