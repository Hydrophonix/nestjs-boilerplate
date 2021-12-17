// Core
import { connection }  from "mongoose";
import { DataFactory } from "nestjs-seeder";

// Instruments
import { User } from "../src/domains/users/user.schema";


export const generateUser = () => DataFactory.createForClass(User).generate(1)[ 0 ];
export const generateUsers = (number: number) => DataFactory.createForClass(User).generate(number) as unknown as User[];
// export const insertUser = (user: User) => connection.db.collection<User>("users").insertOne(user);
// export const insertUsers = (users: User[]) => connection.db.collection<User>("users").insertMany(users);
export const findUser = (_id: string) =>  connection.db.collection<User>("users").findOne({ _id });
