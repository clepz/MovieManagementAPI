import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuthPayload } from '../../../../lib/interfaces/auth.interface';

@Injectable()
export class TokenService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {}
    async generateToken(userId: string) {
        const jwtPayload: AuthPayload = {
            sub: userId,
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
