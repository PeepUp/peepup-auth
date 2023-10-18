import type { TokenPayloadIdentity } from "@/types/token";
import type { ID } from "@/types/types";

class TokenPayloadBuilder {
    private ip_address: string = "";

    private device_id: string = "";

    private roles: string[] = [];

    private email: string = "";

    private id: ID = "";

    public setIpAddress(ip_address: string): TokenPayloadBuilder {
        this.ip_address = ip_address;
        return this;
    }

    public setDeviceId(device_id: string): TokenPayloadBuilder {
        this.device_id = device_id;
        return this;
    }

    public setRoles(roles: string[]): TokenPayloadBuilder {
        this.roles = roles;
        return this;
    }

    public setEmail(email: string): TokenPayloadBuilder {
        this.email = email;
        return this;
    }

    public setId(id: ID): TokenPayloadBuilder {
        this.id = id;
        return this;
    }

    public build(): TokenPayloadIdentity {
        return <TokenPayloadIdentity>{
            ip_address: this.ip_address,
            device_id: this.device_id,
            roles: this.roles,
            email: this.email,
            id: this.id,
        };
    }
}

export default TokenPayloadBuilder;
