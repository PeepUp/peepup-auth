import { HttpStatusCode } from "@/common/constant";

class ForbiddenException extends Error {
    private status: HttpStatusCode;

    private statusCodeText: string;

    public constructor(message: string = "the user action is forbidden") {
        super(message);
        this.name = "ForbiddenException";
        this.status = 403;
        this.statusCodeText = "Forbidden";
    }

    public getCode(): number {
        return this.status;
    }

    public getCodeText(): string {
        return this.statusCodeText;
    }
}

export default ForbiddenException;
