// Core
import { IsNumber, Min, IsOptional } from "class-validator";
import { Type }                      from "class-transformer";
import { ApiProperty }               from "@nestjs/swagger";

export class PaginationParams {
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    @ApiProperty({
        type:     Number,
        required: false,
        default:  0,
        minimum:  0,
    })
    skip = 0;

    @ApiProperty({
        type:     Number,
        required: false,
        default:  10,
        minimum:  1,
    })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    limit = 10;
}
