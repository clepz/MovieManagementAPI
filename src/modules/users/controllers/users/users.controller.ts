import {
    Body,
    Controller,
    Get,
    Post,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { UsersService } from 'src/modules/users/services/users/users.service';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {}
}
