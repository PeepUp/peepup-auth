class NotNullException extends Error {
    constructor(message: string) {
        super(message);
        this.name = "NotNullException";
    }
}

export default NotNullException;
