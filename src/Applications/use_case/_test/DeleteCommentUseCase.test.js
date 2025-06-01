const CommentRepository = require('../../../Domains/comments/CommentRepository');
const DeleteCommentUseCase = require('../DeleteCommentUseCase');

describe('DeleteCommentUseCase', ()=>{
    it('should orchestrating the delete comment action correctly', async ()=>{
        const useCasePayload = {
            thread_id: 'thread-123',
            owner: 'user-4689',
            comment_id: 'comment-123'
        }

        const mockCommentRepository = new CommentRepository();

        mockCommentRepository.verifyCommentOwner = jest.fn().mockImplementation(()=> Promise.resolve());
        mockCommentRepository.verifyCommentThread = jest.fn().mockImplementation(()=> Promise.resolve());
        mockCommentRepository.softDeleteComment = jest.fn().mockImplementation(()=> Promise.resolve());

        const deleteCommentUseCase = new DeleteCommentUseCase({commentRepository: mockCommentRepository});

        await deleteCommentUseCase.execute(useCasePayload);

        expect(mockCommentRepository.verifyCommentThread).toBeCalledWith(useCasePayload.comment_id, useCasePayload.thread_id);
        expect(mockCommentRepository.verifyCommentOwner).toBeCalledWith(useCasePayload.comment_id, useCasePayload.owner);
        expect(mockCommentRepository.softDeleteComment).toBeCalledWith(useCasePayload.comment_id);
    });
});