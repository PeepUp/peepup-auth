import type { FastifyPluginAsync } from "fastify";

export type FastifyGracefulExitOptions = {
   logBindings?: Record<string, unknown>;
   timeout?: number;
};

export const signal: FastifyPluginAsync<FastifyGracefulExitOptions> = async (
   fastify,
   options = {
      timeout: 3000,
   }
): Promise<void> => {
   const { timeout = 30000 } = options;
   const { log } = fastify;
   let closePromise: Promise<undefined> | null = null;

   const gracefullyClose = async (signal: string) => {
      if (closePromise) {
         return closePromise;
      }

      console.warn(
         `🌿 Server has been interrupt on ${signal} gracefully and will be shut down ...`
      );

      setTimeout(() => {
         console.warn(`Failed to gracefully close before timeout`);
         process.exit(1);
      }, timeout);

      closePromise = fastify.close();

      await closePromise;

      process.exit(0);
   };

   process.on("uncaughtException", (err) => {
      log.error({ err }, `Uncaught Exception: ${err.message}`);
      gracefullyClose("uncaughtException");
   });

   process.on("unhandledRejection", (reason, _promise) => {
      log.error({ reason }, `Unhandled Rejection: ${reason}`);
      gracefullyClose("unhandledRejection");
   });

   for (const signal of ["SIGINT", "SIGTERM"]) {
      process.on(signal, () => {
         console.warn(
            `🌿 Server has been interrupt on ${signal} gracefully and will be shut down ...`
         );
         gracefullyClose(signal);
      });
   }
};