class BadCredentialsException extends Error {
    private statusCode: number;

    constructor(
        message:
            | string
            | null = "Please cross check again! username, email or password are incorrect!"
    ) {
        super(message as string);
        this.name = "BadCredentialsException";
        this.statusCode = 401;
    }
}

export default BadCredentialsException;
