// eslint-disable-next-line max-classes-per-file
export class HttpException extends Error {
    public status: number;

    public message: string;

    constructor(status: number, message: string) {
        super(message);
        this.status = status;
        this.message = message;
    }
}

export class UserExistsException extends HttpException {
    constructor(email: string) {
        super(400, `User with email ${email} already exists`);
    }
}

export class MissingParametersException extends HttpException {
    constructor(message: string) {
        super(400, message);
    }
}
