// Services
import { UnauthorizedException } from "@nestjs/common";
import { AuthService }           from "../../services";

// Instruments
import { UserDto }       from "../../../../domains/users/dto";
import { LocalStrategy } from "../local.strategy";

// Test
import { userDtoStub } from "../../../../../test";

describe("jwt strategy", () => {
    const mockAuthService = {
        validateUser: jest.fn().mockResolvedValue(userDtoStub),
    };
    let strategy: LocalStrategy;

    beforeEach(() => {
        strategy = new LocalStrategy(mockAuthService as unknown as AuthService);
    });

    test("should be defined", () => {
        expect(strategy).toBeDefined();
    });

    describe("validate", () => {
        const email = "test";
        const password = "test";
        let result: UserDto;

        beforeEach(async () => {
            result = await strategy.validate(email, password);
        });

        test("should call auth service", () => {
            expect(mockAuthService.validateUser).toHaveBeenCalledWith(email, password);
        });

        test("should return correct result", () => {
            expect(result).toEqual(userDtoStub);
        });

        test("should return unauthorized error", async () => {
            mockAuthService.validateUser.mockResolvedValue(null);

            try {
                result = await strategy.validate(email, password);
            } catch (error) {
                expect(error).toBeInstanceOf(UnauthorizedException);
            }
        });
    });
});
