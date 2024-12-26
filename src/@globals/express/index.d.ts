declare global {
    namespace Express {
        interface User {
            sub: string;
        }
    }
}

export {};
