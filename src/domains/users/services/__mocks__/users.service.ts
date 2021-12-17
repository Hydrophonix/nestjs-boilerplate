// Instruments
import { userStub } from "../../../../../test";

export const UsersService = jest.fn().mockReturnValue({
    create:         jest.fn().mockResolvedValue(userStub),
    findOneByEmail: jest.fn().mockResolvedValue(userStub),
    findOneById:    jest.fn().mockResolvedValue(userStub),
    updateOneById:  jest.fn().mockResolvedValue(userStub),
    deleteOneById:  jest.fn().mockResolvedValue({ deletedCount: 1 }),
    findMany:       jest.fn().mockResolvedValue({ count: 1, results: [ userStub ]}),
});
