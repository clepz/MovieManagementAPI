import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
    AuthPayload,
    AuthPayloadWithRt,
} from '../../../shared/interfaces/auth.interface';

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor(config: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.get<string>('refresh_token_secret'),
            passReqToCallback: true,
        });
    }

    validate(req: Request, payload: AuthPayload): AuthPayloadWithRt {
        const refreshToken = req
            ?.get('authorization')
            ?.replace('Bearer', '')
            .trim();

        if (!refreshToken)
            throw new ForbiddenException('Refresh token malformed');

        return {
            ...payload,
            refreshToken,
        };
    }
}
