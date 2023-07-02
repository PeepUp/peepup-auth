class UnauthorizedException extends Error {
    private statusCode: number;

    public constructor(message: string) {
        super(message);
        this.name = "UnauthorizedException";
        this.statusCode = 401;
    }
}

export default UnauthorizedException;
