class ForeignKeyViolationException extends Error {
    constructor(message: string) {
        super(message);
        this.name = "ForeignKeyViolationException";
    }
}

export default ForeignKeyViolationException;
