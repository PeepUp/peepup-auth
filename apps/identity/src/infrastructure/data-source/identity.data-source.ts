import type { Identity } from "@/domain/entity/identity";
import type { PrismaIdentityExtendedModel } from "@/types/prisma";
import type {
   DataSourceSQL,
   FindLoginIdentityQuery,
   FindUniqeIdentityQuery,
   ID,
} from "@/types/types";
import { Prisma } from "@prisma/client";

/**
 * @todo:
 *  ☐ check task on: @/types/prisma.d.ts
 *  ☐ [SOON] delete console.dir on function findUniqueLogin
 *
 */

class IdentityStoreAdapter implements DataSourceSQL<Identity> {
   constructor(private readonly db: PrismaIdentityExtendedModel) {}

   async query(query: Identity): Promise<Identity[]> {
      const result: Readonly<Identity>[] = await this.db.identity.findMany({
         where: {
            email: { contains: query.email },
            id: { contains: query.id },
            username: { contains: query.username },
         },
      });

      return result;
   }

   async findUnique(query: FindUniqeIdentityQuery): Promise<Readonly<Identity> | null> {
      const result: Readonly<Identity | null> = await this.db.identity.findUnique({
         where: query,
      });

      return result;
   }

   async findUniqueLogin(
      query: FindLoginIdentityQuery
   ): Promise<Readonly<Identity> | null> {
      const result: Readonly<Identity | null> = await this.db.identity.findUnique({
         where: {
            email: query.where.email,
            username: query.where.username,
         },
      });

      if (result === null) return null;

      const verified = await this.db.identity.verifyPassword({
         _: query.data.password,
         __: result.password,
      });

      console.dir({ verified }, { depth: Infinity });
      if (!verified) return null;

      return result;
   }

   async create(identity: Identity): Promise<Identity> {
      const hashedPassword = await this.db.identity.hashPassword({
         _: identity.password,
      });

      const result: Readonly<Identity> = await this.db.identity.create({
         data: {
            email: identity.email,
            username: identity.username,
            password: hashedPassword,
            firstName: identity.firstName,
            lastName: identity.lastName,
            updatedAt: new Date(),
            createdAt: new Date(),
         },
      });

      return result;
   }

   async findMany(): Promise<Readonly<Identity>[] | null> {
      const result: Readonly<Identity>[] | null = await this.db.identity.findMany();
      return result;
   }

   async find(id: ID): Promise<Readonly<Identity> | null> {
      const result: Readonly<Identity | null> = await this.db.identity.findFirst({
         where: {
            id: <string>id,
         },
      });

      return Object.freeze(result);
   }

   async update(id: ID, data: Identity): Promise<Identity> {
      const result: Readonly<Identity> = await this.db.identity.update({
         where: {
            id: <string>id,
         },
         data: {
            email: data.email,
            username: data.username,
            password: data.password,
            firstName: data.firstName,
            lastName: data.lastName,
            updatedAt: new Date(),
         },
      });

      return result;
   }

   async delete(id: ID): Promise<void> {
      await this.db.identity.delete({
         where: {
            id: <string>id,
         },
      });
   }
}

export default IdentityStoreAdapter;
