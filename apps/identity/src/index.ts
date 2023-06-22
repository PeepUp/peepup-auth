import { routes } from "./adapter";
import { accountSchema } from "./adapter/schema/account.schema";
import { server } from "./infrastructure/app";

async function main() {
   server.after(() => {
      const { routes: router } = routes();

      router.forEach((route) => {
         server.route(route);
      });

      /*  server.get(
         "/api-docs",
         async (_request: FastifyRequest, reply: FastifyReply) => {
            return reply.status(200).send(openapi);
         }
      ); */

      for (const schema of [...accountSchema]) {
         server.addSchema(schema);
      }
   });

   await server.ready();

   server.listen({ port: 4334 }, function (err: any, address) {
      if (err) {
         server.log.error(err);
         console.log(err);
         process.exit(1);
      }
      server.log.info(`server listening on ${address}`);
   });
}

process.on("uncaughtException", (error: Error): void => {
   console.error("uncaughtException");
   console.error(error);
   process.exit(1);
});

process.on("unhandledRejection", (error: Error): void => {
   console.error("unhandledRejection");
   console.error(error);
   process.exit(1);
});

process.on("SIGINT", () => {
   server.close(() => {
      server.log.info("Server has been shut down");
      process.exit(0);
   });
});

void main().catch((error) => {
   console.error(error);
   if (error) {
      server.close(() => {
         server.log.info("Server has been shut down");
         process.exit(0);
      });
   }
});
