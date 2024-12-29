import {
    ClassSerializerInterceptor,
    INestApplication,
    ValidationPipe,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';

const getTestingModule = async (): Promise<INestApplication> => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
    }).compile();

    const app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalInterceptors(
        new ClassSerializerInterceptor(app.get(Reflector), {
            strategy: 'excludeAll',
        }),
    );
    return app;
};

export default getTestingModule;
