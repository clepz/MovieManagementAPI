import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenService } from './token.service';
import { ConfigService } from '@nestjs/config';
import User from '../../domain/entities/user.entity';
import { AtGuard } from './guards/at.guard';
import { AtStrategy } from './strategies/at.strategy';
import { RtStrategy } from './strategies/rt.strategy';
import { JwtService } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import UserRepositoryImpl from '../../domain/repositories/user.repository.impl';

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
        UserRepositoryImpl,
    ],
    exports: [],
})
export class AuthModule {}
