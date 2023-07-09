/* eslint-disable camelcase */

exports.up = (pgm) => {
    pgm.createTable('playlist_songs', {
        id: {
            type: 'varchar(50)',
            primaryKey: true,
        },
        playlist_id: {
            type: 'varchar(50)',
            references: '"playlists"',
            onDelete: 'cascade',
            onUpdate: 'cascade',
        },
        song_id: {
            type: 'varchar(50)',
            references: '"songs"',
            onDelete: 'cascade',
            onUpdate: 'cascade',
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
    pgm.dropTable('playlist_songs');
};