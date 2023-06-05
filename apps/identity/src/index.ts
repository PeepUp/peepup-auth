import { PrismaClient } from "@prisma/client";
import accountRoutes from "./adapter/account/account.routes";
import mainRoutes from "./adapter/";
import { server } from "./infrastructure/app";

const prisma = new PrismaClient({ log: ["query"] });

async function main() {
   server.register(import("@fastify/cors"), {
      origin: "*",
   });

   server.register(mainRoutes, { prefix: "/" });
   server.register(accountRoutes, { prefix: "/api/v1" });
   server.listen({ port: 4334 }, function (err, address) {
      if (err) {
         server.log.error(err);
         process.exit(1);
      }
      server.log.info(`server listening on ${address}`);
   });

   await server.ready();
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

void main()
   .catch((error) => {
      console.error(error);
      process.exit(1);
   })
   .finally(async () => {
      await prisma.$disconnect();
   });
