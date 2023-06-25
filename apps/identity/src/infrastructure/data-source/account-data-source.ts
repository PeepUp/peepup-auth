import { PrismaClient } from "@prisma/client";

import type {
   AccountDataSource,
   CreateAccountInput,
   DataSourceSQL,
   ID,
   UserAccount,
} from "@/common/types";

class PrismaAccountDataSourceAdapter
   implements AccountDataSource, DataSourceSQL<UserAccount>
{
   public name: string = "Prisma Account Data Source Adapter";
   constructor(private readonly db: PrismaClient) {}

   async create(_data: UserAccount): Promise<UserAccount | null> {
      throw new Error("Method not implemented.");
   }
   async read(_id: string): Promise<UserAccount | null> {
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

   async update(_user: UserAccount): Promise<UserAccount> {
      throw new Error("Method not implemented.");
   }

   async updateById(_id: number, _data: UserAccount): Promise<void> {
      throw new Error("Method not implemented.");
   }

   async delete(_id: ID): Promise<boolean> {
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
         where: { id: <string>id },
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

      if (data) {
         console.log({ ...data });
         return {
            profile: data.user,
         } as UserAccount;
      }

      return {} as UserAccount;
   }

   async findByEmail(email: string): Promise<UserAccount> {
      throw new Error("Method not implemented.");
   }

   async query<Q>(query?: Q | undefined): Promise<UserAccount[]> {
      throw new Error("Method not implemented.");
   }
}

export default PrismaAccountDataSourceAdapter;
