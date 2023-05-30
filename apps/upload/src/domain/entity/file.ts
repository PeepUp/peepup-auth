import { NoSqlFileId, SqlFileId } from "@/domain/value-objects/fileId";

export abstract class File<Type> {
   abstract loadContent(): Promise<Type | unknown>;
}

export type FileMetadataProps = {
   id: SqlFileId | NoSqlFileId;
   size: number;
   name: string;
   updated_at: number;
   created_at: number;
   format: string;
   lastModified: number;
   sharableLink: string;
   path: string;
};

type FileResponseToOmit = Pick<
   FileMetadataProps,
   "id" | "created_at" | "updated_at" | "path"
>;

export type ResponseFileMetadataProps = Omit<
   FileMetadataProps,
   keyof FileResponseToOmit
>;
