// Core
import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    Logger,
} from "@nestjs/common";
import { Observable }     from "rxjs";
import { tap }            from "rxjs/operators";
import { FastifyRequest } from "fastify";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const logger = new Logger("Request");
        const req = context.switchToHttp().getRequest<FastifyRequest>();
        // console.log("<<=|X|=>> ~ file: logging.interceptor.ts ~ line 16 ~ LoggingInterceptor ~ intercept ~ req", req);
        // const now = Date.now();

        // Logger.log("=================================", "LoggingInterceptor");
        // Logger.log("|| Before...                   ||", "LoggingInterceptor");
        // Logger.log("|| Some text                   ||", "LoggingInterceptor");

        return next
            .handle()
            .pipe(
                tap(() => {
                    // Logger.log(`|| After... ${Date.now() - now}ms                ||`, "LoggingInterceptor");
                    // Logger.log("=================================", "LoggingInterceptor");
                    logger.log(`Method: ${req.method}, Url: ${req.url}`);
                }),
            );
    }
}
