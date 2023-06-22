import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { Routes } from "./root";

export default (): { routes: Routes } => {
   return {
      routes: [
         {
            method: "GET",
            url: "/check-health",

            handler: async (
               _request: FastifyRequest,
               reply: FastifyReply
            ): Promise<unknown> => {
               return reply.send({
                  code: 200,
                  status: "up",
                  ok: true,
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
                  message: "server is running",
                  timestamp: Date.now(),
                  level: "info",
                  service: "server",
                  version: "1.0.0",
               });
            },
         },

         {
            method: "GET",
            url: "/",
            handler: async (
               _request: FastifyRequest,
               reply: FastifyReply
            ): Promise<void> => {
               return reply.code(307).redirect("http://localhost:3000");
            },
         },
      ],
   };
};
