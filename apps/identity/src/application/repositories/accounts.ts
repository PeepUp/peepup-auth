import { AccountAccessor, AccountDataSource } from "@/common";
import { Account } from "domain/entities/account";

class AccountRepository implements AccountAccessor {
   constructor(private readonly accountDataSource: AccountDataSource) {}
   createUsers(users: Account[]): Promise<Account[]> {
      throw new Error("Method not implemented.");
   }

   async getUsers(): Promise<Account[]> {
      return await this.accountDataSource.findAll();
   }

   async getUserById(id: number): Promise<Account> {
      return await this.accountDataSource.find(id);
   }

   async createUser(user: Account): Promise<Account> {
      return await this.accountDataSource.insert(user);
   }

   async updateUser(user: Account): Promise<Account> {
      return await this.accountDataSource.update(user);
   }

   async deleteUser(id: number): Promise<boolean> {
      return await this.accountDataSource.delete(id);
   }
}
