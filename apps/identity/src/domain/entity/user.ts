import type { ID, UserContract } from "@/types/types";

export default class User implements UserContract {
    readonly _id?: ID | undefined;

    constructor(
        public email: string,
        public password: string,
        public firstName?: string,
        public lastName?: string,
        public phone?: string,
        public username?: string,
        public avatar?: string,
        public emailVerified?: Date,
        public salt?: string
    ) {}

    get id(): ID | undefined {
        // eslint-disable-next-line no-underscore-dangle
        return this._id ? this._id : undefined;
    }
}
