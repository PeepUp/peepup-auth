class BadCredentialsException extends Error {
    private statusCode: number;

    constructor(message: string) {
        super(message);
        this.name = "BadCredentialsException";
        this.statusCode = 401;
    }
}

export default BadCredentialsException;
