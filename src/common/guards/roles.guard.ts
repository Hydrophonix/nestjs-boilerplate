// Core
import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector }                                 from "@nestjs/core";

const matchRoles = (roles: Array<string>, userRoles: Array<string>) => {
    console.log("🚀 ~ file: roles.guard.ts ~ line 6 ~ matchRoles ~ userRoles", userRoles);
    console.log("🚀 ~ file: roles.guard.ts ~ line 6 ~ matchRoles ~ roles", roles);

    // matching logic should be here
    return true;
};

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const roles = this.reflector.get<string[]>("roles", context.getHandler());
        if (!roles) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        return matchRoles(roles, user.roles);
    }
}
