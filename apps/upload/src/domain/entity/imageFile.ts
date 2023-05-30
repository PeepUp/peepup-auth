import { EXIF } from "../value-objects/exif-metadata";
import { XMP } from "../value-objects/xmp-metadata";
import { ContentFile } from "./content";
import { File, FileMetadataProps } from "./file";
import { ICC } from "../value-objects/icc-metadata";

export class ImageFile extends File<Buffer> {
   constructor(
      readonly basic: FileMetadataProps,
      private readonly metadata: Partial<ImageFileMetadata>,
      private readonly content: ContentFile<Buffer>
   ) {
      super();
      Object.assign(this.basic, basic);
      Object.assign(this.metadata, metadata);
      Object.assign(this.content, content);
   }

   async loadContent(): Promise<Buffer | unknown> {
      const result = await this.content.getValue();
      return result;
   }

   getImageFormats(): string {
      return this.basic.format;
   }

   async extractContentMetadata(): Promise<void> {
      // soon: Async/Await Promise All Array Destructuring
      const contentValue = await this.content.getValue();
      const [xmp, icc] = await Promise.all([
         {},
         {},
         /* extractEXIFContent(contentValue), */
      ]);
   }
}

export enum ImageType {
   JPG = "image/jpg",
   JPEG = "image/jpeg",
   PNG = "image/png",
   GIF = "image/gif",
}

type ImageFileMetadata = {
   exif: EXIF;
   xmp: XMP;
   icc: ICC;
};
