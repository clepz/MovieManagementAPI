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
import { RegisterUserDto } from '../../dtos/RegisterUser.dto';
import { AuthService } from '../../services/auth/auth.service';
import SignInDto from '../../dtos/SignIn.dto';
import { PasswordHashInterceptor } from '../../interceptors/password-hash.interceptor';
import { Throttle } from '@nestjs/throttler';
import { Public } from '../../../../decorators/is-public.decorator';
import { RtGuard } from '../../../../guards/rt.guard';
import { GetCurrentUserId } from '../../../../decorators/get-current-user-id.decorator';
import { TokenService } from '../../services/token/token.service';

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
