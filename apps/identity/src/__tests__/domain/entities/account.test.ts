import { Account } from "domain/entities/account";

import type { AccountProps, UserProps } from "common/types";
import { UserProfile } from "domain/entities";

describe("Account Entity", () => {
   describe("constructor()", () => {
      it("should create a new user account with the given data", () => {
         const userProfileProps: UserProps = {
            name: "John Doe",
            username: "johndoe",
            email: "johndoe@example.com",
            emailVerified: new Date(),
            password: "password",
            phone: "123-456-7890",
            avatar: "image.png",
         };

         const userProfile = new UserProfile(
            "John Doe",
            "johndoe",
            "johndoe@example.com",
            new Date(),
            "password",
            "123-456-7890",
            "image.png"
         );

         const userAccountProps: AccountProps = {
            roles: [],
            tokens: [],
            profile: userProfile,
            providerId: 1,
         };

         const userAccount = new Account(userAccountProps);

         expect(userAccount.profile).toEqual(userProfileProps);
         expect(userAccount.roles).toEqual(userAccountProps.roles);
         expect(userAccount.tokens).toEqual(userAccountProps.tokens);
         expect(userAccount.providerId).toEqual(userAccountProps.providerId);
      });
   });
});
