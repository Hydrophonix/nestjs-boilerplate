// Core
import { Strategy }                          from "passport-local";
import { PassportStrategy }                  from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";

// Instruments
import { UserDto }     from "../../../domains/users/dto";
import { AuthService } from "../services";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super({ usernameField: "email" });
    }

    async validate(email: string, password: string): Promise<UserDto> {
        const user = await this.authService.validateUser(email, password);

        if (!user) {
            throw new UnauthorizedException();
        }

        return user;
    }
}
