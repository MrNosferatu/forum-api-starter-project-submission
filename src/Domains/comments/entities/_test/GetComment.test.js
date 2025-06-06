const GetComment = require('../GetComment');

describe('a GetComment entity', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      id: 'comment-123',
      username: 'ini komentar',
      date: '4689',
    };

    expect(() => new GetComment(payload)).toThrowError('GET_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      id: 123,
      username: {},
      date: 2025,
      content: '4689',
      is_deleted: 'false',
    };

    expect(() => new GetComment(payload)).toThrowError('GET_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create GetComment object correctly', () => {
    const payload = {
      id: 'comment-123',
      username: '123',
      date: new Date('2025-04-18T00:00:00Z'),
      content: '4689',
      is_deleted: false
    };

    const getComment = new GetComment(payload);

    expect(getComment.id).toEqual(payload.id);
    expect(getComment.username).toEqual(payload.username);
    expect(getComment.date).toEqual(payload.date);
    expect(getComment.content).toEqual(payload.content);
    expect(getComment.is_deleted).toEqual(payload.is_deleted);
  });
});