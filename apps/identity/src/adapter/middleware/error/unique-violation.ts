class UniqueViolationException extends Error {
    constructor(message: string) {
        super(message);
        this.name = "UniqueViolationException";
    }
}

export default UniqueViolationException;