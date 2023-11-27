import { HttpStatusCode } from "@/common/constant";
import CustomError from "./custom-error";

class ForbiddenException extends CustomError {
    public constructor(message: string = "the user action is forbidden", description?: string) {
        super("ForbiddenException", message);
        this.code = HttpStatusCode.Forbidden;
        this.description = description ?? message;
        this.status = "Forbidden";
    }
}

export default ForbiddenException;
