import {
    Body,
    Controller,
    Get,
    Post,
    Req,
    UseGuards,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { UsersService } from '../../../domain/services/users.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CheckRole } from '../decorators/check-role.decorator';
import Role from '../../../shared/enums/role.enum';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Get()
    @ApiBearerAuth()
    @CheckRole([Role.CUSTOMER])
    // @ApiHeader({ name: 'Authorization', required: true })
    async getOne(@Req() req) {
        return 'test';
    }
}
