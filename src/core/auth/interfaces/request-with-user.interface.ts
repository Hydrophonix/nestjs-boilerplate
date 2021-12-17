// Core
import { FastifyRequest } from "fastify";

// Instruments
import { UserDto } from "../../../domains/users/dto";

export interface RequestWithUser extends FastifyRequest {
    user: UserDto;
}
