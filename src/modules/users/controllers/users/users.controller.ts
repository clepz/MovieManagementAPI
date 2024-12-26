import {
    Body,
    Controller,
    Get,
    Post,
    Req,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { UsersService } from '../../services/users/users.service';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Get()
    @ApiBearerAuth()
    // @ApiHeader({ name: 'Authorization', required: true })
    async getOne(@Req() req) {
        return 'qqq';
    }
}
