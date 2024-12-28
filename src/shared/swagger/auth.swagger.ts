import ApiCustomSwaggerDoc from '../interfaces/api-custom-swagger-doc.interface';
export const RegisterUserSwagger: ApiCustomSwaggerDoc = {
    POST: {
        operation: {
            summary: 'Register a new user',
            description:
                'Registers a new user and returns the user details.<br>Password must be a strong password.',
        },
    },
};

export const SignInUserSwagger: ApiCustomSwaggerDoc = {
    POST: {
        operation: {
            summary: 'Sign in a user',
            description:
                'Signs in a user and returns the access and refresh tokens.',
        },
    },
};

export const RefreshTokensSwagger: ApiCustomSwaggerDoc = {
    POST: {
        operation: {
            summary: 'Refresh tokens',
            description: 'Refreshes the access and refresh tokens.',
        },
    },
};
