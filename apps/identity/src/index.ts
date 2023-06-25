import { server } from "./infrastructure/app";

async function main() {
   server.listen({ port: 4334 }, function (err: any) {
      if (err) {
         server.log.error(err);
         process.exit(1);
      }
   });
}

void main().catch((error: unknown) => {
   if (error) {
      server.close(() => {
         server.log.error("Server has been shut down");
         process.exit(0);
      });
   }
});
