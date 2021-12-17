// Core
import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
} from "@nestjs/common";
import { FastifyReply } from "fastify";

// Instruments
import { ValidationException } from "../exceptions";

interface ServerError {
    statusCode: number;
    message: string;
    validation?: Record<string, string[]>;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    private readonly serverError: ServerError = {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message:    "Internal Server Error",
    };

    catch(exception: unknown, host: ArgumentsHost) {
        let error = { ...this.serverError };

        if (exception instanceof HttpException) {
            error.statusCode = exception.getStatus();
            error.message = exception.message;
        }

        if (exception instanceof ValidationException) {
            error.validation = exception.validation;
        }

        this.sendError(host, error);
    }

    sendError(host: ArgumentsHost, error: ServerError) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<FastifyReply>();
        // const request = ctx.getRequest();

        response.status(error.statusCode).send(error);
    }
}
