import { HttpStatusCode } from "@/common/constant";

class ResourceAlreadyExistException extends Error {
    private status: HttpStatusCode;

    private statusCodeText: string;

    constructor(readonly message: string = "Resource already exists") {
        super(message);
        this.name = "ResourceAlreadyExistException";
        this.status = HttpStatusCode.Conflict;
        this.statusCodeText = "Conflict";
    }

    public getCode(): HttpStatusCode {
        return this.status;
    }

    public getCodeText(): string {
        return this.statusCodeText;
    }
}

export default ResourceAlreadyExistException;
