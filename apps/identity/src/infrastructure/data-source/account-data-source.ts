import { Prisma, PrismaClient } from "@prisma/client";

import type {
   AccountDataSource,
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

   async insert(user: UserAccount): Promise<UserAccount> {
      const newUser = await this.db.account.create({
         data: {
            user: {
               create: {
                  phone: user.profile.phone,
                  username: user.profile.username,
                  emailVerified: user.profile.emailVerified,
                  password: user.profile.password,
                  image: user.profile.avatar,
                  name: user.profile.name,
                  email: user.profile.email,
               },
            },
            roles: {
               create: [
                  {
                     permissions: {
                        create: [user.roles.map((role) => role.permissions)],
                     },
                     type: user.roles.map((role) => role.type),
                  },
               ],
            },
            providerId: user.providerId ? user.providerId : null,
            updatedAt: new Date(),
            createdAt: new Date(),
         },
      });

      return newUser as unknown as UserAccount;
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
                  image: true,
                  emailVerified: true,
               },
            },
         },
         where: { id: <number>id },
      });

      if (data?.user) {
         return {
            profile: {
               name: data.user.name,
               email: data.user.email,
               username: data.user.username,
               phone: data.user.phone,
               avatar: data.user.image,
               emailVerified: data.user.emailVerified,
            },
         } as UserAccount;
      }

      return {} as UserAccount;
   }

   async find(user: UserAccount): Promise<UserAccount> {
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
