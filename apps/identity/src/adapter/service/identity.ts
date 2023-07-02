import type { FindUniqeIdentityQuery } from "@/types/types";
import type { Identity } from "@/domain/entity/identity";
import TokenManagementService from "./token";
import { PUT_IDENTITY_BODY_SCHEMA } from "../schema/identity";
import IdentityRepository from "../../application/repository/identity";
import ResourceAlreadyExistException from "../middleware/error/resource-exists";

import type { LoginIdentityBody, RegisterIdentityBody } from "../schema/auth";
import type { PutIdentityBody } from "../schema/identity";

export type IdentityRegistration = Pick<Identity, "email" | "password">;
export type IdentityResponse = Omit<Identity, "password">;
export type IdentityDataOmittedValue =
    | "password"
    | "providerId"
    | "phoneNumber"
    | "updatedAt";
export type IdentityOmitted = Omit<Identity, IdentityDataOmittedValue>;

export interface IdentityManagementService {
    getIdentityByQuery: (query: FindUniqeIdentityQuery) => Promise<Identity | null>;
    getIdentityById: (id: string) => Promise<Identity | null>;
    getIdentities: () => Promise<Identity[] | null>;
}

/*
 * @todo:
 *  ☐ make type for class IdentityService
 *  ☐ where should I put the validation?
 *  ☐ make factory to encapsulte creating identity object
 *  ☐ don't identity already exists
 *  ☐ separate the logic of authentication and identity management
 *  ☐ implement type for IdentityManagementServiceType
 *
 * */
class IdentityService {
    constructor(
        private readonly identityRepository: IdentityRepository,
        // eslint-disable-next-line @typescript-eslint/no-shadow
        private tokenManagementService: TokenManagementService
    ) {}

    /**
     * @todo:
     *  ☐ validate email
     *  ☐ validate password
     *  ☐ hash password
     *  ☐ check identity already exists
     *
     *  @figure
     *   🤔
     *
     * */
    async registration(body: RegisterIdentityBody): Promise<void> {
        const { traits, password } = body;

        const existingIdentity = await this.identityRepository.getIdentity<Identity>(
            traits
        );

        if (existingIdentity !== null) {
            throw new ResourceAlreadyExistException("identity already exists");
        }

        const identity: Identity = {
            id: "",
            email: <string>traits.email,
            password,
            avatar: "",
            username: <string>traits.username ?? <string>traits.email?.split("@")[0],
            lastName: "",
            firstName: "",
            phoneNumber: null,
            state: "active",
            providerId: null,
            emailVerified: null,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const data = await this.identityRepository.create<Identity>(identity);

        if (!data) {
            throw new Error("Error: cannot creating identity");
        }
    }

    async login(body: LoginIdentityBody): Promise<Readonly<IdentityOmitted> | null> {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { traits, password, method, password_identifier } = body;
        const identity = await this.identityRepository.getLoginIdentity<Identity>({
            where: traits,
            data: { password },
        });

        if (identity === null) return null;

        return identity;
    }

    async getIdentities(): Promise<Readonly<IdentityOmitted>[] | null> {
        const data = await this.identityRepository.getIdentities();

        if (!data) return data;

        const result = data.map((identity) => {
            const {
                password,
                providerId,
                phoneNumber,
                updatedAt,
                ...rest
            }: typeof identity = identity;

            return rest;
        });

        return result ?? null;
    }

    /**
     * @todo
     *    ☐ data identity must be set to readonly
     *    ☑ [DONE]: make this method return IdentityOmitted type
     *    ☑ [DONE]: make this method dont spoil the password attribute
     */

    async getIdentityById(id: string): Promise<Readonly<IdentityOmitted> | null> {
        const data = await this.identityRepository.getIdentityById<Identity>(id);
        if (data === null) return data;

        const { password, providerId, phoneNumber, updatedAt, ...result }: typeof data =
            data;
        return result;
    }

    async getIdentityByQuery(
        query: FindUniqeIdentityQuery
    ): Promise<Readonly<IdentityOmitted> | null> {
        const data = await this.identityRepository.getIdentity<Identity>(query);
        if (!data) return data;

        const { password, providerId, phoneNumber, updatedAt, ...result }: typeof data =
            data;

        return result;
    }

    async updateIdentityById(
        id: string,
        data: PutIdentityBody
    ): Promise<Readonly<IdentityOmitted> | null> {
        // @todo check if identity exists before update
        const identity = await this.identityRepository.getIdentityById<Identity>(id);

        if (!identity) {
            return null;
            // throw new BadRequestException(`identity with id ${id} doesn't exists`);
        }

        // @todo validate date before update
        const parsedData = PUT_IDENTITY_BODY_SCHEMA.safeParse(data);

        if (!parsedData.success) {
            return null;
            // throw new BadRequestException(`invalid data: ${parsedData.error.message}`);
        }

        // @todo [SOON] implement update identity logic

        const toBeUpdatedIdentity: Readonly<Identity> = {
            ...identity,
            lastName: parsedData.data.lastName ?? identity.lastName,
            firstName: parsedData.data.firstName ?? identity.firstName,
            avatar: parsedData.data.avatar ?? identity.avatar,
        } as const;

        console.log({ toBeUpdatedIdentity });

        // @todo [SOON] delete assertion below
        const updatedIdentity: Readonly<Identity> | void =
            await this.identityRepository.update<Readonly<Identity>>(
                id,
                toBeUpdatedIdentity
            );

        if (!updatedIdentity) {
            return null;
        }

        const {
            password,
            providerId,
            phoneNumber,
            updatedAt,
            ...result
        }: typeof updatedIdentity = updatedIdentity;

        // @todo [SOON] what should I return type of error if identity not updated?
        if (Object.entries(result).length === 0) {
            return result;
            // throw new Error("Error: cannot update identity");
        }

        return result;
    }

    async deleteIdentityById(id: string): Promise<boolean> {
        // @todo check if identity exists before delete

        const identity = await this.getIdentityById(id);

        if (!identity) {
            return false;
            // throw new BadRequestException(`identity with id ${id} doesn't exists`);
        }

        await this.identityRepository.deleteById(id);

        return true;
    }
}

export default IdentityService;
