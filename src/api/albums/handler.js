const {mapDBToAlbumSongService} = require('../../utils/index');

class AlbumsHandler {
    constructor(service, validator){
        this._service = service;
        this._validator = validator;
    }

// menambahkan album
    async postAlbumHandler(request, h) {
        const albumValidated = this._validator.validateAlbumPayload(request.payload);
        const albumId = await this._service.addAlbum(albumValidated);
        const response = h.response({
            status: 'success',
            data: {
                albumId: albumId,
            },
        }).code(201);
        return response;
    }

// mengembalikan album berdasarkan id
    async getAlbumByIdHandler(request, h) {
        const {id} = request.params;
        const album = await this._service.getAlbumById(id);
        const resultMappingAlbum = mapDBToAlbumSongService(album.album, album.songs);
        const response = h.response({
            status: 'success',
            data: {
                album: resultMappingAlbum,
            },
        });
        return response;
    }

// memperbaharui album
    async editAlbumHandler(request, h) {
        const albumValidated = this._validator.validateAlbumPayload(request.payload);
        const {id} = request.params;
        await this._service.editAlbumById(id, albumValidated);
        const response = h.response({
            status: 'success',
            message: 'Album berhasil diperbarui',
        });
        return response;
    }

// menghapus album
    async deleteAlbumHandler(request, h) {
        const {id} = request.params;
        await this._service.deleteAlbumById(id);
        const response = h.response({
            status: 'success',
            message: 'Album berhasil dihapus',
        });
        return response;
    }
};

module.exports = AlbumsHandler;