/* eslint-disable camelcase */

exports.up = (pgm) => {
    pgm.createTable('users', {
        id: {
            type: 'varchar(50)',
            primaryKey: true,
        },
        username: {
            type: 'varchar(25)',
            notNull: true,
        },
        fullname: {
            type: 'varchar(50)',
            notNull: true,
        },
        password: {
            type: 'text',
            notNull: true,
        },
        created_at: {
            type: 'text',
            notNull: true,
        },
        updated_at: {
            type: 'text',
            notNull: true,
        },
    });
};

exports.down = (pgm) => {
    pgm.dropTable('users');
};