// Core
import { DocumentBuilder } from "@nestjs/swagger";

export const getSwaggerConfig = () => new DocumentBuilder()
    .setTitle("NestJS Boilerplate")
    .setDescription("Basic API description")
    .setVersion("1.0")
    .addCookieAuth("Authentication")
    .build();
