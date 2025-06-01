const GetReply = require('../GetReply');

describe('a GetReply entity', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      id: 'comment-123',
      username: 'ini komentar',
      date: '4689',
    };

    expect(() => new GetReply(payload)).toThrowError('GET_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    
    const payload = {
      id: 123,
      comment_id: '123',
      username: {},
      date: 2025,
      content: '4689',
      is_deleted: 'false',
    };

    expect(() => new GetReply(payload)).toThrowError('GET_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create GetReply object correctly', () => {
    const payload = {
      id: 'reply-123',
      comment_id: 'comment-123',
      username: '123',
      date: new Date('2025-04-18T00:00:00Z'),
      content: '4689',
      is_deleted: false
    };

    const getReply = new GetReply(payload);

    expect(getReply.id).toEqual(payload.id);
    expect(getReply.comment_id).toEqual(payload.comment_id);
    expect(getReply.username).toEqual(payload.username);
    expect(getReply.date).toEqual(payload.date);
    expect(getReply.content).toEqual(payload.content);
    expect(getReply.is_deleted).toEqual(payload.is_deleted);
  });
});