import { PrismaClient } from "@prisma/client";
import { server } from "./infrastructure/app";
const prisma = new PrismaClient({ log: ["query"] });

async function main() {
   await server.ready();

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

process.on("SIGINT", () => {
   server.close(() => {
      server.log.info("Server has been shut down");
      process.exit(0);
   });
});

void main()
   .catch((error) => {
      console.error(error);
      if (error) {
         server.close(() => {
            server.log.info("Server has been shut down");
            process.exit(0);
         });
      }
   })
   .finally(async () => {
      await prisma.$disconnect();
   });
