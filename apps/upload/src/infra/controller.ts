import type { Request, Response } from "express";

export abstract class Controller {
   private req: Request;
   private res: Response;
   protected abstract executeImplementation(): Promise<void>;

   public async execute(req: Request, res: Response): Promise<void> {
      this.req = req;
      this.res = res;
      await this.executeImplementation();
   }

   public static json(res: Response, codeStatus: number, message: string) {
      return res.status(codeStatus).json({ message });
   }

   public ok<T>(res: Response, dto?: T) {
      if (dto) {
         return res.status(200).json(dto);
      }

      return res.sendStatus(200);
   }

   public created(res: Response) {
      return res.sendStatus(201);
   }

   public clientError(message?: string) {
      return Controller.json(this.res, 400, message ? message : "Unauthorized");
   }

   public unauthorized(message?: string) {
      return Controller.json(this.res, 401, message ? message : "Unauthorized");
   }
   public paymentRequired(message?: string) {
      return Controller.json(
         this.res,
         402,
         message ? message : "Payment required"
      );
   }

   public forbidden(message?: string) {
      return Controller.json(this.res, 403, message ? message : "Forbidden");
   }

   public notFound(message?: string) {
      return Controller.json(this.res, 404, message ? message : "Not found");
   }

   public conflict(message?: string) {
      return Controller.json(this.res, 409, message ? message : "Conflict");
   }

   public tooManyRequest(message?: string) {
      return Controller.json(
         this.res,
         429,
         message ? message : "Too many request"
      );
   }

   public todo() {
      return Controller.json(this.res, 400, "TODO");
   }

   public fail(error: Error | string) {
      console.log(error);
      return this.res.status(500).json({
         message: error.toString(),
      });
   }
}
