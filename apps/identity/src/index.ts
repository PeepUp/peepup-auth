import { server } from "./infrastructure/app";

async function main() {
   await server.ready();

   const _ = await server.listen({
      port: <number>server.config.environment.port,
      host: <string>server.config.environment.host,
   });

   console.log(`🐢 Server listening on ${_}`);
}

void main()
   .catch((error: unknown) => {
      if (error) {
         server.close(() => {
            server.log.error("Server has been shut down");
            process.exit(0);
         });
      }
   })
   .finally(() => {
      process.on("unhandledRejection", (error: unknown) => {
         if (error) {
            server.log.error(error);
            process.exit(1);
         }
      });

      for (const signal of ["SIGINT", "SIGTERM"]) {
         process.on(signal, () => {
            console.warn(
               `🌿 Server has been interrupt on ${signal} gracefully and will be shut down ...`
            );
            server
               .close()
               .then(() => process.exit(0))
               .catch(() => process.exit(1));
         });
      }
   });
