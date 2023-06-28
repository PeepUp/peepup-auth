import { Identity } from "../entity/identity";

class IdentityFactory {
    public static createIdentity(identity: Identity): Identity {
        return <Identity>{};
    }
}

export default IdentityFactory;
