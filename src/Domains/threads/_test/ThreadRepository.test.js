const ThreadRepository = require('../ThreadRepository');

describe('ThreadRepository Interface', ()=>{
    it('should throw error when invoke abstract behaviour', async ()=>{
        const threadRepository = new ThreadRepository();

        await expect(threadRepository.addThread({})).rejects.toThrowError('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
        await expect(threadRepository.verifyThread('')).rejects.toThrowError('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
        await expect(threadRepository.findThread('')).rejects.toThrowError('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    });
});
