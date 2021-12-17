// Core
import {
    BadRequestException,
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    NotFoundException,
    Post,
    Request,
    Response,
    UseGuards,
    UseInterceptors,
} from "@nestjs/common";
import {
    ApiBadRequestResponse,
    ApiCookieAuth,
    ApiCreatedResponse,
    ApiOkResponse,
    ApiTags,
    ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { FastifyReply } from "fastify";

// Services
import { AuthService }  from "../services";
import { UsersService } from "../../../domains/users/services";

// Instruments
import { CurrentUser, SerializeInterceptor } from "../../../common";
import { CreateUserDto, UserDto }            from "../../../domains/users/dto";
import { RequestWithUser }                   from "../interfaces";
import { JwtAuthGuard, LocalAuthGuard }      from "../guards";
import { User }                              from "../../../domains/users/user.schema";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly usersService: UsersService,
    ) {}


    @Post("signup")
    @UseInterceptors(new SerializeInterceptor(UserDto))
    @ApiCreatedResponse({ type: UserDto })
    @ApiBadRequestResponse({ description: "Email is already in use" })
    async signUp(
        @Response({ passthrough: true }) response: FastifyReply,
        @Body() createUserDto: CreateUserDto, // eslint-disable-line @typescript-eslint/indent
    ): Promise<User> {
        const existingUser = await this.usersService.findOneByEmail(createUserDto.email);

        if (existingUser) {
            throw new BadRequestException("Email is already in use");
        }

        const hashedPassword = this.authService.hashPassword(createUserDto.password);
        const user = await this.usersService.create({
            ...createUserDto,
            password: hashedPassword,
        });

        const authToken = this.authService.getJwtToken(user as unknown as UserDto);
        const options = this.authService.getCookieOptions();

        response.setCookie(
            "Authentication",
            authToken,
            options,
        );

        return user;
    }


    @Post("signin")
    @HttpCode(HttpStatus.OK)
    @UseGuards(LocalAuthGuard)
    @UseInterceptors(new SerializeInterceptor(UserDto))
    @ApiOkResponse({ type: UserDto })
    @ApiUnauthorizedResponse({ description: "Unauthorized" })
    signIn(
        @Response({ passthrough: true }) response: FastifyReply,
        @Request() request: RequestWithUser, // eslint-disable-line @typescript-eslint/indent
    ): UserDto {
        const { user } = request;
        const authToken = this.authService.getJwtToken(user);
        const options = this.authService.getCookieOptions();

        response.setCookie(
            "Authentication",
            authToken,
            options,
        );

        return user;
    }


    @Post("signout")
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard)
    @ApiCookieAuth()
    @ApiOkResponse({ description: "Signout success" })
    @ApiUnauthorizedResponse({ description: "Unauthorized" })
    signOut(@Response({ passthrough: true }) response: FastifyReply): void {
        const options = this.authService.getSignOutCookieOptions();

        response.setCookie(
            "Authentication",
            "",
            options,
        );
    }


    @Get("current-user")
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(new SerializeInterceptor(UserDto))
    @ApiCookieAuth()
    @ApiOkResponse({ type: UserDto })
    @ApiUnauthorizedResponse({ description: "Unauthorized" })
    async currentUser(
        @Response({ passthrough: true }) response: FastifyReply,
        @CurrentUser() currentUser: UserDto, // eslint-disable-line @typescript-eslint/indent
    ): Promise<User> {
        const user = await this.usersService.findOneById(currentUser.id);

        if (!user) {
            throw new NotFoundException();
        }

        const authToken = this.authService.getJwtToken(user as unknown as UserDto);
        const options = this.authService.getCookieOptions();

        response.setCookie(
            "Authentication",
            authToken,
            options,
        );

        return user;
    }
}
