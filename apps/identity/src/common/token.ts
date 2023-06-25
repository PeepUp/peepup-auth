import { config } from "../application";
import * as jose from "jose";

import type { JWTHeaderParameters, JWTPayload } from "jose";

class JOSEToken {
   constructor(
      public header: JWTHeaderParameters,
      public payload: JWTPayload
   ) {}
   static async signClaims(
      subject: string,
      privateKey: string,
      algorithm: string,
      issuer: string,
      payload: object
   ): Promise<string> {
      const privateKeyImport = await jose.importPKCS8(privateKey, algorithm);

      const jws = await new jose.CompactSign(
         new TextEncoder().encode(
            JSON.stringify({
               ...payload,
               sub: subject,
               iss: issuer,
            })
         )
      )
         .setProtectedHeader({ alg: "RS256" })
         .sign(privateKeyImport);

      return jws;
   }

   static async createJWEToken({
      publicKey,
      privateKey,
      algorithm,
      payload,
      header,
      exiprationTime,
   }: CreateTokenArgs): Promise<string> {
      const privateKeyImport = await jose.importPKCS8(privateKey, algorithm);
      const publicKeyImport = await jose.importSPKI(publicKey, algorithm);

      const signature = await new jose.SignJWT({
         payload,
      })
         .setProtectedHeader({ alg: "RS256", enc: "A128GCM" })
         .sign(privateKeyImport);

      const encyptedPayload = await new jose.EncryptJWT({
         payload,
         header,
         publicKey,
         signature,
      })
         .setProtectedHeader({ alg: "RSA-OAEP-256", enc: "A256GCM" })
         .setIssuedAt()
         .encrypt(publicKeyImport);

      console.log({ encyptedPayload, signature });

      return signature;
   }

   static async createToken({
      publicKey,
      privateKey,
      algorithm,
      payload,
      header,
      exiprationTime,
   }: CreateTokenArgs): Promise<string> {
      const privateKeyImport = await jose.importPKCS8(privateKey, algorithm);
      const publicKeyImport = await jose.importSPKI(publicKey, algorithm);

      /*  const encryptedPayload = await new jose.CompactEncrypt(
         new TextEncoder().encode(JSON.stringify(payload))
      )
         .setProtectedHeader({
            alg: "RSA-OAEP-256",
            enc: "A256GCM",
         })
         .encrypt(publicKeyImport); */

      const token = await new jose.SignJWT({
         ...payload,
      })
         .setProtectedHeader({ alg: "RS256" })
         .setIssuedAt()
         .setIssuer(
            `urn:server-1:${config.config.environment.host}:${config.config.environment.port}`
         )
         .setAudience(<string>payload.client)
         .setSubject("urn:example:subject")
         .setExpirationTime(exiprationTime)
         .sign(privateKeyImport);

      return token;
   }

   static async verificationToken({
      privateKey,
      publicKey,
      algorithm,
      token,
      issuer = "urn:server-1:" +
         `${config.config.environment.host}:${config.config.environment.port}`,
      audience = "urn:example:audience",
   }: VerifyTokenArgs): Promise<{
      payload: JWTPayload;
      header: JWTHeaderParameters;
   }> {
      if (!publicKey || !algorithm || !token) {
         throw new Error("Invalid input parameters");
      }

      const verificationOptions = {
         algorithms: [algorithm],
         issuer,
         audience,
      };

      try {
         const publicKeyImport = await jose.importSPKI(publicKey, algorithm);
         const privateKeyImport = await jose.importPKCS8(privateKey, algorithm);
         const { payload, protectedHeader } = await jose.jwtVerify(
            token,
            publicKeyImport,
            verificationOptions
         );

         if (!payload || !protectedHeader) {
            throw new Error("Invalid token: Missing payload or header");
         }

         if (payload.expiresAt && <number>payload.exp < Date.now() / 1000) {
            throw new Error("Invalid token: Token has expired");
         }

         return { payload, header: protectedHeader };
      } catch (error) {
         console.error(error);
         throw new Error("Token verification failed");
      }
   }
}
export interface VerifyTokenArgs {
   publicKey: string;
   privateKey: string;
   algorithm: string;
   token: string;
   issuer?: string;
   audience?: string;
}

export interface CreateTokenArgs {
   publicKey: string;
   privateKey: string;
   algorithm: string;
   payload: JWTPayload;
   header: JWTHeaderParameters;
   exiprationTime: string | number;
}

export default JOSEToken;
