import * as fs from "fs";
import type {
    ReadFileOptionsArgs,
    ReadFileOptions,
    CountingFileAndDirectory,
} from "@/types/utils";

export default class FileUtil {
    private static readonly DEFAULT_ENCODING: BufferEncoding = "utf-8";

    public static readFile(args: ReadFileOptionsArgs): string {
        const { path, encoding } = args;
        if (!this.checkFile(path)) throw new Error(`File in path: ${path} not found!`);
        return fs.readFileSync(path, encoding ?? this.DEFAULT_ENCODING);
    }

    public static checkDir(path: string): boolean {
        return fs.statSync(path).isDirectory();
    }

    public static checkFile(path: string): boolean {
        fs.accessSync(path, fs.constants.F_OK);
        return true;
    }

    public static count(path: string): CountingFileAndDirectory {
        if (!FileUtil.checkFile(path)) {
            throw new Error(`File in path: ${path} not found!`);
        }

        let files: number = 0;
        let directories: number = 0;
        const data = fs.readdirSync(path, { withFileTypes: true, recursive: true });

        for (const v of data) {
            if (v.isDirectory()) directories += 1;
            else if (v.isFile()) files += 1;
        }

        return { files, directories };
    }

    public static getDir(path: string, opts?: ReadFileOptions): string[] {
        const dir: Array<string> = [];
        const data = fs.readdirSync(path, {
            withFileTypes: true,
            recursive: opts?.recursive ?? true,
        });

        for (const v of data) if (v.isDirectory()) dir.push(v.name);
        return dir;
    }

    public static deleteDir(path: string) {
        if (fs.existsSync(path)) {
            fs.readdirSync(path).forEach((file) => {
                const curPath = `${path}/${file}`;
                if (fs.lstatSync(curPath).isDirectory()) this.deleteDir(curPath);
                else fs.unlinkSync(curPath);
            });
            fs.rmdirSync(path);
        }
    }
}
