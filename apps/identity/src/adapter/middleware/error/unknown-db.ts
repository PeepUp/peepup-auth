class UnknownDbError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "UnknownDbError";
    }
}

export default UnknownDbError;
