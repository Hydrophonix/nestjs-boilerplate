// Core
import { BadRequestException } from "@nestjs/common";

export class ValidationException extends BadRequestException {
    constructor(
        readonly validation: Record<string, string[]>,
    ) {
        super();
    }
}
