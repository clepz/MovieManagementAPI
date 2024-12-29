import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { v4 as uuid } from 'uuid';
import getTestingModule from '../testing-module';

describe('AuthController (e2e)', () => {
    let app: INestApplication;

    beforeAll(async () => {
        app = await getTestingModule();
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    it('/auth/register (POST) - should register a new user', async () => {
        const uniqueUsername = `testuser_${uuid()}`;
        const response = await request(app.getHttpServer())
            .post('/auth/register')
            .send({
                username: uniqueUsername,
                password: 'Test@1234',
                age: 25,
            })
            .expect(201);

        expect(response.body).toEqual({});
    });

    it('/auth/signin (POST) - should sign in a user', async () => {
        const uniqueUsername = `testuser_${uuid()}`;
        await request(app.getHttpServer())
            .post('/auth/register')
            .send({
                username: uniqueUsername,
                password: 'Test@1234',
                age: 25,
            })
            .expect(201);

        const response = await request(app.getHttpServer())
            .post('/auth/signin')
            .send({
                username: uniqueUsername,
                password: 'Test@1234',
            })
            .expect(200);

        expect(response.body).toHaveProperty('access_token');
        expect(response.body).toHaveProperty('refresh_token');
    });

    it('/auth/refresh (POST) - should refresh tokens', async () => {
        const uniqueUsername = `testuser_${uuid()}`;
        await request(app.getHttpServer())
            .post('/auth/register')
            .send({
                username: uniqueUsername,
                password: 'Test@1234',
                age: 25,
            })
            .expect(201);

        const signInResponse = await request(app.getHttpServer())
            .post('/auth/signin')
            .send({
                username: uniqueUsername,
                password: 'Test@1234',
            })
            .expect(200);

        const refreshToken = signInResponse.body.refresh_token as string;

        const refreshResponse = await request(app.getHttpServer())
            .post('/auth/refresh')
            .set('Authorization', `Bearer ${refreshToken}`)
            .expect(200);

        expect(refreshResponse.body).toHaveProperty('access_token');
        expect(refreshResponse.body).toHaveProperty('refresh_token');
    });
});
