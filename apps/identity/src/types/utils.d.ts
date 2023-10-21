export interface ReadFileOptions {
    withFileTypes?: true;
    recursive?: boolean | undefined;
}

export interface CountingFileAndDirectory {
    files: number;
    directories: number;
}

export interface GetAuthroizationTokenArgs {
    value: string;
    options?: {
        authType?: string;
        checkType?: boolean;
    };
}
export interface ReadFileOptionsArgs {
    readonly path: string;
    readonly encoding?: BufferEncoding | null;
    readonly flag?: string | null;
}

export type DeepReadonly<T> = {
    readonly [P in keyof T]: DeepReadonly<T[P]>;
};
