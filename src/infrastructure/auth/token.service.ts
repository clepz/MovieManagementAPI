import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuthPayload } from '../../shared/interfaces/auth.interface';
import { TokensResponseDto } from '../../application/dtos/response/login-response.dto';
import UserRepositoryImpl from '../../domain/repositories/user.repository.impl';

@Injectable()
export class TokenService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly userRepository: UserRepositoryImpl,
    ) {}
    async generateToken(userId: string): Promise<TokensResponseDto> {
        const user = await this.userRepository.findOneBy({ id: userId }); // cache should be used
        const jwtPayload: AuthPayload = {
            sub: userId,
            role: user.role,
        };

        const [at, rt] = await Promise.all([
            this.jwtService.signAsync(jwtPayload, {
                secret: this.configService.get<string>('access_token_secret'),
                expiresIn: this.configService.get<string>(
                    'access_token_expires_in',
                ),
            }),
            this.jwtService.signAsync(jwtPayload, {
                secret: this.configService.get<string>('refresh_token_secret'),
                expiresIn: this.configService.get<string>(
                    'refresh_token_expires_in',
                ),
            }),
        ]);

        return {
            access_token: at,
            refresh_token: rt,
        };
    }
}
