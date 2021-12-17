// Core
import { Injectable }             from "@nestjs/common";
import { ConfigService }          from "@nestjs/config";
import { JwtService }             from "@nestjs/jwt";
import { CookieSerializeOptions } from "fastify-cookie";
import * as bcrypt                from "bcryptjs";

// Services
import { UsersService } from "../../../domains/users/services";

// Instruments
import { AppConfig }    from "../../../config";
import { UserDto }      from "../../../domains/users/dto";
import { TokenPayload } from "../interfaces";

@Injectable()
export class AuthService {
    constructor(
        private readonly configService: ConfigService<AppConfig>,
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) {}


    async validateUser(email: string, password: string): Promise<UserDto|null> {
        const user = await this.usersService.findOneByEmail(email);

        if (!user) {
            return null;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return null;
        }

        return {
            id:       user._id,
            email:    user.email,
            username: user.username,
            role:     user.role,
        };
    }


    getJwtToken(user: UserDto) {
        const payload: TokenPayload = {
            id:       user.id,
            username: user.username,
            email:    user.email,
            role:     user.role,
        };

        return this.jwtService.sign(payload);
    }


    getCookieOptions(): CookieSerializeOptions {
        return {
            path:     "/",
            maxAge:   this.configService.get("COOKIE_MAX_AGE"),
            secure:   this.configService.get("IS_PROD"),
            httpOnly: true,
            sameSite: "lax",
            // domain:   this.configService.get('IS_PROD') ? `.${this.config.domain}` : undefined, // eslint-disable-line no-undefined
        };
    }


    getSignOutCookieOptions(): CookieSerializeOptions {
        return {
            path:     "/",
            maxAge:   0,
            secure:   this.configService.get("IS_PROD"),
            httpOnly: true,
            sameSite: "lax",
            // domain:   this.configService.get('IS_PROD') ? `.${this.config.domain}` : undefined, // eslint-disable-line no-undefined
        };
    }


    hashPassword(password: string) {
        const saltRounds = this.configService.get("HASH_SALT_ROUNDS");
        const hashedPassword = bcrypt.hashSync(password, saltRounds);

        return hashedPassword;
    }
}
