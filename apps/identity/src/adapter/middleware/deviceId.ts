import * as crypto from "crypto";
import { FastifyReply, FastifyRequest } from "fastify";

export function deviceIdHook(
    request: FastifyRequest,
    reply: FastifyReply,
    done: Function
) {
    request.headers["x-device-id"] = crypto.randomBytes(16).toString("hex");
    done();
}
