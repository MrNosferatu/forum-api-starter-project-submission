exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable('likes', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        comment_id: {
            type: 'VARCHAR(50)',
            notNull: true,
        },
        owner: {
            type: 'VARCHAR(50)',
            notNull: true,
        },
        date: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
    });

    pgm.addConstraint(
        'likes',
        'fk_likes.owner.id',
        'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE');

    pgm.addConstraint(
        'likes',
        'fk_likes.comments.id',
        'FOREIGN KEY(comment_id) REFERENCES comments(id) ON DELETE CASCADE');
};

exports.down = pgm => {
    pgm.dropTable('likes');
};