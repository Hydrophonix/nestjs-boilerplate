export const mockContext = {
    getHandler:   jest.fn().mockReturnValue("getHandler"),
    getClass:     jest.fn().mockReturnValue("getClass"),
    switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
            user: {
                role: "user",
            }}),
    }),
};
