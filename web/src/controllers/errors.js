class CustomError extends Error {
    constructor(message) {
        super("default message");
        this.name = this.constructor.name;

        Error.captureStackTrace(this, this.constructor);
    }
}

class GameAlreadyExistsError extends CustomError {
    constructor() {
        super(`The Game already exists`);
    }
}

class ListDoesNotExistError extends CustomError {
    constructor() {
        super(`Please create a games list first`);
    }
}

class ListAlreadyExistsError extends CustomError {
    constructor() {
        super(`List already exists`);
    }
}

class GenericError extends CustomError {
    constructor() {
        super(`Something went wrong`);
    }
}

class RegistrationError extends CustomError {
    constructor() {
        super(`Could not save user`);
    }
}

module.exports = {
    GameAlreadyExistsError,
    ListDoesNotExistError,
    ListAlreadyExistsError,
    RegistrationError,
    GenericError
}