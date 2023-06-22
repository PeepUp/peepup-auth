import { Prisma, PrismaClient } from "@prisma/client";

import type {
   AccountDataSource,
   CreateAccountInput,
   DataSourceSQL,
   ID,
   UserAccount,
   UserProfile,
} from "@/common/types";

class PrismaAccountDataSourceAdapter
   implements AccountDataSource, DataSourceSQL<UserAccount>
{
   public name: string = "Prisma Account Data Source Adapter";
   constructor(private readonly db: PrismaClient) {}

   async create(data: UserAccount): Promise<UserAccount | null> {
      throw new Error("Method not implemented.");
   }
   async read(id: string): Promise<UserAccount | null> {
      throw new Error("Method not implemented.");
   }

   async connect(): Promise<void> {
      await this.db.$connect();
   }

   async disconnect(): Promise<void> {
      await this.db.$disconnect();
   }

   async insert(user: CreateAccountInput): Promise<UserAccount> {
      const newuser = await this.db.account.create({
         data: {
            user: {
               create: {
                  email: user.profile.email,
                  password: user.profile.password,
                  name: user.profile.name,
               },
            },
            updatedAt: new Date(),
            createdAt: new Date(),
         },
      });

      return newuser as unknown as UserAccount;
   }

   async update(user: UserAccount): Promise<UserAccount> {
      throw new Error("Method not implemented.");
   }

   async updateById(id: number, data: UserAccount): Promise<void> {
      throw new Error("Method not implemented.");
   }

   async delete(id: ID): Promise<boolean> {
      throw new Error("Method not implemented.");
   }

   async findById(id: ID): Promise<UserAccount> {
      const data = await this.db.account.findUnique({
         include: {
            user: {
               select: {
                  name: true,
                  email: true,
                  username: true,
                  phone: true,
                  avatar: true,
                  emailVerified: true,
               },
            },
         },
         where: { id: <number>id },
      });

      if (data?.user) {
         return {
            profile: data.user,
         } as UserAccount;
      }

      return {} as UserAccount;
   }

   async find(user: UserAccount): Promise<UserAccount> {
      const data = await this.db.account.findFirst({
         include: {
            user: true,
         },
         where: {
            user: {
               username: user.profile.username,
               email: user.profile.email,
            },
         },
      });

      console.log({ data });
      if (data) {
         return {
            profile: data.user,
         } as UserAccount;
      }

      return {} as UserAccount;
      throw new Error("Method not implemented.");
   }

   async findByEmail(email: string): Promise<UserAccount> {
      throw new Error("Method not implemented.");
   }

   async query<Q>(query?: Q | undefined): Promise<UserAccount[]> {
      throw new Error("Method not implemented.");
   }
}

export default PrismaAccountDataSourceAdapter;
