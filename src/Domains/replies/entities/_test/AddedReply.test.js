const AddedReply = require('../AddedReply');

describe('a AddedReply entity',()=>{
    it('should throw error when payload did not contain needed property', ()=>{
        const payload = {
            id:'123',
        };

        expect(()=>new AddedReply(payload)).toThrowError('ADDED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    });
    
    it('should throw error when payload did not meet data type specification', ()=>{
        const payload = {
            id:'reply-123',
            content: 4689,
            owner: 'user-123'
        };

        expect(()=>new AddedReply(payload)).toThrowError('ADDED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create AddedReply object correctly', () => {
        const payload = {
            id:'reply-123',
            content: '4689',
            owner: 'user-123'
        };

        const addedReply = new AddedReply(payload);
    
        expect(addedReply.id).toEqual(payload.id);
        expect(addedReply.content).toEqual(payload.content);
        expect(addedReply.owner).toEqual(payload.owner);
    });
});