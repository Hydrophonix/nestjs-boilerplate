// Core
import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy }     from "@nestjs/passport";
import { Injectable }           from "@nestjs/common";
import { ConfigService }        from "@nestjs/config";

// Instruments
import { AppConfig }    from "../../../config";
import { TokenPayload } from "../interfaces";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly configService: ConfigService<AppConfig>,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors(
                [ (request) => request?.cookies?.Authentication ],
            ),
            ignoreExpiration: false,
            secretOrKey:      configService.get("JWT_SECRET"),
        });
    }

    validate(payload: TokenPayload) {
        return {
            id:       payload.id,
            username: payload.username,
            email:    payload.email,
            role:     payload.role,
        };
    }
}
