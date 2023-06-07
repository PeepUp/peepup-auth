import { AccountEntity } from "domain/entities/account";

export interface AccountRepository {
   getUsers(): Promise<AccountEntity[]>;
   getUserById(id: number): Promise<AccountEntity>;
   getUserByUsername(username: string): Promise<AccountEntity>;
   getUserByEmail(email: string): Promise<AccountEntity>;
   getUserByPhone(phone: string): Promise<AccountEntity>;
   getUserByProviderId(providerId: string): Promise<AccountEntity>;
   getUserByProviderName(providerName: string): Promise<AccountEntity>;
   createUser(user: AccountEntity): Promise<AccountEntity>;
   createUsers(users: AccountEntity[]): Promise<AccountEntity[]>;
   updateUser(user: AccountEntity): Promise<AccountEntity>;
   deleteUser(id: number): Promise<boolean>;
}
