import { ApiOperationOptions, ApiQueryOptions } from '@nestjs/swagger';

interface ApiDoc {
    operation?: ApiOperationOptions;
    query?: ApiQueryOptions;
}

export default interface ApiCustomSwaggerDoc {
    POST?: ApiDoc;
    GET?: ApiDoc;
    PUT?: ApiDoc;
    PATCH?: ApiDoc;
    DELETE?: ApiDoc;
}
