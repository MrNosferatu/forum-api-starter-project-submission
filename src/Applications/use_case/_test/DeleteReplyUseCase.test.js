const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const DeleteReplyUseCase = require('../DeleteReplyUseCase');

describe('DeleteReplyUseCase', ()=>{
    it('should orchestrating the delete reply action correctly', async ()=>{
        const useCasePayload = {
            reply_id: 'reply-123',
            thread_id: 'thread-123',
            owner: 'user-4689',
            comment_id: 'comment-123'
        }

        const mockReplyRepository = new ReplyRepository();

        mockReplyRepository.verifyReplyOwner = jest.fn().mockImplementation(()=> Promise.resolve());
        mockReplyRepository.verifyReplyStatus = jest.fn().mockImplementation(()=> Promise.resolve());
        mockReplyRepository.softDeleteReply = jest.fn().mockImplementation(()=> Promise.resolve());

        const deleteReplyUseCase = new DeleteReplyUseCase({replyRepository: mockReplyRepository});

        await deleteReplyUseCase.execute(useCasePayload);

        expect(mockReplyRepository.verifyReplyStatus).toBeCalledWith(useCasePayload.reply_id, useCasePayload.comment_id, useCasePayload.thread_id);
        expect(mockReplyRepository.verifyReplyOwner).toBeCalledWith(useCasePayload.reply_id, useCasePayload.owner);
        expect(mockReplyRepository.softDeleteReply).toBeCalledWith(useCasePayload.reply_id);
    });
});