import { Module } from '@nestjs/common';
import { AuthService } from './services/auth/auth.service';
import { AuthController } from './controllers/auth/auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenService } from './services/token/token.service';
import { ConfigService } from '@nestjs/config';
import User from '../../models/user/user.entity';
import { AtGuard } from '../../guards/at.guard';
import { AtStrategy } from './strategies/at.strategy';
import { RtStrategy } from './strategies/rt.strategy';
import { JwtService } from '@nestjs/jwt';

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    controllers: [AuthController],
    providers: [
        AuthService,
        ConfigService,
        {
            provide: 'APP_GUARD',
            useClass: AtGuard,
        },
        TokenService,
        JwtService,
        AtStrategy,
        RtStrategy,
    ],
})
export class AuthModule {}
