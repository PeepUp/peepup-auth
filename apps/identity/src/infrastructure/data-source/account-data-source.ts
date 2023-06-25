import { PrismaClient } from "@prisma/client";

import type {
   AccountContract,
   AccountDataSource,
   CreateAccountInput,
   DataSourceSQL,
   ID,
} from "@/types/types";

class PrismaAccountDataSourceAdapter
   implements AccountDataSource, DataSourceSQL<AccountContract>
{
   public name: string = "Prisma Account Data Source Adapter";

   constructor(private readonly db: PrismaClient) {}

   async create(_data: AccountContract): Promise<AccountContract | null> {
      throw new Error("Method not implemented.");
   }
   async read(_id: string): Promise<AccountContract | null> {
      throw new Error("Method not implemented.");
   }

   async connect(): Promise<void> {
      await this.db.$connect();
   }

   async disconnect(): Promise<void> {
      await this.db.$disconnect();
   }

   async insert(user: CreateAccountInput): Promise<AccountContract> {
      const newuser = await this.db.account.create({
         data: {
            user: {
               create: {
                  email: user.profile.email,
                  username: user.profile.username,
                  password: user.profile.password,
                  firstName: user.profile.firstName,
                  lastName: user.profile.lastName,
               },
            },
            updatedAt: new Date(),
            createdAt: new Date(),
         },
      });

      return newuser as unknown as AccountContract;
   }

   async update(_user: AccountContract): Promise<AccountContract> {
      throw new Error("Method not implemented.");
   }

   async updateById(_id: number, _data: AccountContract): Promise<void> {
      throw new Error("Method not implemented.");
   }

   async delete(_id: ID): Promise<boolean> {
      throw new Error("Method not implemented.");
   }

   async findById(id: ID): Promise<AccountContract> {
      const data = await this.db.account.findUnique({
         include: {
            user: {
               select: {
                  firstName: true,
                  lastName: true,
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
            user: data.user,
         } as AccountContract;
      }

      return {} as AccountContract;
   }

   async find(query: AccountContract): Promise<AccountContract> {
      const data = await this.db.account.findFirst({
         include: {
            user: true,
         },
         where: {
            user: {
               username: query.user.username,
               email: query.user.email,
            },
         },
      });

      if (data) {
         return {
            user: data.user,
         } as AccountContract;
      }

      return {} as AccountContract;
   }

   async findByEmail(email: string): Promise<AccountContract> {
      throw new Error("Method not implemented.");
   }

   async query<Q>(query?: Q | undefined): Promise<AccountContract[]> {
      throw new Error("Method not implemented.");
   }
}

export default PrismaAccountDataSourceAdapter;
