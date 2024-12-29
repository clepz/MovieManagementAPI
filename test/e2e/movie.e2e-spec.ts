import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { v4 as uuid } from 'uuid';
import getTestingModule from '../testing-module';

describe('MoviesController (e2e)', () => {
    let app: INestApplication;
    let accessToken: string;

    beforeAll(async () => {
        app = await getTestingModule();
        await app.init();

        // Register a manager
        const managerUsername = `manager_${uuid()}`;
        await request(app.getHttpServer())
            .post('/auth/register')
            .send({
                username: managerUsername,
                password: 'Manager@1234',
                age: 30,
            })
            .expect(201);

        // Sign in as the manager
        const signInResponse = await request(app.getHttpServer())
            .post('/auth/signin')
            .send({
                username: managerUsername,
                password: 'Manager@1234',
            })
            .expect(200);

        accessToken = signInResponse.body.access_token as string;
    });

    afterAll(async () => {
        await app.close();
    });

    it('/movies (POST) - should create a new movie', async () => {
        const movie = {
            title: `Test Movie ${uuid()}`,
            description: 'A test movie description',
            ageRestriction: 18,
            sessions: [
                {
                    date: '2023-12-31',
                    time: '12.00-18.00',
                    roomNumber: 2,
                },
            ],
        };
        await request(app.getHttpServer())
            .post('/movies')
            .set('Authorization', `Bearer ${accessToken}`)
            .send(movie)
            .expect(400); // Time range is invalid
        movie.sessions[0].time = '16.00-18.00';
        await request(app.getHttpServer())
            .post('/movies')
            .set('Authorization', `Bearer ${accessToken}`)
            .send(movie)
            .expect(201);
    });

    it('/movies (GET) - should get all movies', async () => {
        for (let i = 0; i < 2; i++) {
            await request(app.getHttpServer())
                .post('/movies')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({
                    title: `Test Movie ${uuid()}`,
                    description: 'A test movie description',
                    ageRestriction: 18,
                    sessions: [
                        {
                            date: '2003-12-30',
                            time: '10.00-12.00',
                            roomNumber: i + 1,
                        },
                    ],
                })
                .expect(201);
        }
        const response = await request(app.getHttpServer())
            .get('/movies')
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(200);

        expect(response.body).toBeInstanceOf(Array);
        expect(response.body.length).toBeGreaterThanOrEqual(2);
    });

    it('/movies/:id (GET) - should get a movie by ID', async () => {
        const movieTitle = `Test Movie ${uuid()}`;
        const createResponse = await request(app.getHttpServer())
            .post('/movies')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({
                title: movieTitle,
                description: 'A test movie description',
                ageRestriction: 18,
                sessions: [
                    {
                        date: '2020-12-30',
                        time: '10.00-12.00',
                        roomNumber: 1,
                    },
                ],
            })
            .expect(201);

        expect(createResponse.body?.id).toBeDefined();
        const movieId = createResponse.body.id as string;

        const response = await request(app.getHttpServer())
            .get(`/movies/${movieId}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(200);

        expect(response.body).toHaveProperty('id', movieId);
    });

    it('/movies (GET) - should get a movie by title', async () => {
        const movieTitle = `Test Movie ${uuid()}`;
        await request(app.getHttpServer())
            .post('/movies')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({
                title: movieTitle,
                description: 'A test movie description',
                ageRestriction: 18,
                sessions: [
                    {
                        date: '2023-01-06',
                        time: '10.00-12.00',
                        roomNumber: 1,
                    },
                ],
            })
            .expect(201);

        const getAllResponse = await request(app.getHttpServer())
            .get('/movies')
            .query({ title: movieTitle })
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(200);
        expect(getAllResponse.body).toBeInstanceOf(Array);
        expect(getAllResponse.body[0]).toBeDefined();
    });

    it('/movies/:id (PATCH) - should update a movie', async () => {
        const movieTitle = `Test Movie ${uuid()}`;
        const createResponse = await request(app.getHttpServer())
            .post('/movies')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({
                title: movieTitle,
                description: 'A test movie description',
                ageRestriction: 18,
                sessions: [
                    {
                        date: '2023-02-11',
                        time: '10.00-12.00',
                        roomNumber: 2,
                    },
                ],
            })
            .expect(201);
        expect(createResponse.body?.id).toBeDefined();
        const movieId = createResponse.body.id as string;

        await request(app.getHttpServer())
            .patch(`/movies/${movieId}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send({
                title: 'Updated Test Movie',
            })
            .expect(204);

        const response = await request(app.getHttpServer())
            .get(`/movies/${movieId}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(200);

        expect(response.body).toHaveProperty('title', 'Updated Test Movie');
    });

    it('/movies/:id (DELETE) - should delete a movie', async () => {
        const createResponse = await request(app.getHttpServer())
            .post('/movies')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({
                title: `Test Movie ${uuid()}`,
                description: 'A test movie description',
                ageRestriction: 18,
                sessions: [
                    {
                        date: '2023-10-10',
                        time: '10.00-12.00',
                        roomNumber: 1,
                    },
                ],
            })
            .expect(201);

        expect(createResponse.body?.id).toBeDefined();
        const movieId = createResponse.body?.id as string;

        await request(app.getHttpServer())
            .delete(`/movies/${movieId}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(204);

        await request(app.getHttpServer())
            .get(`/movies/${movieId}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(404);
    });
    it('/movies (POST) - should return conflict status when trying to add identical movie sessions', async () => {
        const movieData = {
            title: `Test Movie ${uuid()}`,
            description: 'A test movie description',
            ageRestriction: 18,
            sessions: [
                {
                    date: '2023-04-11',
                    time: '10.00-12.00',
                    roomNumber: 1,
                },
            ],
        };

        await request(app.getHttpServer())
            .post('/movies')
            .set('Authorization', `Bearer ${accessToken}`)
            .send(movieData)
            .expect(201);

        await request(app.getHttpServer())
            .post('/movies')
            .set('Authorization', `Bearer ${accessToken}`)
            .send(movieData)
            .expect(409); // Expecting Conflict status
    });
    it('/movies (POST) - should not allow a user with customer role to add a movie', async () => {
        // Register a customer
        const customerUsername = `customer_${uuid()}`;
        await request(app.getHttpServer())
            .post('/auth/register')
            .send({
                username: customerUsername,
                password: 'Customer@1234',
                age: 25,
            })
            .expect(201);

        // Sign in as the customer
        const signInResponse = await request(app.getHttpServer())
            .post('/auth/signin')
            .send({
                username: customerUsername,
                password: 'Customer@1234',
            })
            .expect(200);

        const customerAccessToken = signInResponse.body.access_token;

        // Attempt to add a movie
        await request(app.getHttpServer())
            .post('/movies')
            .set('Authorization', `Bearer ${customerAccessToken}`)
            .send({
                title: `Test Movie ${uuid()}`,
                description: 'A test movie description',
                ageRestriction: 18,
                sessions: [
                    {
                        date: '2023-05-13',
                        time: '12.00-14.00',
                        roomNumber: 2,
                    },
                ],
            })
            .expect(403); // Expecting Forbidden error
    });

    it('/movies/bulk (POST) - should add multiple movies in bulk', async () => {
        const movies = [
            {
                title: `Test Movie ${uuid()}`,
                description: 'A test movie description',
                ageRestriction: 18,
                sessions: [
                    {
                        date: '2023-06-13',
                        time: '12.00-14.00',
                        roomNumber: 2,
                    },
                ],
            },
            {
                title: `Test Movie ${uuid()}`,
                description: 'A test movie description',
                ageRestriction: 18,
                sessions: [
                    {
                        date: '2023-06-13',
                        time: '11.00-14.00', // Invalid time range
                        roomNumber: 2,
                        createdAt: new Date().toISOString(),
                    },
                ],
            },
        ];

        await request(app.getHttpServer())
            .post('/movies/bulk')
            .set('Authorization', `Bearer ${accessToken}`)
            .send(movies)
            .expect(400); // first request must return 400 because of invalid time range
        movies[1].sessions[0].time = '12.00-14.00'; // fix the time range
        const bulkResponse = await request(app.getHttpServer())
            .post('/movies/bulk')
            .set('Authorization', `Bearer ${accessToken}`)
            .send(movies)
            .expect(201); // second request must return 201 even if one of the movies is invalid
        expect(bulkResponse.body.results).toBeDefined();
        expect(bulkResponse.body.results).toHaveLength(2);
        expect(bulkResponse.body.results[0].success).toBe(true);
        expect(bulkResponse.body.results[1].success).toBe(false); // this won't be added because of session time conflict
    });
});
