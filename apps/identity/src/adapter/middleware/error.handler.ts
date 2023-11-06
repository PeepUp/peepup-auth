import type {
    FastifyError,
    FastifyInstance,
    FastifyReply,
    FastifyRequest,
} from "fastify";

import ResourceAlreadyExistException from "@/adapter/middleware/errors/resource-already-exists-execption";
import { ZodError } from "zod";
import CustomError from "./errors/custom-error";
import BadCredentialsException from "./errors/bad-credential-exception";
import JWTException from "./errors/jwt-error";
import ForbiddenException from "./errors/forbidden-exception";
import UnauthorizedException from "./errors/unauthorized";
import BadRequestException from "./errors/bad-request-exception";

export async function errorHandler(
    this: FastifyInstance,
    error: FastifyError | CustomError,
    _request: FastifyRequest,
    reply: FastifyReply
) {
    console.log("error handler");
    console.dir(error, { depth: Infinity });

    if (error instanceof CustomError) {
        switch (true) {
            case error instanceof BadCredentialsException: {
                reply.code(error.getCode()).send({
                    status: error.status,
                    code: error.code,
                    description: error.description,
                    error: error.message,
                });
                break;
            }

            case error instanceof ForbiddenException: {
                reply.code(error.getCode()).send({
                    status: error.status,
                    code: error.code,
                    description: error.description,
                    error: error.message,
                });
                break;
            }
            case error instanceof UnauthorizedException: {
                reply.code(error.getCode()).send({
                    status: error.status,
                    code: error.code,
                    description: error.description,
                    error: error.message,
                });
                break;
            }
            case error instanceof ResourceAlreadyExistException: {
                reply.code(error.getCode()).send({
                    status: error.status,
                    code: error.code,
                    description: error.description,
                    error: error.message,
                });
                break;
            }

            case error instanceof JWTException: {
                reply.code(error.getCode()).send({
                    ok: false,
                    code: error.code,
                    description: error.description,
                    message: error.message,
                });
                break;
            }

            case error instanceof BadRequestException: {
                reply.code(error.getCode()).send({
                    ok: false,
                    code: error.code,
                    description: error.description,
                    message: error.message,
                });
                break;
            }
            default:
                break;
        }
    }

    if (error instanceof ZodError) {
        return reply.code(400).send({
            ok: false,
            code: "Bad Request",
            status: "Bad Request",
            description: error.cause ?? "Validation exception",
            errors: error.formErrors
                ? error.issues.map((e) => ({
                      message: e.message,
                      at: e.path,
                  }))
                : "please check again your request",
        });
    }

    if (error.code === "FST_ERR_VALIDATION") {
        return reply.code(400).send({
            ok: false,
            code: "Bad Request",
            status: "Bad Request",
            errors: error.validation
                ? error.validation.map((e) => ({
                      message: e.message,
                      at: e.instancePath,
                      keyword: e.params.format,
                  }))
                : "we're sorry, please check again your request",
        });
    }

    return reply;
}
