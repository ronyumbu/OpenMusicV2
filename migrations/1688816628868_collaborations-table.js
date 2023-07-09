/* eslint-disable camelcase */

exports.up = (pgm) => {
    pgm.createTable('collaborations', {
        id: {
            type: 'varchar(50)',
            primaryKey: true,
        },
        playlist_id: {
            type: 'varchar(50)',
            references: '"playlists"',
            onDelete: 'cascade',
            onUpdate: 'cascade',
            unique: true,
        },
        user_id: {
            type: 'varchar(50)',
            references: '"users"',
            onDelete: 'cascade',
            onUpdate: 'cascade',
            unique: true,
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
    pgm.dropTable('collaborations');
};