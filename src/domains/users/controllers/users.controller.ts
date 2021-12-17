// Core
import {
    BadRequestException,
    Body,
    CacheInterceptor,
    Controller,
    Delete,
    Get,
    NotFoundException,
    Param,
    Post,
    Put,
    Query,
    UseGuards,
    UseInterceptors,
} from "@nestjs/common";
import {
    ApiBadRequestResponse,
    ApiCookieAuth,
    ApiCreatedResponse,
    ApiForbiddenResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiTags,
    ApiUnauthorizedResponse,
} from "@nestjs/swagger";

// Services
import { UsersService } from "../services";
import { AuthService }  from "../../../core/auth/services";

// Common
import { PaginationParams, ParseObjectIdPipe, SerializeInterceptor } from "../../../common";
import { JwtAuthGuard, RolesGuard }                                  from "../../../core/auth/guards";
import { Role }                                                      from "../../../core/auth/role.enum";
import { Roles }                                                     from "../../../core/auth/roles.decorator";

// Instruments
import {
    CreateUserDto,
    FindUsersDto,
    FindUsersParams,
    UpdateUserDto,
    UserDto,
} from "../dto";
import { User }              from "../user.schema";
import { FindUsersResponse } from "../types";

@Controller("users")
@UseInterceptors(CacheInterceptor)
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Admin)
@ApiTags("users")
@ApiCookieAuth()
@ApiUnauthorizedResponse({ description: "Unathorized" })
@ApiForbiddenResponse({ description: "Forbidden resource" })
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
        private readonly authService: AuthService,
    ) {}


    @Post()
    @UseInterceptors(new SerializeInterceptor(UserDto))
    @ApiCreatedResponse({ type: UserDto })
    @ApiBadRequestResponse({ description: "Email is already in use" })
    async create(@Body() createUserDto: CreateUserDto): Promise<User> {
        const existingUser = await this.usersService.findOneByEmail(createUserDto.email);

        if (existingUser) {
            throw new BadRequestException("Email is already in use");
        }

        const hashedPassword = this.authService.hashPassword(createUserDto.password);
        const user = await this.usersService.create({
            ...createUserDto,
            password: hashedPassword,
        });

        return user;
    }


    @Get()
    @UseInterceptors(new SerializeInterceptor(FindUsersDto))
    @ApiOkResponse({ type: FindUsersDto })
    findMany(
        @Query() { skip, limit }: PaginationParams,
        @Query() { sort, order }: FindUsersParams, // eslint-disable-line @typescript-eslint/indent
    ): Promise<FindUsersResponse> {
        return this.usersService.findMany({ skip, limit, sort, order });
    }


    @Get(":id")
    @UseInterceptors(new SerializeInterceptor(UserDto))
    async findOne(@Param("id", ParseObjectIdPipe) id: string): Promise<User> {
        const user = await this.usersService.findOneById(id);

        if (!user) {
            throw new NotFoundException("User not found");
        }

        return user;
    }


    @Put(":id")
    @UseInterceptors(new SerializeInterceptor(UserDto))
    @ApiOkResponse({ type: UserDto })
    @ApiNotFoundResponse({ description: "User not found" })
    async updateOne(
        @Param("id", ParseObjectIdPipe) id: string,
        @Body() updateUserDto: UpdateUserDto, // eslint-disable-line @typescript-eslint/indent
    ): Promise<User> {
        const user = await this.usersService.updateOneById(id, updateUserDto);

        if (!user) {
            throw new NotFoundException("User not found");
        }

        return user;
    }


    @Delete(":id")
    @ApiOkResponse()
    @ApiNotFoundResponse({ description: "User not found" })
    async deleteOne(@Param("id", ParseObjectIdPipe) id: string) {
        const { deletedCount } = await this.usersService.deleteOneById(id);

        if (deletedCount !== 1) {
            throw new NotFoundException("User not found");
        }
    }
}
