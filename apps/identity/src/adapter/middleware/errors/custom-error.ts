import { HttpStatusCode } from "@/common/constant";

class CustomError extends Error {
    constructor(
        public name: string,
        message: string,
        public description?: string,
        public code?: HttpStatusCode,
        public status?: string
    ) {
        super(message);
    }

    serialize(): { message: string; field?: string }[] {
        return [{ message: this.message }];
    }

    parse(): { message: string; field?: string }[] {
        return [{ message: this.message }];
    }

    getCode(): HttpStatusCode | number {
        return this.code as HttpStatusCode | number;
    }

    print(): void {
        console.log(this.serialize());
    }

    stringify(): string {
        return JSON.stringify(this.serialize());
    }
}

export default CustomError;
