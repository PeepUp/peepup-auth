import TokenBuilder from "@/domain/builder/token/token.builder";
import { TokenType } from "@/common/constant";

export default class TokenDirector {
    static createRefreshToken(builder: TokenBuilder): void {
        builder.setType(TokenType.refresh);
    }

    static createAccessToken(builder: TokenBuilder): void {
        builder.setType(TokenType.access);
    }
}
