import ApiCustomSwaggerDoc from '../interfaces/api-custom-swagger-doc.interface';

export const GetMovieSessionsSwagger: ApiCustomSwaggerDoc = {
    GET: {
        operation: {
            summary: 'Get all movie sessions',
            description: 'Returns all movie sessions for a movie.',
        },
    },
};

export const GetMovieSessionSwagger: ApiCustomSwaggerDoc = {
    GET: {
        operation: {
            summary: 'Get a movie session',
            description: 'Returns a movie session by its ID.',
        },
    },
};
export const AddMovieSessionSwagger: ApiCustomSwaggerDoc = {
    POST: {
        operation: {
            summary: 'Create a new movie session',
            description:
                'Creates a new movie session and returns the created session details.',
        },
    },
};

export const DeleteMovieSessionSwagger: ApiCustomSwaggerDoc = {
    DELETE: {
        operation: {
            summary: 'Delete a movie session',
            description: 'Deletes a movie session by its ID.',
        },
    },
};

export const ModifyMovieSessionSwagger: ApiCustomSwaggerDoc = {
    PATCH: {
        operation: {
            summary: 'Modify a movie session',
            description: 'Modifys a movie session by its ID.',
        },
    },
};
