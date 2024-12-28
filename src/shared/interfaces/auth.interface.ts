import Role from '../enums/role.enum';

export interface AuthPayload {
    sub: string;
    role: Role;
}

export interface AuthPayloadWithRt extends AuthPayload {
    refreshToken: string;
}
