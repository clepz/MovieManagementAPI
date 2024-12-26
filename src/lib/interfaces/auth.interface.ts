export interface AuthPayload {
    sub: string;
}

export interface AuthPayloadWithRt extends AuthPayload {
    refreshToken: string;
}
