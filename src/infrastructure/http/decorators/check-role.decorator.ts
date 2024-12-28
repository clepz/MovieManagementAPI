import { Reflector } from '@nestjs/core';
import Role from '../../../shared/enums/role.enum';

import { applyDecorators, UseGuards } from '@nestjs/common';
import { RolesGuard } from '../../auth/guards/role.guard';

export const Roles = Reflector.createDecorator<Role[]>();

// if one of the given roles is the same as the user's role, the user can access the route
export function CheckRole(roles: Role[]) {
    return applyDecorators(Roles(roles), UseGuards(RolesGuard));
}
