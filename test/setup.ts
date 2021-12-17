// Core
import { DynamicModule }       from "@nestjs/common";
import { MongooseModule }      from "@nestjs/mongoose";
import { MongoMemoryServer }   from "mongodb-memory-server";
import { connect, connection } from "mongoose";

export let MongooseTestModule: DynamicModule;

const createMongooseTestModule = (mongoUri: string) => MongooseModule.forRoot(mongoUri);

let mongo: MongoMemoryServer;

beforeAll(async () => {
    // process.env.JWT_KEY = "test";
    // mongo = await MongoMemoryServer.create();
    // const mongoUri = mongo.getUri();

    // MongooseTestModule = createMongooseTestModule(mongoUri);
    // await connect(mongoUri);
});

beforeEach(async () => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    // await connection.db.dropDatabase();
});

afterAll(async () => {
    // await connection.close();
    // await mongo.stop();
});
