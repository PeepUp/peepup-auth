import { Account } from "domain/entities/account";

export interface AccountRepository {
   getUsers(): Promise<Account[]>;
   getUserById(id: number): Promise<Account>;
   createUser(user: Account): Promise<Account>;
   createUsers(users: Account[]): Promise<Account[]>;
   updateUser(user: Account): Promise<Account>;
   deleteUser(id: number): Promise<boolean>;
}
