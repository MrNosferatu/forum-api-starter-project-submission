const CommentRepository = require('../../../Domains/comments/CommentRepository');
const GetComment = require('../../../Domains/comments/entities/GetComment');
const GetReply = require('../../../Domains/replies/entities/GetReply');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const GetThread = require('../../../Domains/threads/entities/GetThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const GetThreadDetailUseCase = require('../GetThreadDetailUseCase');
const LikeRepository = require('../../../Domains/likes/LikeRepository');

describe('GetThreadDetailUseCase', ()=>{
    it('should orchestrating the get thread detail action correctly', async ()=>{
        const useCasePayload = {
            thread_id: 'thread-123'
        };

        const mockThreadRepository = new ThreadRepository();
        mockThreadRepository.verifyThread = jest.fn().mockImplementation(()=>Promise.resolve());
        mockThreadRepository.findThread = jest.fn().mockImplementation(()=>{
            return new GetThread({
                id: 'thread-123',
                title: 'thread 123',
                body: 'infonya thread 123',
                date: new Date('2025-04-18T00:00:00Z'),
                username: 'budi',
                comments: []
            }); 
        });

        const mockCommentRepository = new CommentRepository();
        mockCommentRepository.getThreadComments = jest.fn().mockImplementation(()=>{
            return [new GetComment({
                id: 'comment-123',
                thread_id: 'thread-123',
                content: 'ini komentar',
                username: 'asep',
                date: new Date('2025-04-18T00:00:00Z'),
                is_deleted: true
            }),new GetComment({
                id: 'comment-158',
                thread_id: 'thread-123',
                content: 'sok asik',
                username: 'ahmad',
                date: new Date('2025-04-18T00:00:00Z'),
                is_deleted: false
            })];
        });

        const mockReplyRepository = new ReplyRepository();
        mockReplyRepository.getThreadReplies = jest.fn().mockImplementation(()=>{
            return [new GetReply({
                id: 'reply-123',
                comment_id: 'comment-158',
                content: 'oke siap',
                username: 'asep',
                date: new Date('2025-04-18T00:00:00Z'),
                is_deleted: true
            }),new GetReply({
                id: 'reply-693',
                comment_id: 'comment-158',
                content: 'terima kasih feedbacknya',
                username: 'asep2',
                date: new Date('2025-04-18T00:00:00Z'),
                is_deleted: false
            })];
        });

        const mockLikeRepository = new LikeRepository();
        mockLikeRepository.getLikeCount = jest.fn().mockImplementation(() => {
            return [{
                comment_id: 'comment-123',
            }, {
                comment_id: 'comment-123',
            }];
        });

        const getThreadDetailUseCase = new GetThreadDetailUseCase({threadRepository:mockThreadRepository, commentRepository: mockCommentRepository, replyRepository: mockReplyRepository, likeRepository: mockLikeRepository});

        const result = await getThreadDetailUseCase.execute(useCasePayload);

        expect(result).toEqual(new GetThread({
            id: 'thread-123',
            title: 'thread 123',
            body: 'infonya thread 123',
            date: new Date('2025-04-18T00:00:00Z'),
            username: 'budi',
            comments: [{
                id: 'comment-123',
                username: 'asep',
                date: new Date('2025-04-18T00:00:00Z'),
                content: '**komentar telah dihapus**',
                likeCount: 2,
                replies: [],
            }, {
                id: 'comment-158',
                username: 'ahmad',
                date: new Date('2025-04-18T00:00:00Z'),
                content: 'sok asik',
                likeCount: 0,
                replies: [{
                    id: 'reply-123',
                    username: 'asep',
                    date: new Date('2025-04-18T00:00:00Z'),
                    content: '**balasan telah dihapus**',
                }, {
                    id: 'reply-693',
                    username: 'asep2',
                    date: new Date('2025-04-18T00:00:00Z'),
                    content: 'terima kasih feedbacknya',
                }]
            }]
        }));

        expect(mockThreadRepository.verifyThread).toBeCalledWith(useCasePayload.thread_id);
        expect(mockThreadRepository.findThread).toBeCalledWith(useCasePayload.thread_id);
        expect(mockCommentRepository.getThreadComments).toBeCalledWith(useCasePayload.thread_id);
        expect(mockReplyRepository.getThreadReplies).toBeCalledWith(useCasePayload.thread_id);
    });
});