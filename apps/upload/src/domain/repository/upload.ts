export interface UploadRepository {
   findById(id: string): Promise<void>;
   save(order: string): Promise<void>;
   delete(order: string): Promise<void>;
}
