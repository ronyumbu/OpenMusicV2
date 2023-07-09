class UsersHandler {
    constructor(service, validator) {
        this._service = service;
        this._validator = validator;
    }

// menambahkan user
    async postUserHandler(request, h) {
        const userValidated = await this._validator.validateUserPayload(request.payload);
        const userId = await this._service.addUser(userValidated);

        const response = h.response({
            status: 'success',
            data: {
                userId: userId
            },
        }).code(201);
        return response;
    }
}

module.exports = UsersHandler;