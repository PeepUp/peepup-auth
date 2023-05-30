import { randomString } from "@/common/randomNumber";
import type { Request } from "express";
import fs from "fs";
import { ImageFile, ImageType } from "../entity/imageFile";
import { BadRequestError } from "../logic/baseError";
import { LocalStorageRepository } from "../repository/local-storage";

export class ImageUploadService {
   private readonly UPLOAD_IMAGE_FILE_PATH = "./uploads";
   private readonly localStorage: LocalStorageRepository;
   private static allowedImageTypes: Set<string> = new Set(
      Object.values(ImageType)
   );

   static validateImageType(req: Request): void {
      const file = req.body;

      if (!file) {
         throw new BadRequestError("Image file not provided");
      }

      if (!(file instanceof ImageFile)) {
         throw new BadRequestError("Invalid image type");
      }
   }

   async uploadImage(image: ImageFile): Promise<string> {
      try {
         const fileExtension = image.basic.name?.split(".").pop();
         const fileName = `${Date.now()}.${await randomString(
            6
         )}.${fileExtension}`;
         const filePath = `${this.UPLOAD_IMAGE_FILE_PATH}/${fileName}`;

         const file = fs.createWriteStream(filePath);
         return "";
      } catch (error) {
         return "";
      }
   }
}
