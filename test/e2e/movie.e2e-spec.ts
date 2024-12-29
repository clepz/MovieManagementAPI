import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { v4 as uuid } from 'uuid';
import getTestingModule from '../testing-module';
import Movie from '../../src/domain/entities/movie.entity';

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
        const response = await request(app.getHttpServer())
            .get('/movies')
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(200);

        expect(response.body).toBeInstanceOf(Array);
    });

    it('/movies/:id (GET) - should get a movie by ID', async () => {
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
                        date: '2023-12-30',
                        time: '10.00-12.00',
                        roomNumber: 1,
                    },
                ],
            })
            .expect(201);

        const getAllResponse = await request(app.getHttpServer())
            .get('/movies')
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(200);
        expect(getAllResponse.body).toBeInstanceOf(Array);
        expect(getAllResponse.body.length).toBeGreaterThan(0);
        // response must have the movietitle we created
        const createdMovie = getAllResponse.body.find(
            (movie: Movie) => movie.title === movieTitle,
        ) as Movie;
        expect(createdMovie).toBeDefined();
        const movieId = createdMovie.id;

        const response = await request(app.getHttpServer())
            .get(`/movies/${movieId}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(200);

        expect(response.body).toHaveProperty('id', movieId);
    });

    it('/movies/:id (PATCH) - should update a movie', async () => {
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
                        date: '2023-02-11',
                        time: '10.00-12.00',
                        roomNumber: 2,
                    },
                ],
            })
            .expect(201);

        const getAllResponse = await request(app.getHttpServer())
            .get('/movies')
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(200);
        expect(getAllResponse.body).toBeInstanceOf(Array);
        expect(getAllResponse.body.length).toBeGreaterThan(0);
        // response must have the movietitle we created
        const createdMovie = getAllResponse.body.find(
            (movie: Movie) => movie.title === movieTitle,
        ) as Movie;
        expect(createdMovie).toBeDefined();
        const movieId = createdMovie.id;

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
        await request(app.getHttpServer())
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

        const getAllResponse = await request(app.getHttpServer())
            .get('/movies')
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(200);
        expect(getAllResponse.body).toBeInstanceOf(Array);
        expect(getAllResponse.body.length).toBeGreaterThan(0);

        const movieId = getAllResponse.body[0].id;

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
});
