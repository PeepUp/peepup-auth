import { join } from "path";
import { Routes } from "../root";

import type { FastifyReply, FastifyRequest } from "fastify";
import { existsSync } from "fs";
import { fileUtils } from "../../../common";

interface CustomRequest {
   raw: {
      url: string;
   };
}

export default (): { routes: Routes } => {
   return {
      routes: [
         {
            method: "GET",
            url: "/oauth2/*",
            handler: async (
               request: FastifyRequest<{
                  Params: {
                     "*": string;
                  };
               }>,
               reply: FastifyReply
            ): Promise<unknown> => {
               const { "*": wildcard } = request.params;
               const jwksPath = join(process.cwd(), "public/" + wildcard);

               if (!existsSync(jwksPath)) {
                  return reply.code(404).send({
                     status: "not found",
                  });
               }

               const jwksContent = fileUtils.readFile(jwksPath, "utf-8");
               setImmediate(() => {
                  reply.type("application/octet-stream").send(jwksContent);
               });

               return reply;
            },
         },
         {
            method: "GET",
            url: "/oauth2/v1/certs",
            handler: async (
               request: FastifyRequest,
               reply: FastifyReply
            ): Promise<unknown> => {
               const jwksPath = join(process.cwd(), "public/.well-known/jwks.json");

               if (!existsSync(jwksPath)) {
                  return reply.code(404).send({
                     status: "not found",
                  });
               }

               const jwksContent = fileUtils.readFile(jwksPath, "utf-8");
               const json = await JSON.parse(jwksContent);

               setImmediate(() => {
                  reply.code(200).send(json);
               });

               return reply;
            },
         },
      ],
   };
};

// Define a custom route interface
/* interface CustomRequest extends FastifyRequest {
    RawQuery: null;
    Params: null;
    Headers: null;
    Body: null;
    Querystring: null;
    Url: string;
  } */
