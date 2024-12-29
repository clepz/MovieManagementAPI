import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import getTestingModule from '../testing-module';

describe('HelloController (e2e)', () => {
    let app: INestApplication;

    beforeAll(async () => {
        app = await getTestingModule();
        await app.init();
    });

    it('/ (GET)', () => {
        return request(app.getHttpServer())
            .get('/')
            .expect(200)
            .expect('Hello World!');
    });
});
