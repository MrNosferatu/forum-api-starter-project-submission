const pool = require('../src/Infrastructures/database/postgres/pool');

const LikesTableTestHelper = {
    async addLike({id='like-123',owner='user-123',comment_id='comments-123',date=new Date().toISOString()}){
        const query = {
            text: 'INSERT INTO likes VALUES($1,$2,$3,$4)',
            values: [id, comment_id, owner, date],
        }

        await pool.query(query);   
    },
    async findLike(id='like-123'){
        const query = {
            text: 'SELECT * FROM likes WHERE id=$1',
            values: [id],
        }

        const result = await pool.query(query);

        return result.rows[0];
    },
    async cleanTable(){
        await pool.query('DELETE FROM likes WHERE 1=1');
    }
};

module.exports = LikesTableTestHelper;