import { HttpStatusCode } from "@/common/constant";
import CustomError from "./custom-error";

class UnauthorizedException extends CustomError {
    public constructor(message: string, description?: string) {
        super("UnauthorizedException", message);
        this.status = "Unauthorized";
        this.name = "UnauthorizedException";
        this.code = HttpStatusCode.Unauthorized;
        this.description = description ?? message;
    }
}

export default UnauthorizedException;
