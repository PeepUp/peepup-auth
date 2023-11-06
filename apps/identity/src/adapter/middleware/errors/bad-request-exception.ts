import { HttpStatusCode } from "@/common/constant";
import CustomError from "@/adapter/middleware/errors/custom-error";

class BadRequestException extends CustomError {
    public constructor(message: string = "Bad Request", description?: string) {
        super("BadRequestException", message);
        super.status = "Bad Request";
        super.code = HttpStatusCode.BadRequest;
        super.description = description ?? message;
    }
}

export default BadRequestException;
