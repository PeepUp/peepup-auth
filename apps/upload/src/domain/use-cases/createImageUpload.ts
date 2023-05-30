import { UploadRepository } from "@/domain/repository/upload";

export class CreateImageUpload implements ICreateImageUploadUseCase {
   constructor(private readonly uploadRepository: UploadRepository) {}

   async execute(): Promise<void> {}
}

interface ICreateImageUploadUseCase {
   execute(): Promise<void>;
}
