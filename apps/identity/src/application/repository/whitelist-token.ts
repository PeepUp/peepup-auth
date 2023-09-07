import { QueryWhitelistedTokenArgs } from "@/infrastructure/data-source/token.data-source";
import {
    ID,
    Token,
    WhiteListedTokenAccessor,
    WhiteListedTokenDataSourceAdapter,
} from "@/types/types";

export class WhiteListedTokenRepository implements WhiteListedTokenAccessor {
    constructor(private readonly dataSource: WhiteListedTokenDataSourceAdapter) {}

    async findMany(): Promise<Readonly<Token[]> | null> {
        return await this.dataSource.findMany();
    }

    async findManyByIdentityId(identityId: ID): Promise<Readonly<Token[]> | null> {
        return await this.dataSource.findManyByIdentityId(identityId);
    }

    async delete(query: QueryWhitelistedTokenArgs): Promise<void> {
        return await this.dataSource.delete(query);
    }

    async deleteMany(identityId: ID): Promise<void> {
        return await this.dataSource.deleteMany(identityId);
    }
}
