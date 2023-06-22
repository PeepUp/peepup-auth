import type { AccessInfo, ID, RoleType, UserRole } from "@/common";

class Role implements UserRole {
   readonly _id?: ID | undefined;

   constructor(public type: RoleType, public permissions: AccessInfo[]) {}

   get id(): ID | undefined {
      return this._id ? <ID>this._id : undefined;
   }
}

export default Role;
