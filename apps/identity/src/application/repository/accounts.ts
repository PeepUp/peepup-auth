import type {
   AccountAccessor,
   AccountDataSource,
   ID,
   UserAccount,
} from "@/common";

export class AccountRepository implements AccountAccessor {
   constructor(private readonly accountDataSource: AccountDataSource) {}

   async getAllUsers<Q>(query?: Q): Promise<UserAccount[]> {
      return await this.accountDataSource.query(query as UserAccount);
   }

   async getUserById(id: ID): Promise<UserAccount> {
      return await this.accountDataSource.findById(id);
   }

   async getUser(user: UserAccount): Promise<UserAccount> {
      return await this.accountDataSource.find(user);
   }

   async getUserByEmail(email: string): Promise<UserAccount> {
      return await this.accountDataSource.findByEmail(email);
   }

   async createUser(user: UserAccount): Promise<UserAccount> {
      return await this.accountDataSource.insert(user);
   }

   async updateUser(user: UserAccount): Promise<UserAccount> {
      return await this.accountDataSource.update(user);
   }

   async deleteUser(id: ID): Promise<boolean> {
      return await this.accountDataSource.delete(id);
   }
}
