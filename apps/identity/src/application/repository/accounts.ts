import type {
   AccountAccessor,
   AccountContract,
   AccountDataSource,
   CreateAccountInput,
   ID,
} from "@/common";

export class AccountRepository implements AccountAccessor {
   constructor(private readonly accountDataSource: AccountDataSource) {}

   async getAllAccount<Q>(query?: Q): Promise<AccountContract[]> {
      return await this.accountDataSource.query(query as AccountContract);
   }

   async getAccountById(id: ID): Promise<AccountContract> {
      return await this.accountDataSource.findById(id);
   }

   async getAccount(user: AccountContract): Promise<AccountContract> {
      return await this.accountDataSource.find(user);
   }

   async getAccountByEmail(email: string): Promise<AccountContract> {
      return await this.accountDataSource.findByEmail(email);
   }

   async createAccount(user: CreateAccountInput): Promise<AccountContract> {
      return await this.accountDataSource.insert(user);
   }

   async updateAccount(user: AccountContract): Promise<AccountContract> {
      return await this.accountDataSource.update(user);
   }

   async deleteAccount(id: ID): Promise<boolean> {
      return await this.accountDataSource.delete(id);
   }
}
