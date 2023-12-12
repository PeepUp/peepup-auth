import { FastifyRequest } from "fastify";
import CSRF from "@/common/libs/csrf";
import BadRequestException from "../errors/bad-request-exception";

export default class CSRFGuard {
    public static async verify(request: FastifyRequest) {
        const { headers } = request;
        const { cookies } = request;
        const cookieName = "__host_csrf_token";
        const csrfOnCookie = cookies[cookieName];
        console.log("csrfOnCookie: ", csrfOnCookie);

        const csrf =
            (headers["x-csrf-token"] as string) ||
            (headers["X-Csrf-Token"] as string) ||
            (headers["X-CSRF-TOKEN"] as string) ||
            (headers["X-CSRF-Token"] as string);

        console.log("csrf-header: ", csrf);

        if (!csrf || !csrfOnCookie) {
            throw new BadRequestException(
                "Header csrf protection is invalid or stolen, please refresh the page and try again"
            );
        }

        const verify = CSRF.verify(csrf, csrfOnCookie);

        if (!verify) {
            throw new BadRequestException(
                "Header csrf protection is invalid or stolen, please refresh the page and try again"
            );
        }
    }
}
