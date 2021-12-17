// Core
import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    BadGatewayException,
    CallHandler,
} from "@nestjs/common";
import { Observable, throwError } from "rxjs";
import { catchError }             from "rxjs/operators";

@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next
            .handle()
            .pipe(
                catchError((error) => {
                    console.log("🚀 ~ file: error.interceptor.ts ~ line 19 ~ ErrorsInterceptor ~ catchError ~ err", error);

                    return throwError(() => new BadGatewayException());
                }),
            );
    }
}

