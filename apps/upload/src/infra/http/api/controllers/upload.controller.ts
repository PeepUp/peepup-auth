import { Request, Response } from "express";

export default class UploadController {
   async store(request: Request, response: Response): Promise<Response> {
      console.log(request, response);
      return response.json("ok!");
   }

   async getContent(request: Request, response: Response): Promise<Response> {
      console.log(request, response);
      return response.json("ok!");
   }
}
