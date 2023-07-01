class ResourceAlreadyExistException extends Error {
    private statusCode: number;

    constructor(message: string) {
        super(message);
        this.name = "ResourceAlreadyExistException";
        this.statusCode = 409;
    }
}

export default ResourceAlreadyExistException;
