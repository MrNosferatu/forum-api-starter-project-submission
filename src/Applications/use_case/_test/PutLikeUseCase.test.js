const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const LikesTableTestHelper = require('../../../../tests/LikesTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const NewLike = require('../../../Domains/likes/entities/NewLike');
const LikeRepository = require('../../../Domains/likes/LikeRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');

const PutLikeUseCase = require('../PutLikeUseCase');

describe('PutLikeUseCase',()=>{
    beforeAll(async () => {
        await UsersTableTestHelper.addUser({ id: 'user-123', username: 'user123' });
        await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
        await CommentsTableTestHelper.addComment({ id: 'comment-123', owner: 'user-123' });
    });
    
    afterAll(async () => {
        await UsersTableTestHelper.cleanTable();
        await ThreadsTableTestHelper.cleanTable();
        await CommentsTableTestHelper.cleanTable();
        await LikesTableTestHelper.cleanTable();
    });

    it('should orchestrating the add like action correctly',async()=>{
        const payload = {
            thread_id: 'thread-123',
            comment_id:'comment-123',
            owner:'user-123'
        };

        const mockThreadRepository = new ThreadRepository();
        mockThreadRepository.verifyThread = jest.fn().mockImplementation(()=>Promise.resolve());

        const mockCommentRepository = new CommentRepository();
        mockCommentRepository.verifyCommentThread = jest.fn().mockImplementation(()=>Promise.resolve());

        const mockLikeRepository = new LikeRepository();
        mockLikeRepository.getLike = jest.fn().mockImplementation(()=>Promise.resolve(0));
        mockLikeRepository.addLike = jest.fn().mockImplementation(()=>Promise.resolve());

        const putLikeUseCase = new PutLikeUseCase({likeRepository: mockLikeRepository,commentRepository: mockCommentRepository,threadRepository: mockThreadRepository});
        await putLikeUseCase.execute(payload);

        expect(mockThreadRepository.verifyThread).toBeCalledWith(payload.thread_id);
        expect(mockCommentRepository.verifyCommentThread).toBeCalledWith(payload.comment_id, payload.thread_id);
        expect(mockLikeRepository.getLike).toBeCalledWith(payload.comment_id, payload.owner)
        expect(mockLikeRepository.addLike).toBeCalledWith(new NewLike(payload));
    });

    it('should orchestrating the delete like action correctly',async()=>{
        const payload = {
            thread_id: 'thread-123',
            comment_id:'comment-123',
            owner:'user-123'
        };

        const mockThreadRepository = new ThreadRepository();
        mockThreadRepository.verifyThread = jest.fn().mockImplementation(()=>Promise.resolve());

        const mockCommentRepository = new CommentRepository();
        mockCommentRepository.verifyCommentThread = jest.fn().mockImplementation(()=>Promise.resolve());

        const mockLikeRepository = new LikeRepository();
        mockLikeRepository.getLike = jest.fn().mockImplementation(()=>Promise.resolve(1));
        mockLikeRepository.deleteLike = jest.fn().mockImplementation(()=>Promise.resolve());

        const putLikeUseCase = new PutLikeUseCase({likeRepository: mockLikeRepository,commentRepository: mockCommentRepository,threadRepository: mockThreadRepository});
        await putLikeUseCase.execute(payload);

        expect(mockThreadRepository.verifyThread).toBeCalledWith(payload.thread_id);
        expect(mockCommentRepository.verifyCommentThread).toBeCalledWith(payload.comment_id, payload.thread_id);
        expect(mockLikeRepository.getLike).toBeCalledWith(payload.comment_id, payload.owner)
        expect(mockLikeRepository.deleteLike).toBeCalledWith(payload.comment_id, payload.owner);
    });
});