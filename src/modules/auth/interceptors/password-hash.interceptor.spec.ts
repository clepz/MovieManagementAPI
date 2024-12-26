import { PasswordHashInterceptor } from './password-hash.interceptor';

describe('PasswordHashInterceptor', () => {
    it('should be defined', () => {
        expect(new PasswordHashInterceptor()).toBeDefined();
    });
});
