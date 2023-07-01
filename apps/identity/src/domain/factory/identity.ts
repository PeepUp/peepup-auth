import type { Identity } from "../entity/identity";

class IdentityFactory {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public static createIdentity(identity: Identity): Identity {
        return <Identity>{};
    }
}

export default IdentityFactory;
