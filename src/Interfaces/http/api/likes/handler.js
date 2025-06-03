const PutLikeUseCase = require("../../../../Applications/use_case/PutLikeUseCase");

class LikesHandler{
    constructor(container){
        this._container = container;

        this.putCommentLikeHandler = this.putCommentLikeHandler.bind(this);
    }

    async putCommentLikeHandler({params, auth}, h){ 
        
        const useCasePayload = {
            thread_id: params.thread_id,
            comment_id: params.comment_id,
            owner: auth.credentials.id
        };
        
        const putLikeUseCase = this._container.getInstance(PutLikeUseCase.name);
        await putLikeUseCase.execute(useCasePayload);
        
        const response = h.response({
            status: 'success',
        });
        
        response.code(200)
        return response;
    }
}

module.exports = LikesHandler;