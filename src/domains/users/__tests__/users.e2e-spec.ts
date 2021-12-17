// Core
import { Test }                                   from "@nestjs/testing";
import { FastifyAdapter, NestFastifyApplication } from "@nestjs/platform-fastify";

// Instruments
import { UsersModule }  from "../users.module";
import { UsersService } from "../services/users.service";

describe("user", () => {
    const url = "/users";
    let app: NestFastifyApplication;
    let userService = { findAll: () => [ "test" ]};

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [ UsersModule ],
        })
            .overrideProvider(UsersService)
            .useValue(userService)
            .compile();

        app = moduleRef.createNestApplication<NestFastifyApplication>(
            new FastifyAdapter(),
        );

        await app
            .init();
        await app
            .getHttpAdapter()
            .getInstance()
            .ready();
    });

    afterAll(async () => {
        await app.close();
    });

    test(`${url} GET`, async () => {
        const response = await app.inject({
            method: "GET",
            url,
        });

        expect(response.statusCode).toEqual(200);
        expect(JSON.parse(response.payload)).toEqual(userService.findAll());
    });
});
