import { Reflector } from '@nestjs/core';
import ROLE from '../../../shared/enums/role.enum';

import { applyDecorators, UseGuards } from '@nestjs/common';
import { RolesGuard } from '../../auth/guards/role.guard';

export const Roles = Reflector.createDecorator<ROLE[]>();

// if one of the given roles is the same as the user's role, the user can access the route
export function CheckRole(roles: ROLE[]) {
    return applyDecorators(Roles(roles), UseGuards(RolesGuard));
}
