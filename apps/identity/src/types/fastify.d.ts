import "fastify";
import type { Identity } from "./main";

declare module "fastify" {
    interface FastifyInstance {
        config: Identity.Config.Api;
        certs: Identity.Config.Certs;
    }
}
