class NewLike{
    constructor(payload){
        this._validatePayload(payload);

        this.thread_id = payload.thread_id;
        this.comment_id = payload.comment_id;
        this.owner = payload.owner;
    }

    _validatePayload({comment_id, owner, thread_id}){
        if(!comment_id || !owner || !thread_id){
            throw new Error('NEW_LIKE.NOT_CONTAIN_NEEDED_PROPERTY');
        }

        if(typeof comment_id != 'string' || typeof owner != 'string' || typeof thread_id != 'string' ){
            throw new Error('NEW_LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
    }
}

module.exports = NewLike;