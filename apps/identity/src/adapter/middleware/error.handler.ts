import type {
    FastifyError,
    FastifyInstance,
    FastifyReply,
    FastifyRequest,
} from "fastify";

import ResourceAlreadyExistException from "@/adapter/middleware/errors/resource-already-exists-execption";
import CustomError from "./errors/custom-error";
import BadCredentialsException from "./errors/bad-credential-exception";
import JWTException from "./errors/jwt-error";

export async function errorHandler(
    this: FastifyInstance,
    error: FastifyError | CustomError,
    _request: FastifyRequest,
    reply: FastifyReply
) {
    if (error instanceof CustomError) {
        switch (true) {
            case error instanceof BadCredentialsException: {
                return reply.code(error.getCode()).send({
                    status: error.status,
                    code: error.code,
                    description: error.description,
                    error: error.message,
                });
            }
            default: {
                return reply.code(500).send({
                    status: "UnhandleError",
                    code: 500,
                    description: "Unhandled Error",
                    error: error.message,
                });
            }
        }
    }

    if (error.statusCode === 409 && error.name === "ResourceAlreadyExistException") {
        return reply.code(error.statusCode).send({
            status: "failed",
            code: error.code,
            codeStatus: "Conflict",
            message: error.message,
        });
    }

    if (error && error instanceof JWTException) {
        return reply.code(error.statusCode ?? 400).send({
            ok: false,
            code: error.code ?? 400,
            error: {
                message: error.message,
                cause: error.data.message,
                other: error.data.rest,
            },
        });
    }

    if (error.validation) {
        return reply.code(400).send({
            ok: false,
            code: error.code,
            codeStatus: "Bad Request",
            error: {
                context: error.validationContext,
                message: error.message,
            },
        });
    }

    /* if (error.code === 403 && error.name === "ForbiddenException") {
        return reply.code(403).send({
            ok: false,
            code: 403,
            codeStatus: "Forbidden",
            error: {
                message: error.message,
            },
        });
    }

    if (error.code === 401 && error.name === "UnauthorizedException") {
        return reply.code(401).send({
            ok: false,
            code: 401,
            codeStatus: "Unauthorized",
            error: {
                message: error.message,
            },
        });
    } */

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

    console.dir(error, { depth: Infinity });
    return reply.code(500).send({ ok: false });
}
