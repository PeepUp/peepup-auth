import { Request, Response, NextFunction } from "express";
import { RateLimiter } from "../../../common/limitter";
import { environment } from "../../../config";

export class Middleware {
   /* private authService */

   private endRequest(status: Status, message: string, res: any) {
      return res.status(status).send({ message });
   }

   public addRateLimit(mins: number, max: number) {
      const rl = RateLimiter.init({ value: max, timestamp: mins });
      return rl;
   }

   public static restrictedUrl(
      req: Request,
      res: Response,
      next: NextFunction
   ) {
      if (!environment.app.isProduction) {
         return next();
      }

      const approvedDomainList = ["http://127.0.0.1:3000"];
      const domain = req.headers.origin;
      const isValidDomain = !!approvedDomainList.find((d) => d === domain);

      console.log(`Domain =${domain}, valid?=${isValidDomain}`);

      if (!isValidDomain) {
         return res.status(403).json({ message: "Unauthorized" });
      } else {
         return next();
      }
   }
}

type Status = 400 | 403;
