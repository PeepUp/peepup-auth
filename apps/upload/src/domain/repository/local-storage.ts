import { File } from "buffer";

export class LocalStorageRepository implements StorageService {
   private localStorage: any;
   constructor(private readonly basePath: string) {}

   public async upload(file: File): Promise<UploadResult> {
      return {
         url: `localstorage://${file.name}`,
      };
   }

   public async download(url: string): Promise<File> {
      const fileName = this.extractFileNameFromUrl(url);
      const dataUrl = this.localStorage.getItem(fileName);

      if (!dataUrl) {
         throw new Error("File not found in local storage");
      }

      const blob = await this.convertDataUrlToBlob(dataUrl);

      return new File([blob], fileName);
   }

   public async convertDataUrlToBlob(_dataUrl: any): Promise<Blob> {
      throw new Error("Method not implemented.");
   }

   // Helper methods
   private async readFileAsDataUrl(_file: File): Promise<string> {
      return new Promise((_resolve, _reject) => {
         // const reader = new FileReader();
         // reader.onload = (event: { target: { result: string } }) => {
         //    if (event.target) {
         //       const dataUrl = event.target.result as string;
         //       resolve(dataUrl);
         //    }
         // };
         // reader.onerror = (event: { target: { error: any } }) => {
         //    reject(event.target?.error ?? new Error("Unknown error "));
         // };
         // reader.readAsDataURL(file);
      });
   }

   private extractFileNameFromUrl(url: string): string {
      // Extract the file name from the URL
      // e.g. localstorage://example.txt -> example.txt
      return url.replace("localstorage://", "");
   }

   /* private async convertDataUrlToBlob(dataUrl: string): Promise<Blob> {
      const response = await fetch(dataUrl);
      const blob = await response.blob();

      return blob;
   } */
}

interface StorageService {
   upload(file: File): Promise<UploadResult>;
   download(url: string): Promise<File>;
}

interface UploadResult {
   url: string;
}
