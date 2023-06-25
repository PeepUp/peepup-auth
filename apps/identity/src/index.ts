import { routes } from "./adapter";
import { errorHandler } from "./adapter/middleware/error-handler";
import { server } from "./infrastructure/app";

async function main() {
   server.after(() => {
      const { routes: router } = routes();

      router.forEach((route) => {
         server.route(route);
      });

      server.setErrorHandler(errorHandler);
   });

   server.ready((err) => {
      console.log("successfully booted!");
      console.log(
         server.printRoutes({
            includeHooks: true,
            includeMeta: ["errorHandler"],
         })
      );

      if (err) {
         throw err;
      }

      // console.log(server.initialConfig);
      // console.error(server.printPlugins());
      // console.log(server.getSchemas());
   });

   server.listen({ port: 4334 }, function (err: any) {
      if (err) {
         server.log.error(err);
         process.exit(1);
      }
   });
}

void main().catch((error) => {
   console.error(error);
   if (error) {
      server.close(() => {
         server.log.error("Server has been shut down");
         process.exit(0);
      });
   }
});
