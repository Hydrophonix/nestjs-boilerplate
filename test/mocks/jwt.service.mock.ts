export const mockJwtService = {
    sign() {
        return  this.signReturnValue;
    },
    signReturnValue: "test token",
};
