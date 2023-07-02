import type {
    FastifyError,
    FastifyInstance,
    FastifyReply,
    FastifyRequest,
} from "fastify";
import ResourceAlreadyExistException from "./error/resource-exists";

export async function errorHandler(
    this: FastifyInstance,
    error: FastifyError,
    _request: FastifyRequest,
    reply: FastifyReply
) {
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

    if (error.statusCode === 403 && error.name === "ForbiddenException") {
        return reply.code(403).send({
            ok: false,
            code: 403,
            codeStatus: "Forbidden",
            errors: {
                error: <string>error.message,
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
        console.dir(error, { depth: Infinity });

        return reply.code(500).send({
            code: 500,
            message: error.message,
        });
    }

    return reply.code(500).send({ ok: false });
}
