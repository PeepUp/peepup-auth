import { HttpStatusCode } from "@/common/constant";
import CustomError from "./custom-error";

class UnprocessableContentException extends CustomError {
    public constructor(message: string = "the user action is forbidden", description?: string) {
        super("UnprocessableContentException", message);
        this.code = HttpStatusCode.UnprocessableEntity;
        this.description = description ?? message;
        this.status = "Unprocessable Entity";
    }
}

export default UnprocessableContentException;
