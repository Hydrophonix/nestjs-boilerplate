// Core
import { forwardRef, Module }          from "@nestjs/common";
import { PassportModule }              from "@nestjs/passport";
import { JwtModule }                   from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";

// Modules
import { UsersModule } from "../../domains/users/users.module";

// Controllers
import { AuthController } from "./controllers";

// Services
import { AuthService } from "./services";

// Instruments
import { AppConfig }                  from "../../config";
import { JwtStrategy, LocalStrategy } from "./strategies";

@Module({
    imports: [
        forwardRef(() => UsersModule),
        PassportModule,
        JwtModule.registerAsync({
            imports:    [ ConfigModule ],
            inject:     [ ConfigService ],
            useFactory: (configService: ConfigService<AppConfig>) => ({
                secret:      configService.get("JWT_SECRET"),
                signOptions: {
                    expiresIn: configService.get("JWT_EXPIRATION"),
                },
            }),
        }),
    ],
    providers: [
        AuthService,
        LocalStrategy,
        JwtStrategy,
    ],
    controllers: [ AuthController ],
    exports:     [ AuthService ],
})
export class AuthModule {}
