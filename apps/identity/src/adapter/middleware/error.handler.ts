import type {
    FastifyError,
    FastifyInstance,
    FastifyReply,
    FastifyRequest,
} from "fastify";
import { ResourceAlreadyExistException } from "./error/common";

export async function errorHandler(
    this: FastifyInstance,
    error: FastifyError,
    _request: FastifyRequest,
    reply: FastifyReply
) {
    console.log("FUCK THIS SHIT");

    if (error.statusCode === 409 && error.name === "ResourceAlreadyExistException") {
        return reply.code(error.statusCode).send({
            status: "failed",
            code: error.statusCode,
            codeStatus: "Conflict",
            message: error.message,
        });
    }

    if (error.statusCode === 401 && error.name === "BadCredentialsException") {
        return reply.code(error.statusCode).send({
            status: "failed",
            code: error.statusCode,
            codeStatus: "Bad Credential",
            message: error.message,
        });
    }

    if (error.validation) {
        console.log("ERROR FROM VALIDATION!");
        return reply.code(400).send({
            ok: false,
            code: error.statusCode,
            codeStatus: "Bad Request",
            errors: {
                context: error.validationContext,
                message: error.message,
            },
        });
    }

    if (error instanceof ResourceAlreadyExistException) {
        return reply.code(409).send({
            ok: false,
            code: 409,
            codeStatus: "Conflict",
        });
    }

    if (error instanceof Error) {
        console.dir(error, { depth: 10 });

        return reply.code(500).send({
            code: 500,
            message: "Internal Server Error",
        });
    }

    return reply.code(500).send({ ok: false });
}
