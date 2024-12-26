import {
    Body,
    Controller,
    Get,
    Post,
    UseInterceptors,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { RegisterUserDto } from '../../dtos/RegisterUser.dto';
import { AuthService } from '../../services/auth/auth.service';
import SignInDto from '../../dtos/SignIn.dto';
import { PasswordHashInterceptor } from '../../interceptors/password-hash.interceptor';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @ApiBody({ type: RegisterUserDto })
    @Post('register')
    @UsePipes(ValidationPipe)
    @UseInterceptors(PasswordHashInterceptor)
    async signUp(@Body() body: RegisterUserDto) {
        await this.authService.register(body);
    }

    @ApiBody({ type: SignInDto })
    @Post('signin')
    @UsePipes(ValidationPipe)
    async signIn(@Body() body: SignInDto) {
        await this.authService.signIn(body);
    }
}
