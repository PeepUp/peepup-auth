import { Prisma } from "@prisma/client";
import { TokenStatus, TokenTypes } from "@/types/types";
import { TokenType } from "@/common/constant";

export default abstract class Token {
    private value: string = "";

    private type: TokenTypes | TokenType | null = null;

    private header: Prisma.JsonValue = {};

    private payload: Prisma.JsonValue = {};

    private kid: string = "";

    private jti: string = "";

    private nbf: number = 0;

    private expires_at: number = 0;

    private tokenStatus: TokenStatus = "active";

    private expirationTime: Date = new Date();

    private createdAt: Date = new Date();

    private identityId: string | null = null;

    private device_id: string | null = null;

    private ip_address: string | null = null;
}
