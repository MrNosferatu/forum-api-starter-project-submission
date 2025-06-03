const AuthenticationsTableTestHelper = require("../../../../tests/AuthenticationsTableTestHelper");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const LikesTableTestHelper = require("../../../../tests/LikesTableTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const ServerTestHelper = require("../../../../tests/ServerTestHelper");
const pool = require("../../database/postgres/pool");
const createServer = require("../createServer");
const container = require("../../container");

describe('/likes endpoints',()=>{
    afterAll(async () => {
        await UsersTableTestHelper.cleanTable();
        await ThreadsTableTestHelper.cleanTable();
        await AuthenticationsTableTestHelper.cleanTable();
        await CommentsTableTestHelper.cleanTable();
        await LikesTableTestHelper.cleanTable();
        await pool.end();
    });

    describe('when PUT /threads/{thread_id}/comments/{comment_id}/likes', ()=>{
        it('should response 401 when not authenticated', async ()=>{
            const server = await createServer(container);

            const response = await server.inject({
                method: 'PUT',
                url: '/threads/thread-283/comments/comment-123/likes',
            });

            expect(response.statusCode).toEqual(401);
            
            const result = JSON.parse(response.payload);
            expect(result.error).toEqual('Unauthorized');
            expect(result.message).toEqual('Missing authentication');
        });

        it('should response 404 when given invalid thread', async ()=>{
            const server = await createServer(container);
            const {token} = await ServerTestHelper.getCredential(server);

            const response = await server.inject({
                method: 'PUT',
                url: '/threads/thread-283/comments/comment-123/likes',
                headers: {
                    authorization: `Bearer ${token}`,
                }
            })

            expect(response.statusCode).toEqual(404);

            const result = JSON.parse(response.payload);
            expect(result.status).toEqual('fail');
            expect(result.message).toEqual('Thread not found');
        });

        it('should response 404 when given invalid comment', async ()=>{
            const server = await createServer(container);
            const {token} = await ServerTestHelper.getCredential(server);

            
            await UsersTableTestHelper.addUser({id:'user-18171',username:'who is there'});
            await ThreadsTableTestHelper.addThread({id:'thread-28',owner:'user-18171'});

            const response = await server.inject({
                method: 'PUT',
                url: '/threads/thread-28/comments/comment-123/likes',
                headers: {
                    authorization: `Bearer ${token}`,
                }
            })

            expect(response.statusCode).toEqual(404);

            const result = JSON.parse(response.payload);
            expect(result.status).toEqual('fail');
            expect(result.message).toEqual('Comment not found in this thread!');
        });

        it('should response 200 when liked', async ()=>{
            const server = await createServer(container);
            const {token} = await ServerTestHelper.getCredential(server);

            await UsersTableTestHelper.addUser({id:'user-9187',username:'knock knock'});
            await ThreadsTableTestHelper.addThread({id:'thread-283',title:'Jimmy',owner:'user-9187'});
            await CommentsTableTestHelper.addComment({id:'comment-281',thread_id:'thread-283',owner:'user-9187'})

            const response = await server.inject({
                method: 'PUT',
                url: '/threads/thread-283/comments/comment-281/likes',
                headers: {
                    authorization: `Bearer ${token}`,
                }
            })

            expect(response.statusCode).toEqual(200);

            const result = JSON.parse(response.payload);
            expect(result.status).toEqual('success');
        });

        it('should response 200 when unliked', async ()=>{
            const server = await createServer(container);
            const {token} = await ServerTestHelper.getCredential(server);

            const response = await server.inject({
                method: 'PUT',
                url: '/threads/thread-283/comments/comment-281/likes',
                headers: {
                    authorization: `Bearer ${token}`,
                }
            })

            expect(response.statusCode).toEqual(200);

            const result = JSON.parse(response.payload);
            expect(result.status).toEqual('success');
        });
    });
}); 