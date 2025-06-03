const NewLike = require('../NewLike');

describe('a NewLike entity',()=>{
    it('should throw error when payload did not contain needed property', ()=>{
        const payload = {
            comment_id:'123',
        };

        expect(()=>new NewLike(payload)).toThrowError('NEW_LIKE.NOT_CONTAIN_NEEDED_PROPERTY');
    });
    
    it('should throw error when payload did not meet data type specification', ()=>{
        const payload = {
            thread_id: 'thread-123',
            comment_id:8989,
            owner: 'user-123'
        };

        expect(()=>new NewLike(payload)).toThrowError('NEW_LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create NewLike object correctly', () => {
        const payload = {
            comment_id:'123',
            owner: 'user-123',
            thread_id: '123'
        };
    
        const newLike = new NewLike(payload);
        expect(newLike.thread_id).toEqual(payload.thread_id);
        expect(newLike.comment_id).toEqual(payload.comment_id);
        expect(newLike.owner).toEqual(payload.owner);
    });
});