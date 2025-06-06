exports.up = (pgm) => {
    pgm.createTable('threads', {
        id: {
        type: 'VARCHAR(50)',
        primaryKey: true,
        },
        title: {
        type: 'TEXT',
        notNull: true,
        },
        body: {
        type: 'TEXT',
        notNull: true,
        },
        date: {
        type: 'TIMESTAMP',
        notNull: true,
        default: pgm.func('current_timestamp'),
        },
        owner: {
        type: 'VARCHAR(50)',
        notNull: true,
        },
    });

    pgm.addConstraint('threads', 'fk_threads.owner.id', {
        foreignKeys: {
            columns: 'owner',
            references: 'users(id)',
            onDelete: 'cascade',
        },
    });
};

exports.down = (pgm) => {
    pgm.dropConstraint('threads', 'fk_threads.owner.id');
    pgm.dropTable('threads');
};
