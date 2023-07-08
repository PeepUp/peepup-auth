import type { AccessInfo, ID, RoleContract, RoleType } from "@/types/types";

class Role implements RoleContract {
    constructor(
        public type: RoleType,
        public permissions: AccessInfo[]
    ) {}

    get id(): ID | undefined {
        return this.id ? <ID>this.id : undefined;
    }
}

export default Role;
