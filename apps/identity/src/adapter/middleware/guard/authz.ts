import { ForbiddenError } from "@casl/ability";

import ForbiddenException from "@/adapter/middleware/errors/forbidden-exception";

import type { RequiredAbility } from "@/types/ability";
import type { FastifyRequest } from "fastify";

export default class Authorization {
    public static policy(rules: RequiredAbility[]) {
        return async (request: FastifyRequest) => {
            try {
                rules.forEach(({ action, subject }) =>
                    ForbiddenError.from(request.ability).throwUnlessCan(action, subject)
                );
            } catch (error) {
                if (error instanceof ForbiddenError) {
                    throw new ForbiddenException(
                        "Sorry! looks like You don't have permission or access to the resource!"
                    );
                }
            }
        };
    }
}
