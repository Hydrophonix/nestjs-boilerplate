// Core
import { ApiProperty }       from "@nestjs/swagger";
import { Expose, Transform } from "class-transformer";
import { Role }              from "../../../core/auth/role.enum";

export class UserDto {
    @Expose()
    @Transform((objectId) => objectId.obj.id.toString())
    @ApiProperty()
    id: string;

    @Expose()
    @ApiProperty()
    username: string;

    @Expose()
    @ApiProperty()
    email: string;

    @Expose()
    @ApiProperty({ enum: Role, default: Role.User })
    role: Role;
}
