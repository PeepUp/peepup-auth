import { RawServerBase } from "fastify";

export async function createServer(): Promise<any> {
   const server = await import("./infrastructure/app");

   return server;
}
