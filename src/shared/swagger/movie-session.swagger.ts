import ApiCustomSwaggerDoc from '../interfaces/api-custom-swagger-doc.interface';

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

export const UpdateMovieSessionSwagger: ApiCustomSwaggerDoc = {
    PATCH: {
        operation: {
            summary: 'Update a movie session',
            description: 'Updates a movie session by its ID.',
        },
    },
};
