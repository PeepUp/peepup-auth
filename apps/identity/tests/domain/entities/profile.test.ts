import { UserProps } from "common/types";
import { UserProfile } from "../../../src/domain/entities/profile";

describe("Entity", () => {
   describe("create()", () => {
      it("should create a new user profile with the given data", () => {
         const userProps: UserProps = {
            name: "John Doe",
            username: "johndoe",
            email: "johndoe@example.com",
            emailVerified: new Date(),
            password: "password",
            phone: "123-456-7890",
            image: "image.png",
            id: 1,
         };

         const userProfile = UserProfile.create(userProps);
         expect(userProfile.id).toEqual(userProps.id);
         expect(userProfile.name).toEqual(userProps.name);
         expect(userProfile.email).toEqual(userProps.email);
         expect(userProfile.image).toEqual(userProps.image);
         expect(userProfile.phone).toEqual(userProps.phone);
         expect(userProfile.password).toEqual(userProps.password);
         expect(userProfile.emailVerified).toEqual(userProps.emailVerified);
         expect(userProfile.username).toEqual(userProps.username);
      });

      it("should throw an error if the email address is invalid format", () => {});
   });
});
