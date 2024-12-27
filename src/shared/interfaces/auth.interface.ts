import ROLE from '../enums/role.enum';

export interface AuthPayload {
    sub: string;
    role: ROLE;
}

export interface AuthPayloadWithRt extends AuthPayload {
    refreshToken: string;
}
