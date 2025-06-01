const GetThread = require('../GetThread');

describe('an GetThread Entity', ()=>{
    it('should throw error when payload did not contain needed property', () => {
        const payload = {
            id :'123',
            title : '123', 
            body :'123',
        };

        expect(()=>new GetThread(payload)).toThrowError('GET_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload did not meet data type specification',()=>{
        const payload = {
            id :'123',
            title : 123, 
            body :'123',
            date: '4689',
            username: 123,
            comments: [{id:123}],
        };

        expect(()=>new GetThread(payload)).toThrowError('GET_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create GetThread object correctly', () => {
        const payload = {
            id :'123',
            title : '123', 
            body :'123',
            date: new Date('2025-04-18T00:00:00Z'),
            username: '123',
            comments: [{id:123}],
        };
    
        const getThread = new GetThread(payload);
    
        expect(getThread.id).toEqual(payload.id);
        expect(getThread.title).toEqual(payload.title);
        expect(getThread.body).toEqual(payload.body);
        expect(getThread.date).toEqual(payload.date);
        expect(getThread.username).toEqual(payload.username);
        expect(getThread.comments).toEqual(payload.comments);
      });
});