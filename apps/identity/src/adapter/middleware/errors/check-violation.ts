class CheckViolationException extends Error {
    constructor(message: string) {
        super(message);
        this.name = "CheckViolationException";
    }
}

export default CheckViolationException;
