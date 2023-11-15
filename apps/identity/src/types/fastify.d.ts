import "fastify";
import type { Identity } from "@/types/main";
import { AppAbility } from "@/domain/factory/ability";

declare module "fastify" {
    interface FastifyInstance {
        config: Identity.Config.Api;
        certs: Identity.Config.Certs;
    }

    interface FastifyRequest {
        ability: AppAbility;
    }
}
