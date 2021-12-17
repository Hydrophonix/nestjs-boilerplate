// Core
import { Module } from "@nestjs/common";

// Modules
import { ConfigurationModule } from "./core/configuration";
import { DatabaseModule }      from "./core/database";
import { AuthModule }          from "./core/auth";
import { UsersModule }         from "./domains/users";

@Module({
    imports: [
        ConfigurationModule,
        DatabaseModule,
        AuthModule,
        UsersModule,
    ],
})
export class AppModule {}
