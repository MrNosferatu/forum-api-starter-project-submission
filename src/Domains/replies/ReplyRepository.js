class ReplyRepository{
    async addReply(){
        throw new Error('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }

    async softDeleteReply(){
        throw new Error('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }

    async verifyReplyOwner(){
        throw new Error('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }

    async verifyReplyStatus(){
        throw new Error('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }

    async getThreadReplies(){
        throw new Error('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }
}

module.exports = ReplyRepository;