// Core
import { Test }          from "@nestjs/testing";
import { getModelToken } from "@nestjs/mongoose";
import { DeleteResult }  from "mongodb";

// Instruments
import { MockUserModel, userStub }              from "../../../../../test";
import { User }                                 from "../../user.schema";
import { FindUsersResponse, SortBy, SortOrder } from "../../types";
import { UsersService }                         from "../users.service";


describe("users service", () => {
    let usersService: UsersService;
    let userModel: MockUserModel;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                UsersService,
                {
                    provide:  getModelToken(User.name),
                    useClass: MockUserModel,
                },
            ],
        }).compile();

        usersService = module.get<UsersService>(UsersService);
        userModel = module.get<MockUserModel>(getModelToken(User.name));
    });

    test("should be defined", () => {
        expect(usersService).toBeDefined();
    });

    // ========================================================================
    describe("create", () => {
    // ========================================================================
        let result: User;

        beforeEach(async () => {
            jest.spyOn(userModel, "create");
            result = await usersService.create(userStub);
        });

        test("should call the userModel", () => {
            expect(userModel.create).toHaveBeenCalledWith(userStub);
        });

        test("should return a delete result", () => {
            expect(result).toEqual(userStub);
        });
    });

    // ========================================================================
    describe("findOneById", () => {
    // ========================================================================
        const id = "test";
        let result: User;

        beforeEach(async () => {
            jest.spyOn(userModel, "findById");
            result = await usersService.findOneById(id);
        });

        test("should call the userModel", () => {
            expect(userModel.findById).toHaveBeenCalledWith(id);
        });

        test("should return a user", () => {
            expect(result).toEqual(userStub);
        });
    });

    // ========================================================================
    describe("findOneByEmail", () => {
    // ========================================================================
        const email = "test";
        let result: User;

        beforeEach(async () => {
            jest.spyOn(userModel, "findOne");
            result = await usersService.findOneByEmail(email);
        });

        test("should call the userModel", () => {
            expect(userModel.findOne).toHaveBeenCalledWith({ email });
        });

        test("should return a user", () => {
            expect(result).toEqual(userStub);
        });
    });

    // ========================================================================
    describe("updateOneById", () => {
    // ========================================================================
        const id = "test";
        const updateData = { username: "Johny", email: "Testeroni" };
        let result: User;

        beforeEach(async () => {
            jest.spyOn(userModel, "findByIdAndUpdate");
            result = await usersService.updateOneById(id, updateData);
        });

        test("should call the userModel", () => {
            expect(userModel.findByIdAndUpdate).toHaveBeenCalledWith(id, updateData, { new: true });
        });

        test("should return a user", () => {
            expect(result).toEqual(userStub);
        });
    });

    // ========================================================================
    describe("deleteOneById", () => {
    // ========================================================================
        const id = "test";
        let result: DeleteResult;

        beforeEach(async () => {
            jest.spyOn(userModel, "deleteOne");
            result = await usersService.deleteOneById(id);
        });

        test("should call the userModel", () => {
            expect(userModel.deleteOne).toHaveBeenCalledWith({ _id: id });
        });

        test("should return a delete result", () => {
            expect(result.deletedCount).toEqual(1);
            expect(result.acknowledged).toEqual(true);
        });
    });

    // ========================================================================
    describe("getAllUsers", () => {
    // ========================================================================
        let result: User[];

        beforeEach(async () => {
            jest.spyOn(userModel, "find");
            result = await usersService.getAllUsers();
        });

        test("should call the userModel", () => {
            expect(userModel.find).toHaveBeenCalled();
        });

        test("should return an array of users", () => {
            expect(result).toHaveLength(1);
            expect(result[ 0 ]).toEqual(userStub);
        });
    });

    // ========================================================================
    describe("findMany", () => {
    // ========================================================================
        const params = {
            limit: 5,
            skip:  2,
            sort:  SortBy.username,
            order: SortOrder.asc,
        };
        let result: FindUsersResponse;

        beforeEach(async () => {
            jest.spyOn(userModel, "find");
            jest.spyOn(userModel, "sort");
            jest.spyOn(userModel, "skip");
            jest.spyOn(userModel, "limit");
            jest.spyOn(userModel, "countDocuments");
            result = await usersService.findMany(params);
        });

        test("should call the userModel", () => {
            expect(userModel.find).toHaveBeenCalled();
            expect(userModel.countDocuments).toHaveBeenCalled();
            expect(userModel.limit).toHaveBeenCalledWith(params.limit);
            expect(userModel.skip).toHaveBeenCalledWith(params.skip);
            expect(userModel.sort).toHaveBeenCalledWith({ [ params.sort ]: params.order });
        });

        test("should return an array of users", () => {
            expect(result.count).toEqual(1);
            expect(result.results).toEqual([ userStub ]);
        });
    });


    // describe("create", () => {
    //     let result: User;
    //     let saveSpy: jest.SpyInstance;
    //     let constructorSpy: jest.SpyInstance;

    //     beforeEach(async () => {
    //         saveSpy = jest.spyOn(MockUserModel.prototype, "save");
    //         constructorSpy = jest.spyOn(MockUserModel.prototype, "constructorSpy");
    //         result = await usersService.create(userStub);
    //     });

    //     test("should call the userModel", () => {
    //         expect(saveSpy).toHaveBeenCalled();
    //         expect(constructorSpy).toHaveBeenCalledWith(userStub);
    //     });

    //     test("should return a user", () => {
    //         expect(result).toEqual(userStub);
    //     });
    // });

    // test("should create user", async () => {
    //     const user = generateUser();
    //     const { _id } = await service.create(user);
    //     const createdUser = await findUser(_id);

    //     expect(createdUser).toMatchObject(user);
    // });


    // test("should find user by id", async () => {
    //     const user = generateUser();
    //     const id = (await insertUser(user)).insertedId.toString();
    //     const foundUser = await service.findOneById(id);

    //     expect(foundUser).toMatchObject(user);
    // });


    // test("should find user by email", async () => {
    //     const user = generateUser();
    //     await insertUser(user);
    //     const foundUser = await service.findOneByEmail(user.email);

    //     expect(foundUser).toMatchObject(user);
    // });


    // test("should find all users", async () => {
    //     const usersCount = 17;
    //     const users = generateUsers(usersCount);
    //     await insertUsers(users);
    //     const foundUsers = await service.getAllUsers();

    //     expect(foundUsers).toHaveLength(usersCount);

    //     foundUsers.forEach((foundUser) => {
    //         expect(foundUser).toMatchObject(users.find(({ email }) => email === foundUser.email));
    //     });
    // });


    // test("should find users and count them", async () => {
    //     const usersCount = 10;
    //     const limit = 5;
    //     const users = generateUsers(usersCount);
    //     await insertUsers(users);
    //     const foundUsers = await service.findMany({
    //         limit,
    //         skip:  0,
    //         order: SortOrder.asc,
    //         sort:  SortBy.id,
    //     });

    //     expect(foundUsers.count).toBe(usersCount);
    //     expect(foundUsers.results).toHaveLength(limit);

    //     foundUsers.results.forEach((foundUser) => {
    //         expect(foundUser).toMatchObject(users.find(({ email }) => email === foundUser.email));
    //     });
    // });


    // test("should update user by id", async () => {
    //     const user = generateUser();
    //     const updateUserDto = {
    //         username: "Test",
    //         email:    "test@test.test",
    //     };
    //     const id = (await insertUser(user)).insertedId.toString();
    //     const updatedUser = await service.updateOneById(id, updateUserDto);

    //     expect(updatedUser).toMatchObject({ ...user, ...updateUserDto });
    // });


    // test("should delete user by id", async () => {
    //     const user = generateUser();
    //     const id = (await insertUser(user)).insertedId.toString();
    //     await service.deleteOneById(id);
    //     const deletedUser = await findUser(id);

    //     expect(deletedUser).toBeNull();
    // });
});
