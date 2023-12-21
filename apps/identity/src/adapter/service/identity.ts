import type { Identity } from "@/domain/entity/identity";
import type { InactivatedIdentityBody } from "@/adapter/schema/auth";
import type IdentityRepository from "@/application/repository/identity";

import type {
    GetIdentitiesQuery,
    IdentityQueryPartial,
    PutIdentityBody,
} from "@/adapter/schema/identity";

import type {
    ID,
    EmailUserName,
    FindUniqeIdentityQuery,
    RegisterIdentityBody,
    VerifyHashPasswordUtils,
} from "@/types/types";

import PasswordUtil from "@/common/utils/password.util";
import IdentityFactory from "@/domain/factory/identity";
import BadRequestException from "@/adapter/middleware/errors/bad-request-exception";
import BadCredentialsException from "@/adapter/middleware/errors/bad-credential-exception";
import UnprocessableContentException from "@/adapter/middleware/errors/unprocessable-content-exception";
import ResourceAlreadyExistException from "@/adapter/middleware/errors/resource-already-exists-execption";
import { PUT_IDENTITY_BODY_SCHEMA } from "@/adapter/schema/identity";
import TokenManagementService from "./tokens/token";

class IdentityService {
    constructor(
        private readonly identityRepository: IdentityRepository,
        private readonly tokenManagementService: TokenManagementService
    ) {}

    async create(payload: RegisterIdentityBody): Promise<void | Identity> {
        const { email, phoneNumber: phone_number } = payload;

        const findIdentity = await this.getIdentityByQuery({
            email,
        });

        if (findIdentity) {
            throw new ResourceAlreadyExistException("Error: Identity already exists!");
        }

        const identity = await this.identityRepository.create(
            IdentityFactory.defaultIdentity({ ...payload, phoneNumber: phone_number })
        );

        if (!identity) {
            throw new UnprocessableContentException("Error: failed create new identity");
        }
    }

    async getIdentities(): Promise<Readonly<IdentityOmitted>[] | null> {
        const data = await this.identityRepository.getIdentities();

        if (!data) return data;

        const result = data.map((identity) => {
            const { password, providerId, phoneNumber, updatedAt, ...rest }: typeof identity =
                identity;

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

        const { password, providerId, phoneNumber, updatedAt, ...result }: typeof data = data;
        return result;
    }

    async getIdentityPreview(uid: string): Promise<Readonly<any> | null> {
        const data = await this.identityRepository.getIdentityById<Identity>(uid);
        if (data === null) return data;

        const { id, avatar, username, firstName, lastName, ...result }: typeof data = data;

        return {
            id,
            avatar,
            username,
            firstName,
            lastName,
        };
    }

    async getMe(authorization: string): Promise<Readonly<Identity> | null> {
        const decoded = this.tokenManagementService.decodeToken(
            this.tokenManagementService.splitAuthzHeader(authorization)
        );

        if (!decoded) {
            throw new BadCredentialsException();
        }

        const data = await this.identityRepository.getIdentityById<Identity>(decoded.id);

        if (!data) {
            return null;
        }

        const {
            password,
            providerId,
            phoneNumber,
            updatedAt,
            emailVerified,
            createdAt,
            ...result
        }: typeof data = data;
        const resultData = result as Readonly<Identity>;

        return resultData ?? null;
    }

    async getIdentityByTraits(payload: IdentityQueryPartial): Promise<Readonly<Identity> | null> {
        const data = await this.identityRepository.getIdentity<Identity>(payload);
        return data ?? null;
    }

    /* eslint-disable-next-line class-methods-use-this */
    async verifyPassword(data: VerifyHashPasswordUtils): Promise<boolean> {
        if (!(await PasswordUtil.verify(data))) {
            throw new BadCredentialsException();
        }

        return true;
    }

    async checkAndAutoActivateState({
        state,
        activate,
        traits,
    }: {
        state: string;
        activate?: boolean;
        traits?: EmailUserName;
    }): Promise<boolean> {
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
        query: GetIdentitiesQuery
    ): Promise<Readonly<Array<IdentityOmitted>> | null> {
        if (Object.keys(query).length === 0) {
            throw new BadRequestException("Error: query cannot be empty!");
        }

        const data = await this.identityRepository.getIdentityByQuery<Array<Identity> | Identity>(
            {
                id: query.id as string,
                email: query.email as string,
                username: query.username as string,
            } as Identity,
            {
                select: query.select,
                take: query.take,
            }
        );

        if (!data) return data;

        let result: Readonly<Array<IdentityOmitted>> | null = null;

        if (data && Array.isArray(data) && data.length > 0) {
            result = data.map((identity: Identity) => {
                const { password, providerId, phoneNumber, updatedAt, ...rest }: typeof identity =
                    identity;

                return rest;
            });
        }

        return result ?? null;
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
        const updatedIdentity: Readonly<Identity> | void = await this.identityRepository.update<
            Readonly<Identity>
        >(id, toBeUpdatedIdentity);

        if (!updatedIdentity) {
            return null;
        }

        const { password, providerId, phoneNumber, updatedAt, ...result }: typeof updatedIdentity =
            updatedIdentity;

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
export type IdentityDataOmittedValue = "password" | "providerId" | "phoneNumber" | "updatedAt";
export type IdentityOmitted = Omit<Identity, IdentityDataOmittedValue>;
export interface IdentityManagementService {
    getIdentityByQuery: (query: FindUniqeIdentityQuery) => Promise<Identity | null>;
    getIdentityById: (id: string) => Promise<Identity | null>;
    getIdentities: () => Promise<Identity[] | null>;
}
export type RegisterNewIdentity = Pick<Identity, "email" | "username" | "password">;
