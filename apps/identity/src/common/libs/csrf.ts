import CryptoUtil from "./crypto";

export default class CSRF {
    public static generate(): string {
        const salted = CryptoUtil.createSalt(32);
        const secure = CryptoUtil.generateRandomString(32);
        const hash = CryptoUtil.generateRandomSHA512(secure);
        const secureSafed = CryptoUtil.safeBase64Buffer(Buffer.from(hash));

        return String(`${secureSafed}.${salted}`);
    }

    public static verify(token1: string, token2: string): boolean {
        const [secret1] = token1.split(".");
        const [secret2] = token2.split(".");

        return secret1 === secret2;
    }

    public static update(token: string) {
        const [secureSafed] = token.split(".");
        const salt = CryptoUtil.createSalt(32);

        return String(`${secureSafed}.${salt}`);
    }
}
