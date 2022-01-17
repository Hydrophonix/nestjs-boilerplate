// Core
import { ValidationPipe } from "@nestjs/common";

// Instruments
import { ValidationException } from "../exceptions";

export const AppValidationPipe = new ValidationPipe({
    transform:            true,
    disableErrorMessages: true,
    exceptionFactory:     (errors) => {
        const validation = Object.fromEntries(
            errors.map(
                (error) => [
                    error.property,
                    Object.values(error.constraints),
                ],
            ),
        );

        return new ValidationException(validation);
    },
});
