import { Role, VolunteerResource } from "common/types";

import type { IVolunteerPolicy } from "common/types";

export class VolunteerPolicy implements IVolunteerPolicy {
   getVolunteerPolicy<T>(role: Role): T {
      if (String(role) === "VOLUNTEER") {
         return <T>Object.values(VolunteerResource);
      }

      return <T>[];
   }

   getPermission(role: Role): boolean {
      if (String(role) === "ADMIN") return true;
      return false;
   }
}
