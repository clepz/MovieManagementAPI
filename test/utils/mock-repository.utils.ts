import { getRepositoryToken } from '@nestjs/typeorm';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import { Repository } from 'typeorm';

export type MockType<T> = {
    [P in keyof T]?: jest.Mock<object>;
};
export const repositoryMockFactory: <T>() => MockType<Repository<T>> = jest.fn(
    () => ({}),
);

export const getMockRepositoryService = (entity: EntityClassOrSchema) => {
    return {
        provide: getRepositoryToken(entity),
        useFactory: repositoryMockFactory,
    };
};
