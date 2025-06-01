exports.up = pgm => {
    pgm.createTable('replies',{
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        comment_id: {
            type: 'VARCHAR(50)',
            notNull: true,
        },
        content: {
            type: 'VARCHAR(50)',
            notNull: true,
        },
        is_deleted: {
            type: 'BOOLEAN',
            notNull: true,
            default: pgm.func('FALSE')
        },
        date: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
        owner: {
            type: 'VARCHAR(50)',
            notNull: true,
        },
    });

    pgm.addConstraint(
        'replies',
        'fk_replies.owner.id',
        'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE');

    pgm.addConstraint(
        'replies',
        'fk_replies.comments.id',
        'FOREIGN KEY(comment_id) REFERENCES comments(id) ON DELETE CASCADE');
};

exports.down = pgm => {
    pgm.dropTable('replies');
};