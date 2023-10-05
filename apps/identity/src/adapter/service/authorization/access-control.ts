// Purpose: Service for access control.

import { AccessControl } from "@/domain/entity/access-control";

class AccessControlService {
    /* eslint-disable class-methods-use-this */
    getAccessControl(): AccessControl {
        return {} as AccessControl;
    }

    /* eslint-disable class-methods-use-this */
    checkPermission(): boolean {
        return false;
    }
}

export default AccessControlService;
