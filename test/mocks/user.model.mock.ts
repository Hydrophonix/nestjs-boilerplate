// Instruments
import { Role }    from "../../src/core/auth/role.enum";
import { UserDto } from "../../src/domains/users/dto";
import { User }    from "../../src/domains/users/user.schema";

// Test
import { generateUser } from "../utils";
import { MockModel }    from "./model.mock";

export const userStub = Object.freeze(generateUser()) as unknown as User;
export const userDtoStub: UserDto = Object.freeze({
    id:       "test",
    username: "test",
    role:     Role.User,
    email:    "test",
});

export class MockUserModel extends MockModel<User> {
    protected entityStub = userStub;
}
