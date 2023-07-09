class PlaylistsHandler {
    constructor(service, validator) {
        this._service = service;
        this._validator = validator;
    }

// menambahkan playlist
    async postPlaylistHandler(request, h) {
        const playlistValidated = this._validator.validatePlaylistPayload(request.payload);
        const {id: credentialId} = request.auth.credentials;
        Object.assign(playlistValidated, {owner: credentialId});
        const playlistId = await this._service.addPlaylist(playlistValidated);

        const response = h.response({
            status: 'success',
            message: 'Playlist berhasil ditambahkan',
            data: {
                playlistId
            },
        }).code(201);
        return response;
    }

// mengembalikan playlist lagu
    async getPlaylistSongHandler(request, h) {
        const {id: credentialId} = request.auth.credentials;
        const playlistId = request.params;
        await this._service.verifyPlaylistAccess(playlistId.id, credentialId);
        const result = await this._service.getPlaylistSong(playlistId.id);

        const response = h.response({
            status: 'success',
            data: result
        }).code(200);
        return response;
    }

// mengembalikan aktifitas dari sebuah playlist
    async getPlaylistActivityHandler(request, h) {
        const {id: credentialId} = request.auth.credentials;
        const playlistId = request.params;
        await this._service.verifyPlaylistAccess(playlistId.id, credentialId);
        const activities = await this._service.getActivity(playlistId.id);

        const response = h.response({
            status: 'success',
            data: activities
        }).code(200);
        return response;
    }

// menghapus playlist
    async deletePlaylistSongHandler(request, h) {
        const songIdValidated = this._validator.validatePlaylistSongPayload(request.payload);
        const {id: credentialId} = request.auth.credentials;
        const playlistId = request.params;
        await this._service.verifyPlaylistAccess(playlistId.id, credentialId);
        await this._service.deletePlaylistSong(songIdValidated.songId, playlistId.id, credentialId);

        const response = h.response({
            status: 'success',
            message: 'Lagu berhasil dihapus dari playlist'
        }).code(200);
        return response;
    }

// menambahkan lagu ke dalam playlist
    async postPlaylistSongHandler(request, h) {
        const songIdValidated = this._validator.validatePlaylistSongPayload(request.payload);
        const {id: credentialId} = request.auth.credentials;
        const playlistId = request.params;
        await this._service.verifyPlaylistAccess(playlistId.id, credentialId);
        await this._service.addPlaylistSong(playlistId.id, songIdValidated.songId, credentialId);

        const response = h.response({
            status: 'success',
            message: 'Lagu berhasil ditambahkan ke playlist'
        }).code(201);
        return response;
    }

// mengembalikan playlist
    async getplaylistHandler(request, h) {
        const {id: credentialId} = request.auth.credentials;
        const playlists = await this._service.getPlaylists(credentialId);

        const response = h.response({
            status: 'success',
            data: {
                playlists
            },
        });
        return response;
    }

// menghapus playlist
    async deletePlaylistByIdHandler(request, h) {
        const {id} = request.params;
        const {id: credentialId} = request.auth.credentials;
        await this._service.verifyPlaylistOwner(id, credentialId);
        await this._service.deletePlaylistById(id);

        const response = h.response({
            status: 'success',
            message: 'Playlist berhasil dihapus'
        }).code(200);
        return response;
    }
}

module.exports = PlaylistsHandler;