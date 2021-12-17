// Core
import { getModelToken }          from "@nestjs/mongoose";
import { Test, TestingModule }    from "@nestjs/testing";
import { JwtService }             from "@nestjs/jwt";
import { ConfigService }          from "@nestjs/config";
import { CookieSerializeOptions } from "fastify-cookie";
import * as bcrypt                from "bcryptjs";

// Services
import { AuthService }  from "../auth.service";
import { UsersService } from "../../../../domains/users/services";

// Instruments
import {
    mockConfigService,
    mockJwtService,
    MockUserModel,
    userDtoStub,
    userStub,
} from "../../../../../test";
import { User }    from "../../../../domains/users/user.schema";
import { UserDto } from "../../../../domains/users/dto";

jest.mock("bcryptjs");
jest.mock("../../../../domains/users/services/users.service");

describe("auth service", () => {
    let authService: AuthService;
    let usersService: UsersService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                UsersService,
                {
                    provide:  getModelToken(User.name),
                    useClass: MockUserModel,
                },
                {
                    provide:  JwtService,
                    useValue: mockJwtService,
                },
                {
                    provide:  ConfigService,
                    useValue: mockConfigService,
                },
            ],
        }).compile();

        authService = module.get<AuthService>(AuthService);
        usersService = module.get<UsersService>(UsersService);
    });

    test("should be defined", () => {
        expect(authService).toBeDefined();
    });

    // ========================================================================
    describe("validateUser", () => {
    // ========================================================================
        const email = "test email";
        const password = "test password";
        let result: UserDto;

        beforeEach(async () => {
            //@ts-ignore
            bcrypt.compare.mockReturnValue(true);
            jest.spyOn(usersService, "findOneByEmail");
            result = await authService.validateUser(email, password);
        });

        test("should call users service", () => {
            expect(usersService.findOneByEmail).toBeCalledWith(email);
        });

        test("should call bcrypt compare", () => {
            expect(bcrypt.compare).toBeCalledWith(password, userStub.password);
        });

        test("should return user", () => {
            // eslint-disable-next-line no-undefined
            expect(result).toEqual({ ...userStub, password: undefined });
        });

        test("should return null when password is not valid", async () => {
            //@ts-ignore
            bcrypt.compare.mockReturnValue(false);
            result = await authService.validateUser(email, password);

            expect(result).toBeNull();
        });

        test("should return null when user was not found", async () => {
            //@ts-ignore
            usersService.findOneByEmail.mockReturnValue(null);
            result = await authService.validateUser(email, password);

            expect(result).toBeNull();
        });
    });

    // ========================================================================
    describe("getJwtToken", () => {
    // ========================================================================
        let result: string;

        beforeEach(() => {
            jest.spyOn(mockJwtService, "sign");
            result = authService.getJwtToken(userDtoStub);
        });

        test("should call jwt service", () => {
            expect(mockJwtService.sign).toBeCalledWith(userDtoStub);
        });

        test("should return correct result", () => {
            expect(result).toEqual(mockJwtService.signReturnValue);
        });
    });

    // ========================================================================
    describe("getCookieOptions", () => {
    // ========================================================================
        const expectedResult = {
            path:     "/",
            maxAge:   mockConfigService.COOKIE_MAX_AGE,
            secure:   mockConfigService.IS_PROD,
            httpOnly: true,
            sameSite: "lax",
        };
        let result: CookieSerializeOptions;

        beforeEach(() => {
            jest.spyOn(mockConfigService, "get");
            result = authService.getCookieOptions();
        });

        test("should call config service", () => {
            expect(mockConfigService.get).toBeCalledWith("COOKIE_MAX_AGE");
            expect(mockConfigService.get).toBeCalledWith("IS_PROD");
        });

        test("should return correct result", () => {
            expect(result).toEqual(expectedResult);
        });
    });

    // ========================================================================
    describe("getSignOutCookieOptions", () => {
    // ========================================================================
        const expectedResult = {
            path:     "/",
            maxAge:   0,
            secure:   mockConfigService.IS_PROD,
            httpOnly: true,
            sameSite: "lax",
        };
        let result: CookieSerializeOptions;

        beforeEach(() => {
            jest.spyOn(mockConfigService, "get");
            result = authService.getSignOutCookieOptions();
        });

        test("should call config service", () => {
            expect(mockConfigService.get).toBeCalledWith("IS_PROD");
        });

        test("should return correct result", () => {
            expect(result).toEqual(expectedResult);
        });
    });

    // ========================================================================
    describe("hashPassword", () => {
    // ========================================================================
        const password = "test password";
        const hashedPassword = "testerino";
        let result: string;

        beforeEach(() => {
            //@ts-ignore
            bcrypt.hashSync.mockReturnValue(hashedPassword);
            jest.spyOn(mockConfigService, "get");
            result = authService.hashPassword(password);
        });

        test("should call config service", () => {
            expect(mockConfigService.get).toBeCalledWith("HASH_SALT_ROUNDS");
        });

        test("should call bcryptjs hashSync", () => {
            expect(bcrypt.hashSync).toBeCalledWith(password, mockConfigService.HASH_SALT_ROUNDS);
        });

        test("should return correct result", () => {
            expect(result).toEqual(hashedPassword);
        });
    });
});
