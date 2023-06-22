import argon2 from "argon2";
import { randomBytes } from "crypto";

export const utils = {
   type(o: unknown): string {
      if (o === null) {
         return "null";
      }
      if (o === undefined) {
         return "undefined";
      }
      return (
         Object.prototype.toString
            .call(o)
            .match(/\s(\w+)/i)?.[1]
            .toLowerCase() ?? ""
      );
   },
   deepFreeze(o: any): any {
      if (utils.type(o) !== "object") return;
      const props = Object.getOwnPropertyNames(o);
      props.forEach((key: string) => {
         let sub = o[key];
         if (Array.isArray(sub)) Object.freeze(sub);
         if (utils.type(sub) === "object") {
            utils.deepFreeze(sub);
         }
      });
      return Object.freeze(o);
   },
};

export const passwordUtils = {
   async hash({
      password,
      salt,
   }: {
      password: string;
      salt: string;
   }): Promise<string> {
      try {
         const hashedPassword = await argon2.hash(password, {
            salt: Buffer.from(salt, "hex"),
         });

         return hashedPassword;
      } catch (error) {
         // Handle any errors
         throw new Error("Password hashing failed");
      }
   },
   async verify(
      password: string,
      hashedPassword: string,
      salt: string
   ): Promise<boolean> {
      try {
         return await argon2.verify(hashedPassword, password, {
            salt: Buffer.from(salt, "hex"),
         });
      } catch (error) {
         throw new Error("Password verification failed");
      }
   },
   async generateSalt(length: number = 16): Promise<string> {
      return new Promise((resolve, reject) => {
         randomBytes(length, (err, buffer) => {
            if (err) {
               reject(err);
            } else {
               const salt = buffer.toString("hex");
               resolve(salt);
            }
         });
      });
   },
};
