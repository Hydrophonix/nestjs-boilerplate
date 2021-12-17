// Core
import { Module }                      from "@nestjs/common";
import { MongooseModule }              from "@nestjs/mongoose";
import { ConfigModule, ConfigService } from "@nestjs/config";

// Instruments
import { AppConfig } from "../../config";

@Module({
    imports: [
        MongooseModule.forRootAsync({
            imports:    [ ConfigModule ],
            inject:     [ ConfigService ],
            useFactory: (configService: ConfigService<AppConfig>) => ({
                uri:           configService.get("DATABASE_URI"),
                retryAttempts: 10,
                retryDelay:    1000 * 5,
            }),
        }),
    ],
})
export class DatabaseModule {}
