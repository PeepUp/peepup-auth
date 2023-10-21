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
}
