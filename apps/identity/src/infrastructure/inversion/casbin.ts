import { newEnforcer } from "casbin";
import { join } from "path";
import { cwd } from "@/common/constant";

class Casbin {
    /* eslint-disable class-methods-use-this */
    private getModelPath(): string {
        return join(cwd, "src", "domain", "model", "casbin", "rbac_with_domain_model.conf");
    }

    /* eslint-disable class-methods-use-this */
    private getPolicyPath(): string {
        return join(cwd, "src", "domain", "model", "casbin", "rbac_with_domain_policy.csv");
    }

    async init(): Promise<void> {
        try {
            const enforcer = await newEnforcer(this.getModelPath(), this.getPolicyPath());
            await enforcer.getRolesForUser("alice");
        } catch (error) {
            if (error) console.dir(error, { depth: Infinity });
            throw new Error("Error setting up CasbinRBACWithDomain");
        }
    }
}

export default Casbin;
