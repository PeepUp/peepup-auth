/* eslint-disable no-underscore-dangle */

import argon2 from "argon2";
import { randomBytes } from "crypto";

import type { HashPasswordUtils, VerifyHashPasswordUtils } from "@/types/types";
import CryptoUtil from "../lib/crypto";

export default class PasswordUtil {
    private static readonly DEFAULT_ENCODING: BufferEncoding = "hex";

    private static readonly DEFAULT_SALT_LENGTH: number = 16;

    public static async hash(data: HashPasswordUtils): Promise<string> {
        /**
         * @argument data.salt : string
         * @argument data._    : string
         *
         * @readme
         *  [Warn!] DON'T CHANGE this order of arguments because
         *  it will not respect the readonly type of the
         *  first argument (string) and will be able to change it
         *  to a string with a method replace*() or other methods
         *  that change the string value (not the reference)
         */
        try {
            const { salt, _ } = data;
            return CryptoUtil.encryptData({
                value: await argon2.hash(_, {
                    salt: Buffer.from(salt, this.DEFAULT_ENCODING),
                }),
            });
        } catch (error) {
            throw new Error("Password hashing failed");
        }
    }

    public static async verify(data: VerifyHashPasswordUtils): Promise<boolean> {
        try {
            /**
             * @argument data.__ (encrypted)
             * @argument data._  (not encrypted)
             *
             * @readme
             *  [Warn!] DON'T CHANGE! this order of arguments because
             *  it will not respect the readonly type of the
             *  first argument (string) and will be able to change it
             *  to a string with a method replace*() or other methods
             *  that change the string value (not the reference)
             */

            return await argon2.verify(
                CryptoUtil.decryptData({ value: data.__ }),
                data._
            );
        } catch (error) {
            throw new Error("Password verification failed");
        }
    }

    public static async generateSalt(length = this.DEFAULT_SALT_LENGTH): Promise<string> {
        return new Promise((resolve, reject) => {
            randomBytes(length, (error, buffer) => {
                if (error) reject(error);
                else {
                    const salt = buffer.toString(this.DEFAULT_ENCODING);
                    resolve(salt);
                }
            });
        });
    }
}
