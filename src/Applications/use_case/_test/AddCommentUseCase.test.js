const CommentRepository = require('../../../Domains/comments/CommentRepository');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const NewComment = require('../../../Domains/comments/entities/NewComment');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddCommentUseCase = require('../AddCommentUseCase');

describe('AddCommentUseCase', ()=>{
    it('should orchestrating the add comment action correctly', async ()=>{
        const useCasePayload = {
            thread_id: 'thread-123',
            content: '123',
            owner: 'user-123'
        };

        const mockAddedComment = new AddedComment({
            id: 'comment-123',
            content: '123',
            owner: 'user-123',
        });

        const expectedAddedComment = new NewComment({
            thread_id: 'thread-123',
            content: '123',
            owner: 'user-123',
        });

        const mockCommentRepository = new CommentRepository();
        mockCommentRepository.addComment = jest.fn().mockImplementation(()=>Promise.resolve(
            new AddedComment({
                id: 'comment-123',
                content: '123',
                owner: 'user-123',
            })
        ));

        const mockThreadRepository = new ThreadRepository();
        mockThreadRepository.verifyThread = jest.fn().mockImplementation(()=>Promise.resolve());

        const GetCommentUseCase = new AddCommentUseCase({commentRepository:mockCommentRepository, threadRepository: mockThreadRepository});

        const result = await GetCommentUseCase.execute(useCasePayload);
 
        expect(result).toStrictEqual(mockAddedComment);
        expect(mockCommentRepository.addComment).toBeCalledWith(expectedAddedComment);
        expect(mockThreadRepository.verifyThread).toBeCalledWith('thread-123');
    });
})