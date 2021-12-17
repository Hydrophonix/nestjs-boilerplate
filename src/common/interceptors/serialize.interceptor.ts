// Core
import { NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { Observable }                                     from "rxjs";
import { map }                                            from "rxjs/operators";
import { plainToClass }                                   from "class-transformer";

export class SerializeInterceptor implements NestInterceptor {
    constructor(
        private readonly dto: any,
    ) {}

    intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
        return handler.handle().pipe(
        // data is the incoming user entity
            map((data: any) => {
                return plainToClass(this.dto, data, {
                    excludeExtraneousValues: true,
                });
            }),
        );
    }
}
