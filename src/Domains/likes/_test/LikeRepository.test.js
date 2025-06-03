const LikeRepository = require('../LikeRepository');

describe('LikeRepository Interface', ()=>{
    it('should throw error when invoke abstract behaviour',async ()=>{
        const likeRepository = new LikeRepository();

        await expect(likeRepository.getLike('','')).rejects.toThrowError('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
        await expect(likeRepository.addLike({})).rejects.toThrowError('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
        await expect(likeRepository.deleteLike('','')).rejects.toThrowError('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
        await expect(likeRepository.getLikeCount('')).rejects.toThrowError('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    });
});