import { PrismaClient } from "@prisma/client";
import accountRoutes from "./adapter/account/account.routes";
import { server } from "./infrastructure/app";

server.get("/check-health", async (_request, reply) => {
   return reply.send({
      code: 200,
      result: "ok",
      type: "application/json",
      location: "http://localhost:4334/check-health",
      url: "http://localhost:4334/check-health",
      scheme: "http",
      method: "GET",
      uri: "http://localhost:4334/check-health",
      user_agent: "PostmanRuntime/7.28.4",
      accept: "*/*",
      origin: "http://localhost:3000",
      via: "1.1 localhost (Apache-HttpClient/4.5.13 (Java/11.0.12))",
      report_to:
         '{"group":"default","max_age":31536000,"endpoints":[{"url":"https://localhost:4334/report"}],"include_subdomains":true}',
      path: "/check-health",
      allow: "GET, POST, PUT, DELETE",
      qwerty: "qwerty",
      status: "ok",
      message: "server is running",
      timestamp: Date.now(),
      level: "info",
      service: "server",
      version: "1.0.0",
   });
});

const prisma = new PrismaClient({ log: ["query"] });

async function main() {
   server.register(import("@fastify/cors"), {
      origin: "*",
   });

   server.register(accountRoutes, { prefix: "/api/v1" });

   server.listen({ port: 4334 }, function (err, address) {
      if (err) {
         server.log.error(err);
         process.exit(1);
      }
      server.log.info(`server listening on ${address}`);
   });

   const newuser = await prisma.account.create({
      include: {
         user: true,
         role: {
            include: { permissions: true },
         },
      },
      data: {
         user: {
            create: {
               phone: "1234567890",
               username: "john",
               emailVerified: new Date(),
               password: "1234567890",
               image: "https://www.google.com",
               name: "John Doe",
               email: "john@gmail.com",
            },
         },
         role: {
            create: {
               type: "ADMIN",
               permissions: {
                  create: [
                     {
                        attribute: {
                           canCreateUser: true,
                           canDeleteUser: true,
                           canInviteUser: true,
                           canUpdateUser: true,
                        },
                     },
                     {
                        attribute: {
                           canDeleteOrganization: true,
                           canUpdateOrganization: true,
                           canInviteUser: true,
                        },
                     },
                  ],
               },
            },
         },
      },
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

void main()
   .catch((error) => {
      console.error(error);
      process.exit(1);
   })
   .finally(async () => {
      await prisma.$disconnect();
   });
