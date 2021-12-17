// Core
import { Expose, Type }                       from "class-transformer";
import { IsOptional, ValidateNested, IsEnum } from "class-validator";

// Instruments
import { ApiProperty }       from "@nestjs/swagger";
import { UserDto }           from "./user.dto";
import { SortBy, SortOrder } from "../types";

export class FindUsersParams {
    @IsOptional()
    @IsEnum(SortOrder)
    @ApiProperty({
        enum:     SortOrder,
        required: false,
    })
    order: SortOrder = SortOrder.asc;

    @IsOptional()
    @IsEnum(SortBy)
    @ApiProperty({
        enum:     SortBy,
        required: false,
    })
    sort: SortBy = SortBy.id;
}

export class FindUsersDto {
    @Expose()
    @ApiProperty({ type: Number })
    count: number;

    @Expose()
    @Type(() => UserDto)
    @ValidateNested({ each: true })
    @ApiProperty({
        isArray: true,
        type:    UserDto,
    })
    results: UserDto[];
}
