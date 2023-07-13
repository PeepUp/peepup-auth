/* import { join } from "path";
import Certificate from "../../common/utils/certs";
import { fileUtils } from "../../common/utils/utils";
import { cryptoUtils } from "../../common/utils/crypto";

import type { Identity } from "@/types/main";
 */
/* async function setupCertsToken(type: string) {
    const keysDir = fileUtils.checkDirectory("keys");
    const wellKnownDir = fileUtils.checkDirectory("public/.well-known");

    if (keysDir) {
        const rsaKeysId = fileUtils.getFolderNames("keys/RSA");
        const ecsdaKeysId = fileUtils.getFolderNames("keys/ECSDA");
    }

    if (!keysDir) {
        const rsa256KeyId = cryptoUtils.generateRandomSHA256(32);
        const escdaKeyId = cryptoUtils.generateRandomSHA256(32);
        const { privateKey, publicKey } = JOSEToken.generateKeyPairRSA(4096, rsa256KeyId);
        console.log(privateKey, publicKey);
        return;
    }
} */

/* const checkKeysDirectory = fileUtils.checkDirectory("keys");
const path = join(process.cwd(), "/keys");

const ecsda: Certificate = new Certificate(path);
const rsa256: Certificate = new Certificate(path);

let rsa256KeyId = cryptoUtils.generateRandomSHA256(32);
let ecsdaKeyId = cryptoUtils.generateRandomSHA256(32);

if (!checkKeysDirectory) {
    const rsa256Certs = rsa256.generateKeyPairRSA(4096);
    rsa256.saveKeyPair(rsa256Certs, `${path}/RSA/${rsa256KeyId}`);

    const ecsdaCerts = ecsda.generateKeyPairECDSA("prime256v1");
    ecsda.saveKeyPair(ecsdaCerts, `${path}/ECSDA/${ecsdaKeyId}`);
}

if (checkKeysDirectory) {
    console.log("keys directory exist");
    rsa256KeyId = fileUtils.getFolderNames("keys/RSA");
    ecsdaKeyId = fileUtils.getFolderNames("keys/ECSDA");
}

const certs: Identity.Config.Certs = {
    rsa: {
        keyId: rsa256KeyId,
        privateKey: rsa256.getPublicKey(),
        publicKey: rsa256.getPublicKey(),
    },
    ecsda: {
        keyId: ecsdaKeyId,
        privateKey: ecsda.getPrivateKey(),
        publicKey: ecsda.getPublicKey(),
    },
};

export default certs; */
