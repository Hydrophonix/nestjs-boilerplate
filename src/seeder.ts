// Core
import { seeder }         from "nestjs-seeder";
import { MongooseModule } from "@nestjs/mongoose";

// Modules
import { ConfigurationModule } from "./core/configuration";
import { DatabaseModule }      from "./core/database";

// Instruments
import { User, UserSchema } from "./domains/users/user.schema";
import { UsersSeeder }      from "./domains/users/users.seeder";

seeder({
    imports: [
        ConfigurationModule,
        DatabaseModule,
        MongooseModule.forFeature(
            [{ name: User.name, schema: UserSchema }],
        ),
    ],
}).run([ UsersSeeder ]);
