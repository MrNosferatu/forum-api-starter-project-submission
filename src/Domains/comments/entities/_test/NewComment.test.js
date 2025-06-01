const NewComment = require('../NewComment');

describe('a NewComment entity',()=>{
    it('should throw error when payload did not contain needed property', ()=>{
        const payload = {
            thread_id:'123',
        };

        expect(()=>new NewComment(payload)).toThrowError('NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    });
    
    it('should throw error when payload did not meet data type specification', ()=>{
        const payload = {
            thread_id:'123',
            content: 4689,
            owner: 'user-123'
        };

        expect(()=>new NewComment(payload)).toThrowError('NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create NewComment object correctly', () => {
        const payload = {
            thread_id:'123',
            content: '4689',
            owner: 'user-123'
        };
    
        const newComment = new NewComment(payload);
    
        expect(newComment.thread_id).toEqual(payload.thread_id);
        expect(newComment.content).toEqual(payload.content);
        expect(newComment.owner).toEqual(payload.owner);
    });
});