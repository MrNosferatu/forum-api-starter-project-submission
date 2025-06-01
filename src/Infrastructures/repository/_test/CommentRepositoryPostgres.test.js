const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const NewComment = require('../../../Domains/comments/entities/NewComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const GetComment = require('../../../Domains/comments/entities/GetComment');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('CommentRepository Postgres', ()=>{
    afterEach(async ()=>{
        await CommentsTableTestHelper.cleanTable();
        await UsersTableTestHelper.cleanTable();
        await ThreadsTableTestHelper.cleanTable();
    });

    afterAll(async () => {
        await pool.end();
    });

    describe('add comment function', ()=>{
        it('should persist new comment and return added comment correctly', async ()=>{
            const owner = 'user-123'
            await UsersTableTestHelper.addUser({id:owner});

            const thread_id = 'thread-123';
            await ThreadsTableTestHelper.addThread({
                id: thread_id,
                title: '123',
                body: 'mempunyai pedang panjang',
                owner: owner,
            })

            const fakeGenerator = ()=>'123';
            const commentRepository = new CommentRepositoryPostgres(pool,fakeGenerator);

            const newComment = new NewComment({
                thread_id: thread_id,
                content: '123',
                owner: owner,
            });

            const commentResult = await commentRepository.addComment(newComment);

            expect(commentResult).toStrictEqual(
                new AddedComment({
                    id: 'comment-123',
                    content: '123',
                    owner: 'user-123'
                })
            );

            const expected = await CommentsTableTestHelper.findComment('comment-123');
            expect(expected).toHaveLength(1);  
        });

    });

    describe('verify comment owner function', ()=>{
        it('should throw error when not comment owner', async ()=>{
            const fakeGenerator = ()=>'123';
            const commentRepository = new CommentRepositoryPostgres(pool,fakeGenerator);

            await expect(commentRepository.verifyCommentOwner('comment-123','user-123')).rejects.toThrowError(AuthorizationError);
        });

        it('should not throw error when is comment owner', async ()=>{
            const fakeGenerator = ()=>'123';
            const commentRepository = new CommentRepositoryPostgres(pool,fakeGenerator);

            const owner = 'user-123'
            await UsersTableTestHelper.addUser({id:owner});

            const thread_id = 'thread-123';
            await ThreadsTableTestHelper.addThread({
                id: thread_id,
                title: '123',
                body: 'mempunyai pedang panjang',
                owner: owner,
            });

            await CommentsTableTestHelper.addComment({
                id: 'comment-123',
                thread_id: 'thread-123',
                owner: owner
            });

            await expect(commentRepository.verifyCommentOwner('comment-123','user-123')).resolves.not.toThrowError(AuthorizationError);
        });

    }); 

    describe('verify comment Thread function', ()=>{
        it('should throw error when comment not in thread', async ()=>{
            const fakeGenerator = ()=>'123';
            const commentRepository = new CommentRepositoryPostgres(pool,fakeGenerator);

            await expect(commentRepository.verifyCommentThread('comment-123','thread-4689')).rejects.toThrowError(NotFoundError);
        });

        it('should not throw error when comment in thread', async ()=>{
            const fakeGenerator = ()=>'123';
            const commentRepository = new CommentRepositoryPostgres(pool,fakeGenerator);
            
            const owner = 'user-123'
            await UsersTableTestHelper.addUser({id:owner});

            const thread_id = 'thread-123';
            await ThreadsTableTestHelper.addThread({
                id: thread_id,
                title: '123',
                body: 'mempunyai pedang panjang',
                owner: owner,
            });

            await CommentsTableTestHelper.addComment({
                id: 'comment-123',
                thread_id: 'thread-123',
                owner: owner
            });

            await expect(commentRepository.verifyCommentThread('comment-123','thread-123')).resolves.not.toThrowError(NotFoundError);
        });
    });

    describe('delete comment function', ()=>{
        it('should delete comment correctly', async ()=>{
            const owner = 'user-123'
            await UsersTableTestHelper.addUser({id:owner});

            const thread_id = 'thread-123';
            await ThreadsTableTestHelper.addThread({
                id: thread_id,
                title: '123',
                body: 'mempunyai pedang panjang',
                owner: owner,
            })

            const fakeGenerator = ()=>'123';
            const commentRepository = new CommentRepositoryPostgres(pool,fakeGenerator);

            const newComment = new NewComment({
                thread_id: thread_id,
                content: '123',
                owner: owner,
            });

            const commentResult = await commentRepository.addComment(newComment);

            const finding1 = await CommentsTableTestHelper.findComment(commentResult.id);
            expect(finding1[0].is_deleted).toEqual(false);
            
            await commentRepository.softDeleteComment(commentResult.id);

            const finding2 = await CommentsTableTestHelper.findComment(commentResult.id);
            expect(finding2[0].is_deleted).toEqual(true);
        });
    });

    describe('get thread comments function',()=>{
        it('should return empty comments correctly', async()=>{
            const owner = 'user-123'
            await UsersTableTestHelper.addUser({id:owner, username:'bambang'});

            const thread_id = 'thread-123';
            await ThreadsTableTestHelper.addThread({
                id: thread_id,
                title: '123',
                body: 'mempunyai pedang panjang',
                owner: owner,
            });

            const commentRepository = new CommentRepositoryPostgres(pool, {});
            const result = await commentRepository.getThreadComments(thread_id);

            expect(result).toHaveLength(0);
            expect(result).toStrictEqual([]);
        });

        it('should return comments correctly', async()=>{
            const owner = 'user-123'
            await UsersTableTestHelper.addUser({id:owner, username:'bambang'});

            const thread_id = 'thread-123';
            await ThreadsTableTestHelper.addThread({
                id: thread_id,
                title: '123',
                body: 'mempunyai pedang panjang',
                owner: owner,
            })

            const comment1 = {
                id: 'comment-123',
                content: 'ini komentar',
                owner: 'user-123',
                thread_id: thread_id,
                date: new Date('2025-04-18T00:00:00.000Z')
            };

            const comment2 = {
                id: 'comment-158',
                content: 'sok asik',
                owner: 'user-123',
                thread_id: thread_id,
                date: new Date('2025-04-19T00:00:00.000Z')
            };

            await CommentsTableTestHelper.addComment(comment2);
            await CommentsTableTestHelper.addComment(comment1);

            const commentRepository = new CommentRepositoryPostgres(pool, {});
            const result = await commentRepository.getThreadComments(thread_id);

            expect(result).toHaveLength(2);
            expect(result).toStrictEqual([
                new GetComment({
                    id: 'comment-123',
                    content: 'ini komentar',
                    username: 'bambang',
                    date: new Date('2025-04-18T00:00:00.000Z'),
                    is_deleted: false
                }),
                new GetComment({
                    id: 'comment-158',
                    content: 'sok asik',
                    username: 'bambang',
                    date: new Date('2025-04-19T00:00:00.000Z'),
                    is_deleted: false
                })
            ]);
        });
    });
});