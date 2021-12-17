// Core
import { Module }       from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

// Instruments
import appConfig from "../../config/app-config";

@Module({
    imports: [
        ConfigModule.forRoot({
            ignoreEnvFile: true,
            isGlobal:      true,
            load:          [ appConfig ],
        }),
    ],
})
export class ConfigurationModule {}
