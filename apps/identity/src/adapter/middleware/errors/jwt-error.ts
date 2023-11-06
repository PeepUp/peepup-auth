type JWTExceptionDataArgs = {
    message: string;
    name?: string;
    statusCode: number;
    cause: string;
    stack: string;
    rest?: object | null;
};

class JWTException extends Error {
    public constructor(public data: JWTExceptionDataArgs) {
        super(data.message);
        this.name = data.name ?? "JWTException";
    }
}

export default JWTException;
