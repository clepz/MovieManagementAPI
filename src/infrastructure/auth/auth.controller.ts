import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Post,
    UseGuards,
    UseInterceptors,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
// import { TokenService } from '../../../modules/auth/services/token/token.service';
import { PasswordHashInterceptor } from '../http/interceptors/password-hash.interceptor';
import { TokenService } from './token.service';
import { AuthService } from './auth.service';
import { RegisterUserDto } from '../../application/dtos/RegisterUser.dto';
import { Public } from '../http/decorators/is-public.decorator';
import SignInDto from '../../application/dtos/SignIn.dto';
import { Throttle } from '@nestjs/throttler';
import { GetCurrentUserId } from '../http/decorators/get-current-user-id.decorator';
import { RtGuard } from './guards/rt.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly tokenService: TokenService,
    ) {}

    @ApiBody({ type: RegisterUserDto })
    @Post('register')
    @UsePipes(ValidationPipe)
    @UseInterceptors(PasswordHashInterceptor)
    @Public()
    async signUp(@Body() body: RegisterUserDto) {
        await this.authService.register(body);
    }

    @ApiBody({ type: SignInDto })
    @Throttle({ default: { limit: 5, ttl: 60000 } })
    @Post('signin')
    @UsePipes(ValidationPipe)
    @Public()
    @HttpCode(HttpStatus.OK)
    async signIn(@Body() body: SignInDto) {
        return await this.authService.signIn(body);
    }

    @Public()
    @UseGuards(RtGuard)
    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    refreshTokens(@GetCurrentUserId() userId: string) {
        return this.tokenService.generateToken(userId);
    }
}
