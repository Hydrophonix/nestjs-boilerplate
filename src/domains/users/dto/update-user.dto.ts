// Core
import { ApiProperty }                   from "@nestjs/swagger";
import { IsEmail, IsOptional, IsString } from "class-validator";

export class UpdateUserDto {
    @IsOptional()
    @IsString({ message: "username should be a string" })
    @ApiProperty({ required: false })
    username?: string;

    @IsOptional()
    @IsEmail()
    @ApiProperty({ required: false })
    email?: string;
}
