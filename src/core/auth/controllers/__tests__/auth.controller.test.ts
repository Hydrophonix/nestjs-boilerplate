// Core
import { Test, TestingModule } from "@nestjs/testing";
import { FastifyReply }        from "fastify";

// Controllers
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { AuthController }                         from "../auth.controller";

// Services
import { UsersService } from "../../../../domains/users/services";
import { AuthService }  from "../../services";

// Instruments
import { User }                   from "../../../../domains/users/user.schema";
import { CreateUserDto, UserDto } from "../../../../domains/users/dto";
import { userStub }               from "../../../../../test";
import { RequestWithUser }        from "../../interfaces";

jest.mock("../../services/auth.service");
jest.mock("../../../../domains/users/services/users.service");

describe("authController", () => {
    let authController: AuthController;
    let usersService: UsersService;
    let authService: AuthService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ AuthController ],
            providers:   [
                AuthService,
                UsersService,
            ],
        }).compile();

        authController = module.get<AuthController>(AuthController);
        usersService = module.get<UsersService>(UsersService);
        authService = module.get<AuthService>(AuthService);
    });

    test("should be defined", () => {
        expect(authController).toBeDefined();
        expect(usersService).toBeDefined();
        expect(authService).toBeDefined();
    });

    // ========================================================================
    describe("signUp", () => {
    // ========================================================================
        const data: CreateUserDto = {
            email:    "test",
            username: "test",
            password: "test",
        };
        const mockResponse = {
            setCookie: jest.fn(),
        } as unknown as FastifyReply;
        let result: User;

        beforeAll(() => {
            //@ts-ignore
            usersService.findOneByEmail.mockReturnValue(null);
        });

        beforeEach(async () => {
            result = await authController.signUp(mockResponse, data);
        });

        afterAll(() => {
            //@ts-ignore
            usersService.findOneByEmail.mockReturnValue(userStub);
        });

        test("should call the users service", () => {
            expect(usersService.findOneByEmail).toHaveBeenCalledWith(data.email);
            expect(usersService.create).toHaveBeenCalledWith({ ...data, password: "hashPassword" });
        });

        test("should call the auth service", () => {
            expect(authService.hashPassword).toHaveBeenCalledWith(data.password);
            expect(authService.getJwtToken).toHaveBeenCalledWith(userStub);
            expect(authService.getCookieOptions).toHaveBeenCalled();
        });

        test("should call the response setCookie  ", () => {
            expect(mockResponse.setCookie).toHaveBeenCalledWith(
                "Authentication",
                "getJwtToken",
                "getCookieOptions",
            );
        });

        test("should return correct result", () => {
            expect(result).toEqual(userStub);
        });

        test("should return error when email is already user", async  () => {
            //@ts-ignore
            usersService.updateOneById.mockReturnValue(userStub);

            try {
                await authController.signUp(mockResponse, data);
            } catch (error) {
                expect(error).toBeInstanceOf(BadRequestException);
                expect(error.message).toBe("Email is already in use");
            }
        });
    });


    // ========================================================================
    describe("signIn", () => {
    // ========================================================================
        const mockResponse = {
            setCookie: jest.fn(),
        } as unknown as FastifyReply;
        const mockRequest = {
            user: userStub,
        } as unknown as RequestWithUser;
        let result: UserDto;

        beforeEach(() => {
            result = authController.signIn(mockResponse, mockRequest);
        });

        test("should call the auth service", () => {
            expect(authService.getJwtToken).toHaveBeenCalledWith(userStub);
            expect(authService.getCookieOptions).toHaveBeenCalled();
        });

        test("should call the response setCookie  ", () => {
            expect(mockResponse.setCookie).toHaveBeenCalledWith(
                "Authentication",
                "getJwtToken",
                "getCookieOptions",
            );
        });

        test("should return correct result", () => {
            expect(result).toEqual(userStub);
        });
    });

    // ========================================================================
    describe("signOut", () => {
    // ========================================================================
        const mockResponse = {
            setCookie: jest.fn(),
        } as unknown as FastifyReply;
        let result: void;

        beforeEach(() => {
            result = authController.signOut(mockResponse);
        });

        test("should call the auth service", () => {
            expect(authService.getSignOutCookieOptions).toHaveBeenCalled();
        });

        test("should call the response setCookie  ", () => {
            expect(mockResponse.setCookie).toHaveBeenCalledWith(
                "Authentication",
                "",
                "getSignOutCookieOptions",
            );
        });

        test("should return correct result", () => {
            expect(result).toBeUndefined();
        });
    });

    // ========================================================================
    describe("currentUser", () => {
    // ========================================================================
        const mockResponse = {
            setCookie: jest.fn(),
        } as unknown as FastifyReply;
        const currentUser = {
            id: "test",
        } as UserDto;
        let result: User;

        beforeEach(async () => {
            result = await authController.currentUser(mockResponse, currentUser);
        });

        test("should call the users service", () => {
            expect(usersService.findOneById).toHaveBeenCalledWith(currentUser.id);
        });

        test("should call the auth service", () => {
            expect(authService.getJwtToken).toHaveBeenCalledWith(userStub);
            expect(authService.getCookieOptions).toHaveBeenCalled();
        });

        test("should call the response setCookie  ", () => {
            expect(mockResponse.setCookie).toHaveBeenCalledWith(
                "Authentication",
                "getJwtToken",
                "getCookieOptions",
            );
        });

        test("should return correct result", () => {
            expect(result).toEqual(userStub);
        });

        test("should return error when user not found", async  () => {
            //@ts-ignore
            usersService.findOneById.mockReturnValue(userStub);

            try {
                await authController.currentUser(mockResponse, currentUser);
            } catch (error) {
                expect(error).toBeInstanceOf(NotFoundException);
                expect(error.message).toBe("User not found");
            }
        });
    });
});
