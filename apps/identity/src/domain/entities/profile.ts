import { Entity } from "../base/entity";
import type { UserProps } from "common/types";

export type UserPropsWithId = UserProps & { id: number };

export class UserProfile extends Entity<Readonly<UserProps>> {
   constructor(data: UserProps) {
      super(data);
   }

   public static create({
      email,
      emailVerified,
      image,
      name,
      password,
      phone,
      username,
      id,
   }: UserProps): Readonly<UserProps> {
      const data = new UserProfile({
         email,
         emailVerified,
         image,
         name,
         password,
         phone,
         username,
         id,
      });

      return data.props;
   }

   get id(): number {
      return this.id;
   }

   get email(): string {
      return this.email;
   }

   set setemail(email: Required<UserProps["email"]>) {
      this.email = email;
   }
   set emailVerified(date: Required<Date>) {
      this.emailVerified = date;
   }

   set username(user_name: Required<UserProps["username"]>) {
      this.username = user_name;
   }

   set email(email: Required<UserProps["email"]>) {
      this.email = email;
   }

   get user(): Readonly<UserProfile> {
      return this;
   }

   public equals(props: UserProfile): boolean {
      return super.equals(props);
   }
}
