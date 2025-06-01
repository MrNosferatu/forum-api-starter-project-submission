const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const AuthenticationsTableTestHelper = require("../../../../tests/AuthenticationsTableTestHelper");
const createServer = require("../createServer");
const container = require("../../container");
const ServerTestHelper = require("../../../../tests/ServerTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const pool = require("../../database/postgres/pool");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");

describe('/comments endpoints', () => {
    afterAll(async () => {
        await UsersTableTestHelper.cleanTable();
        await ThreadsTableTestHelper.cleanTable();
        await AuthenticationsTableTestHelper.cleanTable();
        await CommentsTableTestHelper.cleanTable();
        await pool.end();
    });

    describe('when POST /threads/{thread_id}/comments', () => {
        it('should response 401 when not authenticated', async () => {
            const payload = {
                content: '123',
            };

            const server = await createServer(container);

            const response = await server.inject({
                method: 'POST',
                url: '/threads/thread-123/comments',
                payload: payload,
            });

            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(401);
            expect(responseJson.error).toEqual('Unauthorized');
            expect(responseJson.message).toEqual('Missing authentication');
        });

        it('should response 400 when not meet property requirement', async () => {
            const payload = {};

            const server = await createServer(container);

            const { token } = await ServerTestHelper.getCredential(server);

            const response = await server.inject({
                method: 'POST',
                url: '/threads/thread-123/comments',
                payload: payload,
                headers: {
                    authorization: `Bearer ${token}`,
                },
            });

            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(400);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('unable to post new comment due to uncomplete property');
        });

        it('should response 400 when not meet data type requirement', async () => {
            const payload = {
                content: 13.0
            };

            const server = await createServer(container);
            const { token } = await ServerTestHelper.getCredential(server);

            const response = await server.inject({
                method: 'POST',
                url: '/threads/thread-1245/comments',
                payload: payload,
                headers: {
                    authorization: `Bearer ${token}`,
                },
            });

            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(400);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('unable to post new comment due to invalid data type');
        });

        it('should response 404 when given invalid thread', async () => {
            const payload = {
                content: 'aku seorang kapiten',
            };

            const server = await createServer(container);
            const { token } = await ServerTestHelper.getCredential(server);

            const response = await server.inject({
                method: 'POST',
                url: '/threads/thread-123/comments',
                payload: payload,
                headers: {
                    authorization: `Bearer ${token}`,
                }
            })

            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(404);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('Thread not found');
        });

        it('should response 201 when meet all requirement and persist comment data', async () => {
            const payload = {
                content: 'aku seorang kapiten',
            };

            const server = await createServer(container);
            const { token } = await ServerTestHelper.getCredential(server);

            await UsersTableTestHelper.addUser({ id: 'user-4689', username: 'Spontan' });
            await ThreadsTableTestHelper.addThread({ id: 'thread-123', title: 'Uhuy!', owner: 'user-4689' });

            const response = await server.inject({
                method: 'POST',
                url: '/threads/thread-123/comments',
                payload: payload,
                headers: {
                    authorization: `Bearer ${token}`,
                }
            })

            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(201);
            expect(responseJson.status).toEqual('success');
            expect(responseJson.message).toEqual('SUCCESS_ADDED_NEW_COMMENT');
            expect(responseJson.data.addedComment).toBeDefined();
        });

    });

    describe('when DELETE /threads/{thread_id}/comments/{comment_id}', () => {
        it('should response 403 when non owner try to delete', async () => {
            const server = await createServer(container);
            const { token } = await ServerTestHelper.getCredential(server);

            await CommentsTableTestHelper.addComment({
                id: 'comment-7845',
                owner: 'user-4689',
                thread_id: 'thread-123',
                content: 'contoh konten saja'
            })

            const response = await server.inject({
                method: 'DELETE',
                url: '/threads/thread-123/comments/comment-7845',
                headers: {
                    authorization: `Bearer ${token}`,
                }
            });

            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(403);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('Your are not the owner of this comment!');
        });

        it('should response 404 when the comment or thread not valid', async () => {
            const server = await createServer(container);
            const { token } = await ServerTestHelper.getCredential(server);

            const response = await server.inject({
                method: 'DELETE',
                url: '/threads/thread-123/comments/comment-1201',
                headers: {
                    authorization: `Bearer ${token}`,
                }
            });

            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(404);
            expect(responseJson.status).toEqual('fail');
        });

        it('should response 200 when the comment successfully deleted', async () => {
            const server = await createServer(container);
            const { token, user_id } = await ServerTestHelper.getCredential(server);

            await CommentsTableTestHelper.addComment({
                id: 'comment-169',
                owner: user_id,
                thread_id: 'thread-123',
                content: 'contoh konten saja'
            })

            const response = await server.inject({
                method: 'DELETE',
                url: '/threads/thread-123/comments/comment-169',
                headers: {
                    authorization: `Bearer ${token}`,
                }
            });

            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(200);
            expect(responseJson.status).toEqual('success');
        });
    });
});