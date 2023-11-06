import { HttpStatusCode } from "@/common/constant";
import CustomError from "./custom-error";

class ResourceAlreadyExistException extends CustomError {
    constructor(
        readonly message: string = "Resource already exists",
        description?: string
    ) {
        super("ResourceAlreadyExistException", message);
        this.code = HttpStatusCode.Conflict;
        this.status = "Conflict";
        this.description = description ?? message;
    }
}

export default ResourceAlreadyExistException;
