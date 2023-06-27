import IdentityRepository from "@/application/repository/identity";

import type { Identity } from "@/domain/entity/identity";
import { FindUniqeIdentityQuery } from "@/types/types";
import type {
   RequestLoginIdentityBody,
   RequestRegisterIdentityBody,
} from "../handler/identity";

export type IdentityRegistration = Pick<Identity, "email" | "password">;
export type IdentityResponse = Omit<Identity, "password">;
export type IdentityDataOmittedValue =
   | "password"
   | "providerId"
   | "phoneNumber"
   | "updatedAt";
export type IdentityOmitted = Omit<Identity, IdentityDataOmittedValue>;

/*
 * @todo:
 *  ☐ make type for class IdentityService
 *  ☐ where should I put the validation?
 *  ☐ make factory to encapsulte creating identity object
 *  ☐ don't identity already exists
 *
 *  @figure
 *   🤔
 * */
class IdentityService {
   constructor(public readonly identityRepository: IdentityRepository) {}

   /**
    * @todo:
    *  ☐ validate email
    *  ☐ validate password
    *  ☐ hash password
    *  ☐ check identity already exists
    *
    *  @figure
    *   🤔
    *
    * */
   async registration(body: RequestRegisterIdentityBody): Promise<void> {
      const { traits, password, method } = body;

      const identity: Identity = {
         email: <string>traits.email,
         password: password,
         avatar: "",
         username: <string>traits.username ?? <string>traits.email?.split("@")[0],
         lastName: "",
         firstName: "",
         phoneNumber: "",
         state: "active",
         providerId: null,
         emailVerified: null,
      };

      const data = await this.identityRepository.create<Identity>(identity);

      if (!data) {
         throw new Error("Error: cannot creating identity");
      }
   }

   async login(
      body: RequestLoginIdentityBody
   ): Promise<Readonly<IdentityOmitted> | null> {
      const { traits, password, method, password_identifier } = body;
      const identity = await this.identityRepository.getLoginIdentity<Identity>({
         where: traits,
         data: { password },
      });

      if (identity === null) return null;

      return identity;
   }

   async getIdentities(): Promise<Readonly<IdentityOmitted>[] | null> {
      const data = await this.identityRepository.getIdentities();
      if (data === null) return data;
      /* const [{ password, providerId, phoneNumber, updatedAt, ...result }]: typeof data =
         data; */

      const result = data.map((identity) => {
         const {
            password,
            providerId,
            phoneNumber,
            updatedAt,
            ...result
         }: typeof identity = identity;

         return result;
      });

      return result ?? null;
   }

   /**
    * @todo
    *    ☐ data identity must be set to readonly
    *    ☑ [DONE]: make this method return IdentityOmitted type
    *    ☑ [DONE]: make this method dont spoil the password attribute
    */

   async getIdentityById(id: string): Promise<Readonly<IdentityOmitted> | null> {
      const data = await this.identityRepository.getIdentityById<Identity>(id);
      if (data === null) return data;

      const { password, providerId, phoneNumber, updatedAt, ...result }: typeof data =
         data;
      return result;
   }

   async getIdentityByQuery(
      query: FindUniqeIdentityQuery
   ): Promise<Readonly<IdentityOmitted> | null> {
      const data = await this.identityRepository.getIdentity<Identity>(query);
      if (data === null) return data;

      const { password, providerId, phoneNumber, updatedAt, ...result }: typeof data =
         data;

      return result;
   }
}

export default IdentityService;
