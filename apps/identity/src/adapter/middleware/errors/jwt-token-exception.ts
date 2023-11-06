class JwtTokenException extends Error {
    private statusCode: number;

    public constructor(message: string) {
        super(message);
        this.name = "JwtTokenException";
        this.statusCode = 403;
    }
}

export default JwtTokenException;
