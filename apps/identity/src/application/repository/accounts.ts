import type {
   AccountAccessor,
   AccountDataSource,
   ID,
   UserAccount,
} from "@/common";

export class AccountRepository implements AccountAccessor {
   constructor(private readonly accountDataSource: AccountDataSource) {}

   async getAllAccount<Q>(query?: Q): Promise<UserAccount[]> {
      return await this.accountDataSource.query(query as UserAccount);
   }

   async getAccountById(id: ID): Promise<UserAccount> {
      return await this.accountDataSource.findById(id);
   }

   async getAccount(user: UserAccount): Promise<UserAccount> {
      return await this.accountDataSource.find(user);
   }

   async getAccountByEmail(email: string): Promise<UserAccount> {
      return await this.accountDataSource.findByEmail(email);
   }

   async createAccount(user: UserAccount): Promise<UserAccount> {
      return await this.accountDataSource.insert(user);
   }

   async updateAccount(user: UserAccount): Promise<UserAccount> {
      return await this.accountDataSource.update(user);
   }

   async deleteAccount(id: ID): Promise<boolean> {
      return await this.accountDataSource.delete(id);
   }
}
