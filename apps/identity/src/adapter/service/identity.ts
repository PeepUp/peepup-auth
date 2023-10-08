import IdentityRepository from "@/application/repository/identity";
import TokenManagementService from "@/adapter/service/tokens/token";
import { PUT_IDENTITY_BODY_SCHEMA } from "@/adapter/schema/identity";
import ResourceAlreadyExistException from "@/adapter/middleware/error/resource-exists";

import type { Identity } from "@/domain/entity/identity";
import type {
    EmailUserName,
    FindUniqeIdentityQuery,
    ID,
    RegisterIdentityBody,
    VerifyHashPasswordUtils,
} from "@/types/types";
import type { PutIdentityBody } from "@/adapter/schema/identity";

import * as utils from "@/common/utils/utils";
import IdentityFactory from "@/domain/factory/identity";
import { InactivatedIdentityBody } from "../schema/auth";
import BadRequestException from "../middleware/error/bad-request-exception";
import BadCredentialsException from "../middleware/error/bad-credential-exception";

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
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        private readonly tokenManagementService: TokenManagementService
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
    async create(payload: RegisterIdentityBody): Promise<void | Identity> {
        const { email } = payload;

        if (await this.identityRepository.getIdentity({ email })) {
            throw new ResourceAlreadyExistException("Error: Identity Already Exists!");
        }

        const identity = await this.identityRepository.create(
            IdentityFactory.defaultIdentity(payload)
        );

        if (!identity) {
            console.error("UnhandledError: failed creating new identity!");
            throw new Error("UnhandledError: failed creating new identity!");
        }

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

    async getIdentityByTraits(
        payload: FindUniqeIdentityQuery
    ): Promise<Readonly<Identity> | null> {
        const data = await this.identityRepository.getIdentity<Identity>(payload);
        return data ?? null;
    }

    /* eslint-disable-next-line class-methods-use-this */
    async verifyPassword(data: VerifyHashPasswordUtils): Promise<boolean> {
        if (!(await utils.passwordUtils.verify(data))) {
            throw new BadCredentialsException();
        }
        return true;
    }

    async checkAndAutoActivateState(
        state: string,
        activate?: boolean,
        traits?: EmailUserName
    ): Promise<boolean> {
        if (!activate && !traits) {
            if (state === "deactive") return false;
            return false;
        }

        await this.activateState({
            password: "",
            traits: {
                ...traits,
            },
            method: "password",
        });

        return true;
    }

    async deactivateState(payload: InactivatedIdentityBody): Promise<void> {
        const { password: _, traits, method } = payload;
        const identity = await this.identityRepository.getIdentity(traits);

        if (!identity) {
            throw new BadRequestException(
                "Error: identity doesn't exists, please check your fields!"
            );
        }

        if (identity.state === "deactive") return;
        if (method === "password" && _) {
            const { password: __ } = identity;
            await this.verifyPassword({ _, __ });
        }

        const data = await this.identityRepository.update(identity.id as ID, {
            ...identity,
            state: "deactive",
        });

        if (data) {
            if (data.state !== "deactive") {
                throw new BadRequestException("Error: failed to deactivate identity!");
            }
        }
    }

    async activateState(payload: InactivatedIdentityBody): Promise<void> {
        const { password: _, traits, method } = payload;
        const identity = await this.identityRepository.getIdentity(traits);

        if (!identity) {
            throw new BadRequestException(
                "Error: identity doesn't exists, please check your fields!"
            );
        }

        if (identity.state === "active") return;

        if (method === "password" && _) {
            const { password: __ } = identity;
            await this.verifyPassword({ _, __ });
        }

        const data = await this.identityRepository.update(identity.id as ID, {
            ...identity,
            state: "active",
        });

        if (data) {
            if (data.state !== "active") {
                throw new BadRequestException(
                    "Error: your identity is currently in deactivate state!"
                );
            }
        }
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
export type RegisterNewIdentity = Pick<Identity, "email" | "username" | "password">;
