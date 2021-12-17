// Core
import { CacheModule, forwardRef, Module } from "@nestjs/common";
import { ConfigModule, ConfigService }     from "@nestjs/config";
import { MongooseModule }                  from "@nestjs/mongoose";
import * as redisStore                     from "cache-manager-redis-store";

// Modules
import { AuthModule } from "../../core/auth";

// Controllers
import { UsersController } from "./controllers";

// Services
import { UsersService } from "./services";

// Instruments
import { AppConfig }        from "../../config";
import { User, UserSchema } from "./user.schema";

@Module({
    imports: [
        MongooseModule.forFeature(
            [{ name: User.name, schema: UserSchema }],
        ),
        CacheModule.registerAsync({
            imports:    [ ConfigModule ],
            inject:     [ ConfigService ],
            useFactory: (configService: ConfigService<AppConfig>) => ({
                store: redisStore,
                host:  configService.get("REDIS_HOST"),
                port:  configService.get("REDIS_PORT"),
                ttl:   30,
            }),
        }),
        forwardRef(() => AuthModule),
    ],
    controllers: [ UsersController ],
    providers:   [ UsersService ],
    exports:     [ UsersService ],
})
export class UsersModule {}
