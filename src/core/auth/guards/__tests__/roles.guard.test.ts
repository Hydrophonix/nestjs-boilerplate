// Core
import { ExecutionContext } from "@nestjs/common";
import { Reflector }        from "@nestjs/core";
import { ROLES_KEY }        from "../../roles.decorator";

// Instrumets
import { RolesGuard } from "../roles.guard";

const mockReflector = {
    getAllAndOverride: jest.fn().mockReturnValue([ "user" ]),
};

const mockContext = {
    getHandler:   jest.fn().mockReturnValue("getHandler"),
    getClass:     jest.fn().mockReturnValue("getClass"),
    switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
            user: {
                role: "user",
            }}),
    }),
} as unknown as ExecutionContext;


describe("roles guard", () => {
    let rolesGuard: RolesGuard;

    beforeEach(() => {
        rolesGuard = new RolesGuard(mockReflector as unknown as Reflector);
    });

    test("should be defined", () => {
        expect(rolesGuard).toBeDefined();
        expect(rolesGuard.canActivate).toBeDefined();
    });

    describe("canActivate", () => {
        let result: boolean;

        beforeEach(() => {
            result = rolesGuard.canActivate(mockContext);
        });

        test("should call reflector methods", () => {
            expect(mockReflector.getAllAndOverride).toBeCalledWith(
                ROLES_KEY,
                [
                    "getHandler",
                    "getClass",
                ],
            );
        });

        test("should call context methods", () => {
            expect(mockContext.getClass).toBeCalled();
            expect(mockContext.getHandler).toBeCalled();
            expect(mockContext.switchToHttp).toBeCalled();
            expect(mockContext.switchToHttp().getRequest).toBeCalled();
        });

        test("should return true", () => {
            expect(result).toBeTruthy();
        });

        test("should return true when no required roles", () => {
            mockReflector.getAllAndOverride.mockReturnValue(null);
            result = rolesGuard.canActivate(mockContext);

            expect(result).toBeTruthy();
        });

        test("should return false", () => {
            mockReflector.getAllAndOverride.mockReturnValue([ "admin" ]);
            result = rolesGuard.canActivate(mockContext);

            expect(result).toBeFalsy();
        });
    });
});
