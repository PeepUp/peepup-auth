class BadRequestException extends Error {
    private statusCode: number;

    public constructor(message: string) {
        super(message);
        this.name = "BadRequestException";
        this.statusCode = 400;
    }
}

export default BadRequestException;
