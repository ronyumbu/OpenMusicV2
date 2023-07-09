class SongsHandler {
    constructor(service, validator){
        this._service = service;
        this._validator = validator;
    }

// menambahkan lagu
    async postSongHandler(request, h) {
        const songValidated = this._validator.validateSongPayload(request.payload);
        const songId = await this._service.addSong(songValidated);

        const response = h.response({
            status: 'success',
            data: {
                songId: songId
            },
        }).code(201);
        return response;
    }

// mengembalikan lagu
    async getSongsHandler(request, h) {
        const queryParams = request.query;
        const songs = await this._service.getSongs(queryParams);

        const response = h.response({
            status: 'success',
            data: {
                songs: songs
            },
        });
        return response;
    }

// mengembalikan lagu berdasarkan id
    async getSongByIdHandler(request, h) {
        const {id} = request.params;
        const song = await this._service.getSongById(id);

        const response = h.response({
            status: 'success',
            data: {
                song: song
            },
        });
        return response;
    }

// memperbaharui lagu
    async editSongHandler(request, h) {
        const songValidated = this._validator.validateSongPayload(request.payload);
        const {id} = request.params;
        await this._service.editSongById(id, songValidated);

        const response = h.response({
            status: 'success',
            message: 'Song berhasil diperbarui'
        });
        return response;
    }

// menghapus lagu
    async deleteSongHandler(request, h) {
        const {id} = request.params;
        await this._service.deleteSongById(id);

        const response = h.response({
            status: 'success',
            message: 'Song berhasil dihapus'
        });
        return response;
    }
};

module.exports = SongsHandler;