import Account from "@/domain/entity/account";

import type { UserAccount, UserProfile } from "common/types";

describe("Account Entity", () => {
   let account: Account;
   let userProfileProps: UserProfile = {
      name: "John Doe",
      username: "johndoe",
      email: "johndoe@example.com",
      emailVerified: new Date(),
      password: "password",
      phone: "123-456-7890",
      avatar: "image.png",
   };

   it("should create a new user account with the given data", () => {
      const userAccountProps: UserAccount = {
         roles: [],
         tokens: [],
         profile: userProfileProps,
         providerId: 1,
      };

      account = new Account(userAccountProps);

      expect(account.profile).toEqual({
         name: "John Doe",
         username: "johndoe",
         email: "johndoe@example.com",
         emailVerified: userProfileProps.emailVerified,
         password: "password",
         phone: "123-456-7890",
         avatar: "image.png",
      });

      expect(account.roles).toEqual(userAccountProps.roles);
      expect(account.tokens).toEqual(userAccountProps.tokens);
      expect(account.providerId).toEqual(userAccountProps.providerId);
   });

   it("should get the account ID and return undefined because the property of _id is not generate from database", () => {
      expect(account._id).toBe(undefined);
   });

   it("should have a createdAt date", () => {
      expect(account.createdAt).toBeInstanceOf(Date);
   });

   it("should add a token to the tokens array", () => {
      expect(account.tokens).toEqual([]);

      const newToken = "token123";
      account.tokens.push(newToken);

      expect(account.tokens).toContain(newToken);
   });
});
