import type { AccessInfo, ID, RoleContract, RoleType } from "@/types/types";

class Role implements RoleContract {
    readonly _id?: ID | undefined;

    constructor(public type: RoleType, public permissions: AccessInfo[]) {}

    get id(): ID | undefined {
        return this._id ? <ID>this._id : undefined;
    }
}

export default Role;
