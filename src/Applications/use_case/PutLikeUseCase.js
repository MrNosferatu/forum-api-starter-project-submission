const NewLike = require("../../Domains/likes/entities/NewLike");

class PutLikeUseCase{
    constructor({likeRepository, commentRepository, threadRepository}){
        this._likeRepository = likeRepository;
        this._commentRepository = commentRepository;
        this._threadRepository = threadRepository;
    }

    async execute(useCasePayload){
        const newLike = new NewLike(useCasePayload);

        await this._threadRepository.verifyThread(useCasePayload.thread_id);
        await this._commentRepository.verifyCommentThread(useCasePayload.comment_id, useCasePayload.thread_id);

        const status = await this._likeRepository.getLike(useCasePayload.comment_id, useCasePayload.owner);

        if(status > 0){
            await this._likeRepository.deleteLike(useCasePayload.comment_id, useCasePayload.owner);
        } else{
            await this._likeRepository.addLike(newLike);
        }

    }
}

module.exports = PutLikeUseCase;