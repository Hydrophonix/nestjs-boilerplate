// Core
import { Test, TestingModule }                                      from "@nestjs/testing";
import { BadRequestException, CacheInterceptor, NotFoundException } from "@nestjs/common";

// Controllers
import { UsersController } from "../users.controller";

// Services
import { UsersService } from "../../services/users.service";
import { AuthService }  from "../../../../core/auth/services/auth.service";

// Instruments
import { MockCacheInterceptor, userStub }                from "../../../../../test";
import { PaginationParams }                              from "../../../../common";
import { FindUsersResponse, SortBy, SortOrder }          from "../../types";
import { CreateUserDto, FindUsersParams, UpdateUserDto } from "../../dto";
import { User }                                          from "../../user.schema";

jest.mock("../../services/users.service");
jest.mock("../../../../core/auth/services/auth.service");

describe("users controller", () => {
    let usersController: UsersController;
    let usersService: UsersService;
    let authService: AuthService;

    beforeEach(async () => {
        const module: TestingModule = await Test
            .createTestingModule({
                controllers: [ UsersController ],
                providers:   [
                    UsersService,
                    AuthService,
                ],
            })
            .overrideInterceptor(CacheInterceptor)
            .useClass(MockCacheInterceptor)
            .compile();

        usersController = module.get<UsersController>(UsersController);
        usersService = module.get<UsersService>(UsersService);
        authService = module.get<AuthService>(AuthService);
    });

    test("should be defined", () => {
        expect(usersController).toBeDefined();
        expect(usersService).toBeDefined();
        expect(authService).toBeDefined();
    });

    // ========================================================================
    describe("create", () => {
    // ========================================================================
        const data: CreateUserDto = {
            email:    "test",
            username: "test",
            password: "test",
        };
        let result: User;

        beforeEach(async () => {
            //@ts-ignore
            usersService.findOneByEmail.mockReturnValue(null);
            result = await usersController.create(data);
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
        });

        test("should return correct result", () => {
            expect(result).toEqual(userStub);
        });

        test("should return error when email is already user", async  () => {
            //@ts-ignore
            usersService.updateOneById.mockReturnValue(userStub);

            try {
                await usersController.create(data);
            } catch (error) {
                expect(error).toBeInstanceOf(BadRequestException);
                expect(error.message).toBe("Email is already in use");
            }
        });
    });

    // ========================================================================
    describe("findMany", () => {
    // ========================================================================
        const pagination: PaginationParams = {
            limit: 5,
            skip:  5,
        };
        const params: FindUsersParams = {
            order: SortOrder.asc,
            sort:  SortBy.email,
        };
        let result: FindUsersResponse;

        beforeEach(async () => {
            result = await usersController.findMany(pagination, params);
        });

        test("should call the users service", () => {
            expect(usersService.findMany).toHaveBeenCalledWith({ ...pagination, ... params });
        });

        test("should return correct result", () => {
            expect(result.count).toEqual(1);
            expect(result.results).toEqual([ userStub ]);
        });
    });

    // ========================================================================
    describe("findOne", () => {
    // ========================================================================
        const id = "test";
        let result: User;

        beforeEach(async () => {
            result = await usersController.findOne(id);
        });

        test("should call the users service", () => {
            expect(usersService.findOneById).toHaveBeenCalledWith(id);
        });

        test("should return correct result", () => {
            expect(result).toEqual(userStub);
        });

        test("should return error when user not found", async  () => {
            //@ts-ignore
            usersService.findOneById.mockReturnValue(null);

            try {
                await usersController.findOne(id);
            } catch (error) {
                expect(error).toBeInstanceOf(NotFoundException);
                expect(error.message).toBe("User not found");
            }

            //@ts-ignore
            usersService.findOneById.mockReturnValue(userStub);
        });
    });

    // ========================================================================
    describe("updateOne", () => {
    // ========================================================================
        const id = "test";
        const data: UpdateUserDto = {
            email:    "test",
            username: "test",
        };
        let result: User;

        beforeEach(async () => {
            result = await usersController.updateOne(id, data);
        });

        test("should call the users service", () => {
            expect(usersService.updateOneById).toHaveBeenCalledWith(id, data);
        });

        test("should return correct result", () => {
            expect(result).toEqual(userStub);
        });

        test("should return error when user not found", async  () => {
            //@ts-ignore
            usersService.updateOneById.mockReturnValue(null);

            try {
                await usersController.updateOne(id, data);
            } catch (error) {
                expect(error).toBeInstanceOf(NotFoundException);
                expect(error.message).toBe("User not found");
            }
        });
    });

    // ========================================================================
    describe("deleteOne", () => {
    // ========================================================================
        const id = "test";
        let result: void;

        beforeEach(async () => {
            result = await usersController.deleteOne(id);
        });

        test("should call the users service", () => {
            expect(usersService.deleteOneById).toHaveBeenCalledWith(id);
        });

        test("should return correct result", () => {
            expect(result).toBeUndefined();
        });

        test("should return error when user not found", async  () => {
            //@ts-ignore
            usersService.deleteOneById.mockReturnValue({ deletedCount: 0 });

            try {
                await usersController.deleteOne(id);
            } catch (error) {
                expect(error).toBeInstanceOf(NotFoundException);
                expect(error.message).toBe("User not found");
            }
        });
    });
});
