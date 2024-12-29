import ApiCustomSwaggerDoc from '../interfaces/api-custom-swagger-doc.interface';

export const AddMovieSwagger: ApiCustomSwaggerDoc = {
    POST: {
        operation: {
            summary: 'Create a new movie',
            description:
                'Requires: **manager** role.<br>Creates a new movie and returns the created movie details.',
        },
    },
};

export const AddMovieBulkSwagger: ApiCustomSwaggerDoc = {
    POST: {
        operation: {
            summary: 'Add movies in bulk',
            description:
                'Requires: **manager** role.<br>Adds multiple movies in bulk and returns the result.',
        },
    },
};

export const DeleteMovieSwagger: ApiCustomSwaggerDoc = {
    DELETE: {
        operation: {
            summary: 'Delete a movie',
            description:
                'Requires: **manager** role.<br>Deletes a movie by its ID.',
        },
    },
};

export const GetMovieSwagger: ApiCustomSwaggerDoc = {
    GET: {
        operation: {
            summary: 'Get a movie by ID',
            description: 'Retrieves a movie by its ID.',
        },
    },
};

export const GetAllMoviesSwagger: ApiCustomSwaggerDoc = {
    GET: {
        operation: {
            summary: 'Get all available movies',
            description:
                'Retrieves a list of all movies these have at least one session.',
        },
    },
};

export const UpdateMovieSwagger: ApiCustomSwaggerDoc = {
    PATCH: {
        operation: {
            summary: 'Modifies a movie by its ID.',
            description: 'Requires: **manager** role.<br>Update a movie',
        },
    },
};
