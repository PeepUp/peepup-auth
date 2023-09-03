/* eslint-disable */

import argon2 from "argon2";
import { randomBytes } from "crypto";
import * as fs from "fs";
import * as fastify from "fastify";
import { join } from "path";

import type { HashPasswordUtils, VerifyHashPasswordUtils } from "@/types/types";
import { ip_schema } from "../../adapter/schema/auth";

export const fileUtils = {
    readFile(path: string, encoding: BufferEncoding): string {
        try {
            return fs.readFileSync(path, encoding ?? "utf-8");
        } catch (error) {
            throw new Error(`File not found: ${path}`);
        }
    },
    checkDirectory(path: string): boolean {
        try {
            return fs.statSync(path).isDirectory();
        } catch (error) {
            return false;
        }
    },
    checkFileExists(filePath: string): boolean {
        try {
            fs.accessSync(filePath, fs.constants.F_OK);
            return true;
        } catch (err) {
            throw new Error(`File not found: ${filePath}`);
        }
    },
    countFilesAndDirectories(path: string): { files: number; directories: number } {
        try {
            let files = 0;
            let directories = 0;

            const entries = fs.readdirSync(path, { withFileTypes: true });

            for (const entry of entries) {
                if (entry.isDirectory()) {
                    directories++;
                } else if (entry.isFile()) {
                    files++;
                }
            }

            return { files, directories };
        } catch (error) {
            throw new Error(`Directory not found: ${path}`);
        }
    },
    getFolderNames(directoryPath: string): string[] {
        const folderNames: string[] = [];

        const entries = fs.readdirSync(directoryPath, { withFileTypes: true });
        for (const entry of entries) {
            if (entry.isDirectory()) {
                folderNames.push(entry.name);
            }
        }

        return folderNames;
    },
    deleteFolderRecursive,
};

function deleteFolderRecursive(directoryPath: string) {
    if (fs.existsSync(directoryPath)) {
        fs.readdirSync(directoryPath).forEach((file, index) => {
            const curPath = join(directoryPath, file);
            if (fs.lstatSync(curPath).isDirectory()) {
                deleteFolderRecursive(curPath);
            } else {
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(directoryPath);
    }
}

export const passwordUtils = {
    async hash(data: HashPasswordUtils): Promise<string> {
        /**
         * @argument data.salt
         * @argument data._
         *
         * @readme
         *  [Warn!] DON'T CHANGE this order of arguments because
         *  it will not respect the readonly type of the
         *  first argument (string) and will be able to change it
         *  to a string with a method replace*() or other methods
         *  that change the string value (not the reference)
         */
        try {
            const hashedPassword = await argon2.hash(data._, {
                salt: Buffer.from(data.salt, "hex"),
            });

            return hashedPassword;
        } catch (error) {
            // Handle any errors
            throw new Error("Password hashing failed");
        }
    },

    async verify(data: VerifyHashPasswordUtils): Promise<boolean> {
        try {
            /**
             * @argument data.__
             * @argument data._
             *
             * @readme
             *  [Warn!] DON'T CHANGE! this order of arguments because
             *  it will not respect the readonly type of the
             *  first argument (string) and will be able to change it
             *  to a string with a method replace*() or other methods
             *  that change the string value (not the reference)
             */
            return await argon2.verify(data.__, data._);
        } catch (error) {
            throw new Error("Password verification failed");
        }
    },

    async generateSalt(length = 16): Promise<string> {
        return new Promise((resolve, reject) => {
            randomBytes(length, (err, buffer) => {
                if (err) {
                    reject(err);
                } else {
                    const salt = buffer.toString("hex");
                    resolve(salt);
                }
            });
        });
    },
};

export const httpUtils = {
    getIpAddress(request: fastify.FastifyRequest): string {
        let ipAddress: string = request.ip;

        return ip_schema.safeParse(ipAddress).success === true ? ipAddress : "";
    },
    getAuthorizationToken(data: {
        value: string;
        authType?: string;
        checkType?: boolean;
    }): string {
        const { value, authType, checkType } = data;

        if (value === "") return "";

        const token = value.split(" ");

        if (token.length !== 2) return "";

        if (!token[1]) return "";

        if (!checkType && !authType) {
            return token[1];
        }

        if (!token[0] || token[0] !== authType) return "";

        return token[1];
    },
    parseCookies(value: string): { [key: string]: string } | null {
        if (value == undefined) return null;

        const splited = value.split(";");

        if (!splited || splited.length === 0) {
            return null;
        }

        const cookies: Record<string, string> = splited.reduce(
            (acc: Record<string, string>, item) => {
                const [key, value] = item.trim().split("=");
                if (key && value) {
                    acc[key] = value;
                }
                return acc;
            },
            {}
        );

        return cookies;
    },
};

export const environmentUtils = {
    isProduction(): boolean {
        return process.env.NODE_ENV === "production";
    },
    isDevelopment(): boolean {
        return process.env.NODE_ENV === "development";
    },
    isTest(): boolean {
        return process.env.NODE_ENV === "test";
    },
};
