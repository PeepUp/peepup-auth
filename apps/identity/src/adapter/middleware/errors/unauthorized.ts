import { HttpStatusCode } from "@/common/constant";

class UnauthorizedException extends Error {
    private status: HttpStatusCode;

    private statusCodeText: string;

    public constructor(message: string) {
        super(message);
        this.name = "UnauthorizedException";
        this.status = HttpStatusCode.Unauthorized;
        this.statusCodeText = "Unauthorized";
    }

    public getCode(): number {
        return this.status;
    }

    public getCodeText(): string {
        return this.statusCodeText;
    }
}

export default UnauthorizedException;
