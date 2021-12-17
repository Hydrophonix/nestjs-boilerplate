// Core
import { Injectable }          from "@nestjs/common";
import { InjectModel }         from "@nestjs/mongoose";
import { Model }               from "mongoose";
import { Seeder, DataFactory } from "nestjs-seeder";

// Instruments
import { User } from "./user.schema";

@Injectable()
export class UsersSeeder implements Seeder {
    constructor(@InjectModel(User.name) private readonly user: Model<User>) {}

    seed(): Promise<any> {
        const users = DataFactory.createForClass(User).generate(10);

        return this.user.insertMany(users);
    }

    drop(): Promise<any> {
        return this.user.deleteMany({}).exec();
    }
}
