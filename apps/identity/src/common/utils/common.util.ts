import type { DeepReadonly } from "@/types/utils";

export default class CommonUtil {
    public static deepFreeze<T>(obj: T): DeepReadonly<T> {
        if (typeof obj !== "object" || obj === null) return obj as DeepReadonly<T>;

        if (Array.isArray(obj)) {
            const frozenArray = obj.map((item) => CommonUtil.deepFreeze(item));
            return Object.freeze(frozenArray) as DeepReadonly<T>;
        }
        const frozenObj: { [key: string]: unknown } = {};
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                frozenObj[key] = CommonUtil.deepFreeze(obj[key]);
            }
        }

        return Object.freeze(obj) as DeepReadonly<T>;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public static assertString(input: any): void | Error {
        const isString = typeof input === "string" || input instanceof String;
        if (!isString) {
            let invalidType = typeof input;
            if (input === null) invalidType = "undefined";
            else if (invalidType === "object") invalidType = input.constructor.name;
            throw new TypeError(`Expected a string but received a ${invalidType}`);
        }
    }
}
