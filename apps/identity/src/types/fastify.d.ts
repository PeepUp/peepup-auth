import "fastify";

declare module "fastify" {
    interface FastifyInstance {
        config: Identity.Config.Api;
        adapter: Adapter;
    }
}
