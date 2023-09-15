import type {
    FastifyError,
    FastifyInstance,
    FastifyReply,
    FastifyRequest,
} from "fastify";

import JWTException from "./error/jwt-error";
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

    if (error.statusCode === 400 && error.name === "BadRequestException") {
        return reply.code(error.statusCode).send({
            code: error.statusCode,
            codeStatus: "Bad Request",
            message: error.message,
        });
    }

    if (error && error instanceof JWTException) {
        return reply.code(error.statusCode ?? 400).send({
            ok: false,
            code: error.statusCode ?? 400,
            error: {
                message: error.message,
                cause: error.data.cause,
                other: {
                    ...error.data.rest,
                },
            },
        });
    }

    if (error.validation) {
        return reply.code(400).send({
            ok: false,
            code: error.statusCode,
            codeStatus: "Bad Request",
            error: {
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
            error: {
                message: error.message,
            },
        });
    }

    if (error.statusCode === 401 && error.name === "UnauthorizedException") {
        return reply.code(401).send({
            ok: false,
            code: 401,
            codeStatus: "Unauthorized",
            error: {
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
        return reply.code(500).send({
            code: 500,
            error: {
                message: error.message,
            },
        });
    }

    return reply.code(500).send({ ok: false });
}
