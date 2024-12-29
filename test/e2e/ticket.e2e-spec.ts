import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { v4 as uuid } from 'uuid';
import getTestingModule from '../testing-module';

describe('TicketsController (e2e)', () => {
    let app: INestApplication;
    let accessToken: string;
    let movieSessionId: string;
    let customerAccessToken: string;

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

        // Create a movie session
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
                        date: '2023-12-13',
                        time: '14.00-16.00',
                        roomNumber: 1,
                    },
                ],
            })
            .expect(201);
        expect(createResponse.body?.id).toBeDefined();
        const movieResponse = await request(app.getHttpServer())
            .get(`/movies/${createResponse.body?.id}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .query({ title: movieTitle })
            .expect(200);
        expect(movieResponse.body.title).toBe(movieTitle);
        expect(movieResponse.body.sessions[0].id).toBeDefined();
        movieSessionId = movieResponse.body.sessions[0].id as string;

        // Register a customer
        const customerUser = `customer_${uuid()}`;
        await request(app.getHttpServer())
            .post('/auth/register')
            .send({
                username: customerUser,
                password: 'Customer@1234',
                age: 30,
            })
            .expect(201);

        // Sign in as the manager
        const customerSignInResponse = await request(app.getHttpServer())
            .post('/auth/signin')
            .send({
                username: customerUser,
                password: 'Customer@1234',
            })
            .expect(200);
        customerAccessToken = customerSignInResponse.body
            .access_token as string;
    });

    afterAll(async () => {
        await app.close();
    });

    it('/tickets (POST) - should return forbidden error due to age restriction', async () => {
        // Register a user under age
        const userUsername = `user_${uuid()}`;
        await request(app.getHttpServer())
            .post('/auth/register')
            .send({
                username: userUsername,
                password: 'User@1234',
                age: 16,
            })
            .expect(201);

        // Sign in as the user
        const signInResponse = await request(app.getHttpServer())
            .post('/auth/signin')
            .send({
                username: userUsername,
                password: 'User@1234',
            })
            .expect(200);

        const userAccessToken = signInResponse.body.access_token as string;

        // Attempt to buy a ticket
        await request(app.getHttpServer())
            .post('/tickets')
            .set('Authorization', `Bearer ${userAccessToken}`)
            .send({
                sessionId: movieSessionId,
            })
            .expect(403); // Expecting Forbidden error
    });

    it('/tickets (POST) - should successfully buy a ticket', async () => {
        // Register a user of appropriate age
        const userUsername = `user_${uuid()}`;
        await request(app.getHttpServer())
            .post('/auth/register')
            .send({
                username: userUsername,
                password: 'User@1234',
                age: 20,
                role: 'customer',
            })
            .expect(201);

        // Sign in as the user
        const signInResponse = await request(app.getHttpServer())
            .post('/auth/signin')
            .send({
                username: userUsername,
                password: 'User@1234',
            })
            .expect(200);

        const userAccessToken = signInResponse.body.access_token as string;

        // Buy a ticket
        await request(app.getHttpServer())
            .post('/tickets')
            .set('Authorization', `Bearer ${userAccessToken}`)
            .send({
                sessionId: movieSessionId,
            })
            .expect(201); // Expecting Created status
    });

    it('/tickets (GET) - should get all tickets for the user', async () => {
        // Buy 3 tickets
        for (let i = 0; i < 3; i++) {
            await request(app.getHttpServer())
                .post('/tickets')
                .set('Authorization', `Bearer ${customerAccessToken}`)
                .send({
                    sessionId: movieSessionId,
                })
                .expect(201); // Expecting Created status
        }

        // Get tickets
        const response = await request(app.getHttpServer())
            .get('/tickets')
            .set('Authorization', `Bearer ${customerAccessToken}`)
            .expect(200);

        expect(response.body).toBeInstanceOf(Array);
        expect(response.body.length).toBeGreaterThan(2);
    });

    it('/tickets/:id (PATCH) - should use a ticket', async () => {
        // Buy a ticket
        await request(app.getHttpServer())
            .post('/tickets')
            .set('Authorization', `Bearer ${customerAccessToken}`)
            .send({
                sessionId: movieSessionId,
            })
            .expect(201); // Expecting Created status

        // Get tickets
        const response = await request(app.getHttpServer())
            .get('/tickets')
            .query({ status: '1' })
            .set('Authorization', `Bearer ${customerAccessToken}`)
            .expect(200);

        expect(response.body).toBeInstanceOf(Array);
        expect(response.body.length).toBeGreaterThan(0);

        const ticketId = response.body[0].id as string;
        // Use the ticket
        await request(app.getHttpServer())
            .patch(`/tickets/${ticketId}`)
            .set('Authorization', `Bearer ${customerAccessToken}`)
            .expect(200);

        // Use the same ticket
        await request(app.getHttpServer())
            .patch(`/tickets/${ticketId}`)
            .set('Authorization', `Bearer ${customerAccessToken}`)
            .expect(400); // ticket already used

        await request(app.getHttpServer())
            .patch(`/tickets/${ticketId.slice(0, -1)}9`)
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(404); // Ticket not found
    });
});
