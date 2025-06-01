const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const AuthenticationsTableTestHelper = require("../../../../tests/AuthenticationsTableTestHelper");
const createServer = require("../createServer");
const container = require("../../container");
const ServerTestHelper = require("../../../../tests/ServerTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const pool = require("../../database/postgres/pool");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");

describe('/threads endpoints', () => {
    afterAll(async () => {
        await UsersTableTestHelper.cleanTable();
        await ThreadsTableTestHelper.cleanTable();
        await AuthenticationsTableTestHelper.cleanTable();
        await pool.end();
    });

    describe('when POST /threads', () => {
        it('should response 401 when not authenticated', async () => {
            const payload = {
                title: '123',
                body: '123',
            };

            const server = await createServer(container);

            const response = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: payload,
            });

            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(401);
            expect(responseJson.error).toEqual('Unauthorized');
            expect(responseJson.message).toEqual('Missing authentication');
        });

        it('should response 400 when not meet property requirement', async () => {
            const payload = {
                title: '123',
            };

            const server = await createServer(container);
            const { token } = await ServerTestHelper.getCredential(server);

            const response = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: payload,
                headers: {
                    authorization: `Bearer ${token}`,
                },
            });

            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(400);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('unable to create new thread due to uncomplete property');
        });

        it('should response 400 when not meet data type requirement', async () => {
            const payload = {
                title: '123',
                body: 13.0
            };

            const server = await createServer(container);
            const { token } = await ServerTestHelper.getCredential(server);

            const response = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: payload,
                headers: {
                    authorization: `Bearer ${token}`,
                },
            });

            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(400);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('unable to create new thread due to invalid data type');
        });

        it('should response 201 when meet all requirement and persist thread data', async () => {
            const payload = {
                title: '123',
                body: 'tubuhku kuat',
            };

            const server = await createServer(container);
            const { token } = await ServerTestHelper.getCredential(server);

            const response = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: payload,
                headers: {
                    authorization: `Bearer ${token}`,
                }
            })

            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(201);
            expect(responseJson.status).toEqual('success');
            expect(responseJson.message).toEqual('SUCCESS_ADDED_NEW_THREAD');
            expect(responseJson.data.addedThread).toBeDefined();
        });

    });

    describe('when GET /threads/{thread_id}', () => {
        it('should response 404 when thread not found', async () => {
            const server = await createServer(container);

            const response = await server.inject({
                method: 'GET',
                url: '/threads/thread-123469',
            });

            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(404);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('Thread not found');
        });

        it('should response 200 and return thread when not logged in', async () => {
            const server = await createServer(container);

            await UsersTableTestHelper.addUser({ id: 'user-911', username: 'Joe' })
            await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-911' });

            const response = await server.inject({
                method: 'GET',
                url: '/threads/thread-123',
            });

            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(200);
            expect(responseJson.status).toEqual('success');
            expect(responseJson.data.thread).toBeDefined();
        });

        it('should response 200 and return thread and the details', async () => {
            const server = await createServer(container);

            await UsersTableTestHelper.addUser({ id: 'user-67', username: 'Ace' })
            await ThreadsTableTestHelper.addThread({ id: 'thread-812', owner: 'user-67' });
            await CommentsTableTestHelper.addComment({ id: 'comment-1', thread_id: 'thread-812', owner: 'user-67' });

            const response = await server.inject({
                method: 'GET',
                url: '/threads/thread-812',
            });

            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(200);
            expect(responseJson.status).toEqual('success');
            expect(responseJson.data.thread).toBeDefined();
            expect(responseJson.data.thread.comments).toBeDefined();
        });
    });
});