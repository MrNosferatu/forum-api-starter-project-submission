const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const NewThread = require('../../../Domains/threads/entities/NewThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddThreadUseCase = require('../AddThreadUseCase');

describe('AddThreadUseCase', ()=>{
    it('should orchestrating the add thread action correctly', async ()=>{
        const useCasePayload = {
            title: '123',
            body: '123',
            owner: 'user-123'
        };

        const expectedAddedThread = new NewThread({
            title: '123',
            body: '123',
            owner: 'user-123',
        });

        const mockAddedThread = new AddedThread({
            id: 'thread-123',
            title: '123',
            owner: 'user-123',
        });

        const mockThreadRepository = new ThreadRepository();
        mockThreadRepository.addThread = jest.fn().mockImplementation(()=>Promise.resolve(
            new AddedThread({
                id: 'thread-123',
                title: '123',
                owner: 'user-123',
            })
        ));
        
        const GetThreadUseCase = new AddThreadUseCase({threadRepository:mockThreadRepository});

        const result = await GetThreadUseCase.execute(useCasePayload);

        expect(result).toStrictEqual(mockAddedThread);
        expect(mockThreadRepository.addThread).toBeCalledWith(expectedAddedThread);
    });
});