import { HttpStatusCode } from "@/common/constant";
import CustomError from "./custom-error";

class BadCredentialsException extends CustomError {
    constructor(message: string = "Incorrect credentials provided", description?: string) {
        super("BadCredentialsException", message);
        super.status = "Unauthorized";
        super.code = HttpStatusCode.Unauthorized;
        super.description = description ?? message;
    }
}

export default BadCredentialsException;
