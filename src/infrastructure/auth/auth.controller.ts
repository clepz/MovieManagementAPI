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
import {
    ApiBearerAuth,
    ApiBody,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
// import { TokenService } from '../../../modules/auth/services/token/token.service';
import { PasswordHashInterceptor } from '../http/interceptors/password-hash.interceptor';
import { TokenService } from './token.service';
import { AuthService } from './auth.service';
import { RegisterUserDto } from '../../application/dtos/register-user.dto';
import { Public } from '../http/decorators/is-public.decorator';
import SignInDto from '../../application/dtos/sign-in.dto';
import { Throttle } from '@nestjs/throttler';
import { GetCurrentUserId } from '../http/decorators/get-current-user-id.decorator';
import { RtGuard } from './guards/rt.guard';
import { TokensResponseDto } from '../../application/dtos/response/login-response.dto';
import { plainToInstance } from 'class-transformer';
import {
    RefreshTokensSwagger,
    RegisterUserSwagger,
    SignInUserSwagger,
} from '../../shared/swagger/auth.swagger';
import { LoggerService } from '../../shared/services/custom-logger.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly tokenService: TokenService,
        private readonly logger: LoggerService,
    ) {}

    @ApiBody({ type: RegisterUserDto })
    @ApiResponse({ status: 201, description: 'User registered' })
    @ApiResponse({
        status: 400,
        description: 'Bad request / The username is already taken',
    })
    @ApiOperation(RegisterUserSwagger.POST.operation)
    @Post('register')
    @UsePipes(ValidationPipe)
    @UseInterceptors(PasswordHashInterceptor)
    @Public()
    async signUp(@Body() body: RegisterUserDto) {
        await this.authService.register(body);
    }

    @ApiOperation(SignInUserSwagger.POST.operation)
    @ApiResponse({
        status: 200,
        description: 'User signed in',
        type: TokensResponseDto,
    })
    @ApiResponse({ status: 400, description: 'Invalid username or password' })
    @ApiResponse({ status: 429, description: 'Too many requests' })
    @Throttle({ default: { limit: 5, ttl: 60000 } })
    @Post('signin')
    @UsePipes(ValidationPipe)
    @Public()
    @HttpCode(HttpStatus.OK)
    async signIn(@Body() body: SignInDto) {
        const tokens = await this.authService.signIn(body);
        return plainToInstance(TokensResponseDto, tokens);
    }

    @ApiBearerAuth('refresh-token')
    @ApiOperation(RefreshTokensSwagger.POST.operation)
    @ApiResponse({
        status: 200,
        description: 'Tokens refreshed',
        type: TokensResponseDto,
    })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @Public()
    @UseGuards(RtGuard)
    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    refreshTokens(@GetCurrentUserId() userId: string) {
        const tokens = this.tokenService.generateToken(userId);
        return plainToInstance(TokensResponseDto, tokens);
    }
}
