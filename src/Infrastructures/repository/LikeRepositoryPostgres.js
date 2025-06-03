const LikeRepository = require("../../Domains/likes/LikeRepository");

class LikeRepositoryPostgres extends LikeRepository{
    constructor(pool, idGenerator){
        super();
        this._pool = pool;
        this._idGenerator = idGenerator;
    }

    async getLike(comment_id, user_id){
        const query = {
            text: 'SELECT id FROM likes WHERE comment_id=$1 AND owner=$2',
            values:[comment_id, user_id]
        };

        const { rowCount } = await this._pool.query(query);

        return rowCount;
    }

    async addLike(newLike){
        const {comment_id, owner} = newLike;
        const id = `like-${this._idGenerator()}`
        const date = new Date().toISOString();

        const query = {
            text: 'INSERT INTO likes VALUES($1, $2, $3, $4) RETURNING id',
            values: [id, comment_id, owner, date]
        }

        await this._pool.query(query);
    }

    async deleteLike(comment_id, user_id){
        const query = {
            text: 'DELETE FROM likes WHERE comment_id=$1 AND owner=$2',
            values:[comment_id, user_id]
        };

        await this._pool.query(query);
    }

    async getLikeCount(thread_id){
        const query = {
            text: 'SELECT comment_id FROM likes WHERE comment_id IN (SELECT id FROM comments WHERE thread_id = $1)',
            values:[thread_id]
        };

        const { rows } = await this._pool.query(query);

        return rows;
    }
}

module.exports = LikeRepositoryPostgres;