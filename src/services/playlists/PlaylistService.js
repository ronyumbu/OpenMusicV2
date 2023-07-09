const {nanoid} = require('nanoid');
const {Pool} = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');
const {mapDBToPlaylistSong, mapDBToPlalistActivity} = require('../../utils');

class PlaylistService {
    constructor(songService, activityService, collaborationService) {
        this._pool = new Pool();
        this._songService = songService;
        this._activityService = activityService;
        this._collaborationService = collaborationService;
    }

// menambahan playlist
    async addPlaylist({name, owner}) {
        const idPlaylist = `playlist-${nanoid(16)}`;
        const createdAt = new Date().toISOString();
        
        const query = {
            text: 'INSERT INTO playlists VALUES($1, $2, $3, $4, $5) RETURNING id',
            values: [idPlaylist, name, owner, createdAt, createdAt]
        };
        const {rows} = await this._pool.query(query);

        if (!rows[0].id) {
            throw new InvariantError('Playlist tidak dapat ditambahkan');
        }
        return rows[0].id;
    }

// menambahkan playlist lagu
    async addPlaylistSong(playlistId, songId, userId) {
        const songIdfromDatabase = await this._songService.verifySongInDatabase(songId);

        if (!songIdfromDatabase) {
            throw new NotFoundError('Lagu tidak dapat ditemukan');
        }
        const id = `playlist_song-${nanoid(16)}`;
        const createdAt = new Date().toISOString();

        const query = {
            text: 'INSERT INTO playlist_songs VALUES($1, $2, $3, $4, $5) RETURNING id',
            values: [id, playlistId, songId, createdAt, createdAt]
        };
        const {rows} = await this._pool.query(query);

        if (!rows[0].id) {
            throw new InvariantError('Lagu tidak dapat ditambahkan ke playlist');
        }
        await this._activityService.addActivity(playlistId, userId, songId);
    }

// mengembalikan playlist berdasarkan id
    async getPlaylists(id) {
        const query = {
            text: `SELECT playlists.id, playlists.name, users.username FROM playlists 
            LEFT JOIN collaborations on collaborations.playlist_id = playlists.id
            INNER JOIN users on users.id = playlists.owner
            WHERE playlists.owner = $1 OR playlists.id = $1 OR collaborations.user_id = $1`,
            values: [id]
        };
        const {rows} = await this._pool.query(query);

        return rows;
    }

// mengembalikan playlist lagu
    async getPlaylistSong(playlistId) {
        const queryPlaylist = {
            text: `SELECT playlists.id, playlists.name, users.username FROM playlists
            LEFT JOIN users on playlists.owner = users.id
            WHERE playlists.id = $1`,
            values: [playlistId]
        };
        const querySong = {
            text: `SELECT songs.id, songs.title, songs.performer FROM playlist_songs
            JOIN songs on playlist_songs.song_id = songs.id
            WHERE playlist_id = $1`,
            values: [playlistId]
        };
        const resultPlaylist = await this._pool.query(queryPlaylist);
        const resultSongs = await this._pool.query(querySong);

        return mapDBToPlaylistSong(resultPlaylist.rows[0], resultSongs.rows);
    }

// mengembalikan aktifitas
    async getActivity(playlistId) {
        const playlist = await this.getPlaylists(playlistId);
        const query = {
            text: `SELECT users.username, 
            songs.title, 
            playlist_song_activities.action, 
            playlist_song_activities.time  
            FROM playlist_song_activities 
            INNER JOIN users ON users.id = playlist_song_activities.user_id
            INNER JOIN songs on songs.id = playlist_song_activities.song_id
            WHERE playlist_song_activities.playlist_id = $1
            ORDER BY time asc`,
            values: [playlistId]
        };
        const {rows} = await this._pool.query(query);

        return mapDBToPlalistActivity(playlist[0].id, rows);
    }

// melakukan verifikasi terhadap akses playlist
    async verifyPlaylistAccess(playlistId, userId){
        try {
            await this.verifyPlaylistOwner(playlistId, userId);
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }

        try {
            await this._collaborationService.verifyCollaboration(playlistId, userId);
        } catch {
            throw error;
        }
        }
    }

// melakukan verifikasi playlist owner
    async verifyPlaylistOwner(id, owner) {
        const query = {
            text: 'SELECT id, owner FROM playlists WHERE id = $1',
            values: [id]
        };
        const {rows, rowCount} = await this._pool.query(query);

        if (!rowCount) {
            throw new NotFoundError('Playlist tidak dapat ditemukan');
        }
        const playlist = rows[0];
        
        if (playlist.owner !== owner) {
            throw new AuthorizationError('Anda tidak dapat mengakses resource ini');
        }
    }

// menghapus playlist lagu
    async deletePlaylistSong(songId, playlistId, userId) {
        const query = {
            text: 'DELETE FROM playlist_songs WHERE song_id = $1 RETURNING song_id',
            values: [songId]
        };
        const {rowCount} = await this._pool.query(query);

        if (!rowCount) {
            throw new NotFoundError('Lagu gagal dihapus karena Id tidak ditemukan');
        };
        await this._activityService.deleteActivity(playlistId, userId, songId);
    }

// menghapus playlist berdasarkan id
    async deletePlaylistById(id) {
        const query = {
            text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
            values: [id]
        };
        const {rowCount} = await this._pool.query(query);

        if (!rowCount) {
            throw new NotFoundError('Playlist gagal dihapus karena Id tidak dapat ditemukan');
        }
    }
}

module.exports = PlaylistService;
