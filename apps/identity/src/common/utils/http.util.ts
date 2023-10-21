import { ip_schema } from "@/adapter/schema/auth";
import { FastifyRequest } from "fastify";

import type { GetAuthroizationTokenArgs } from "@/types/utils";

export default class HTTPUtil {
    public static getIpAddress(request: Readonly<FastifyRequest>): string {
        const { ip } = request;
        return ip_schema.safeParse(ip).success === true ? ip : "";
    }

    public static getAuthorization(payload: GetAuthroizationTokenArgs): string {
        const { value, options } = payload;
        if (value === "") return "";
        const token = value.split(" ");
        if (token.length !== 2) return "";
        if (!token[1]) return "";
        if (options) {
            if (!options.checkType && !options.authType) return token[1];
            if (!token[0] || token[0] !== options.authType) return "";
        }

        return token[1];
    }

    public static parseCookies(cookie: string): { [key: string]: string } {
        if (!cookie || cookie === undefined) return {};
        const splited = cookie.split(";");
        if (!splited || splited.length === 0) return {};

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
    }
}
