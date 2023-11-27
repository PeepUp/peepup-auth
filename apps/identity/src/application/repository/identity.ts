import type { FindUniqeIdentityQuery, ID, IdentityAccessor } from "@/types/types";
import type { Identity } from "@/domain/entity/identity";
import type IdentityStoreAdapter from "@/infrastructure/data-source/identity.data-source";
import { QueryOptions } from "@/adapter/schema/db";

class IdentityRepository implements IdentityAccessor {
    constructor(private readonly dataSource: IdentityStoreAdapter) {}

    async getLoginIdentity<T = Identity>(
        query: FindUniqeIdentityQuery
    ): Promise<Readonly<T> | null> {
        const data = await this.dataSource.findUniqueLogin(query);
        return <T>data ?? null;
    }

    async getIdentity<T = Identity>(query: FindUniqeIdentityQuery): Promise<Readonly<T> | null> {
        const data = await this.dataSource.findFirst(query);
        return <T>data ?? null;
    }

    async getIdentityById<T>(id: ID): Promise<Readonly<T> | null> {
        const data = await this.dataSource.find(id);
        return <T>data ?? null;
    }

    async getIdentityByQuery<T>(
        query: Identity,
        options?: QueryOptions
    ): Promise<Readonly<T> | null> {
        const data = await this.dataSource.query(query, options);

        return <T>data ?? null;
    }

    async create<T = Identity>(identity: Identity): Promise<T | void> {
        const result = await this.dataSource.create(identity);
        return <T>result;
    }

    async update<T = Readonly<Identity>>(id: ID, identity: Identity): Promise<T | void> {
        const result = await this.dataSource.update(id, identity);
        return <T>result;
    }

    async deleteById(id: ID): Promise<void> {
        await this.dataSource.delete(id);
    }

    async getIdentities(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _?: FindUniqeIdentityQuery
    ): Promise<Readonly<Identity>[] | null> {
        const result: Readonly<Identity>[] | null = await this.dataSource.findMany();
        return result ?? null;
    }
}

export default IdentityRepository;
