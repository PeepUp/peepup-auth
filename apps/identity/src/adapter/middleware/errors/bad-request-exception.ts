import { HttpStatusCode } from "@/common/constant";
import CustomError from "@/adapter/middleware/errors/custom-error";

class BadRequestException extends CustomError {
    public constructor(message: string = "Bad Request", description?: string) {
        super("BadRequestException", message);
        this.status = "Bad Request";
        this.code = HttpStatusCode.BadRequest;
        this.description = description ?? message;
    }
}

export default BadRequestException;
