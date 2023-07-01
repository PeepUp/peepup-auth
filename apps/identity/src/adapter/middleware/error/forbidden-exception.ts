class ForbiddenException extends Error {
    private statusCode: number;

    public constructor(message: string) {
        super(message);
        this.name = "ForbiddenException";
        this.statusCode = 403;
    }
}

export default ForbiddenException;
