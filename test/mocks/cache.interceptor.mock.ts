// Core
import { NestInterceptor } from "@nestjs/common";

export class MockCacheInterceptor implements NestInterceptor {
    intercept(context, next) {
        return next.handle();
    }
}
