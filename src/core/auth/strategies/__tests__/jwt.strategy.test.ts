// Instruments
import { TokenPayload } from "../../interfaces";
import { JwtStrategy }  from "../jwt.strategy";

// Test
import { mockConfigService, userDtoStub } from "../../../../../test";

describe("jwt strategy", () => {
    let strategy: JwtStrategy;

    beforeEach(() => {
        //@ts-ignore
        strategy = new JwtStrategy(mockConfigService);
    });

    test("should be defined", () => {
        expect(strategy).toBeDefined();
    });

    describe("validate", () => {
        let result: TokenPayload;

        beforeEach(() => {
            result = strategy.validate(userDtoStub);
        });

        test("should return correct result", () => {
            expect(result).toEqual(userDtoStub);
        });
    });
});
