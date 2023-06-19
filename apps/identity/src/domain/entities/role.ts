import { AccessInfo, ID, RoleType, UserRole } from "@/common";

class Role implements UserRole {
   constructor(public type: RoleType, public permissions: AccessInfo[]) {}

   set id(id: ID) {
      this.id = id;
   }

   get id(): ID {
      return this.id;
   }
}
export default Role;
