import CustomError from "./custom-error";

type JWTExceptionDataArgs = {
    message: string;
    name?: string;
    statusCode: number;
    cause: string;
    stack: string;
    rest?: object | null;
};

class JWTException extends CustomError {
    public constructor(public data: JWTExceptionDataArgs) {
        super("JWTException", data.message);
        this.name = "JWTException";
        this.code = data.statusCode ?? 400;
        this.description = data.cause ?? data.message;
        this.status = "Bad Request";
    }
}

export default JWTException;
