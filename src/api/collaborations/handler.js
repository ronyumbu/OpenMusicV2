class CollaborationHandler {
    constructor(collaborationService, playlistService, validator) {
        this._collaborationService = collaborationService;
        this._playlistService = playlistService;
        this._validator = validator;
    }

// menambahkan kolaborasi
    async postCollaborationHandler(request, h) {
        const collaborationValidated = this._validator.validateCollaborationPayload(request.payload);  
        const {id: credentialId} = request.auth.credentials;
        await this._playlistService.verifyPlaylistOwner(collaborationValidated.playlistId, credentialId);
        const collaborationId = await this._collaborationService.addCollaboration(collaborationValidated);

        const response = h.response({
            status: 'success',
            message: 'Collaborations berhasil ditambahkan',
            data: {
                collaborationId
            },
        }).code(201);
        return response;
    }

// menghapus kolaborasi
    async deleteCollaborationHandler(request, h) {
        const collaborationValidated = this._validator.validateCollaborationPayload(request.payload);
        const {id: credentialId} = request.auth.credentials;
        await this._playlistService.verifyPlaylistOwner(collaborationValidated.playlistId, credentialId);
        await this._collaborationService.deleteCollaboration(collaborationValidated);

        const response = h.response({
            status: 'success',
            message: 'Collaborations berhasil dihapus'
        }).code(200);
        return response;
    }
}

module.exports = CollaborationHandler;