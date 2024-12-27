import ROLE from '../../shared/enums/role.enum';

declare global {
    namespace Express {
        interface User {
            sub: string;
            role: ROLE;
        }
    }
}

export {};
