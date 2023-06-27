import { join } from "path";
import { fileUtils } from "./common";
import JOSEToken from "./common/token.util";
import { server } from "./infrastructure/http/app";
async function main() {
   await server.ready();

   // fileUtils.deleteFolderRecursive(join(process.cwd(), "/keys/"));
   // const { privateKey, publicKey } = JOSEToken.generateKeyPair();
   /* const kid = fileUtils.getFolderNames(join(process.cwd(), "/keys/"))[0];
   const privateKey = fileUtils.readFile(`keys/${kid}/private.pem.key`, "utf-8");
   const publicKey = fileUtils.readFile(`keys/${kid}/public.pem.key`, "utf-8");
   console.log({ privateKey, publicKey });

   JOSEToken.createJWToken({
      privateKey,
      header: {
         alg: "RS256",
      },
      publicKey: publicKey,
      algorithm: "RS256",
      exiprationTime: 1000 * 60 * 60 * 24 * 7,
      payload: {
         id: "1",
      },
   });

   const jwkPublic = await JOSEToken.JWKFromPEM(publicKey);
   console.dir(jwkPublic, { depth: Infinity });
 */

   const _ = await server.listen({
      port: <number>server.config.environment.port,
      host: <string>server.config.environment.host,
   });

   console.log(`🐢 Server listening on ${_}`);
}

void main().catch((error: unknown) => {
   if (error) {
      server.close(() => {
         server.log.error("Server has been shut down");
         process.exit(0);
      });
   }
});
