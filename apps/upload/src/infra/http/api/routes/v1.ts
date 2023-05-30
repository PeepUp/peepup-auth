import { Routes } from "@interfaces/routes.interface";
import type { Request, Response } from "express";
import { Router } from "express";

export class ApiRoute implements Routes {
   public path: "test";
   public router: Router = Router();

   constructor() {
      this.initializeRoutes();
   }

   initializeRoutes() {
      console.log(this.path);
      this.router.get(`${this.path}`, (req: Request, res: Response) => {
         console.debug(
            req.method + ": " + req.originalUrl + " from: " + req.get("host")
         );
         return res.status(200).json({
            status: "OK",
            code: "200",
            message: "Hello, Budz!",
            uptime: process.uptime(),
            timestamp: Date.now(),
            response_time: process.hrtime()[1],
            links: {
               self: `${req.protocol}://${req.get("host")}${req.originalUrl}`,
               photo: `${req.protocol}://${req.get("host")}/photo`,
            },
         });
      });
   }
}

/* routes.use("/upload", uploadRouter);
routes.get("/metadata", async (_req: Request, res: Response) => {
   const kafka = new KafkaService();

   const message = {
      topic: "files",
      meta: [
         [
            {
               id: "6aba141d-7fb2-4318-95dd-13acde95d2ca",
               shareableLink:
                  "http://localhost:8888/api/v0/photo/metadata/6aba141d-7fb2-4318-95dd-13acde95d2ca",
               author: {
                  name: "Dulles Ansel",
                  comment:
                     "this is a picture of a man. he is jumping in the air and it looks like he is on a beach somewhere.",
               },
               contain: {
                  isTracked: false,
                  text: true,
                  faces: true,
                  comment: "this is a picture of myself",
                  description:
                     "this is a picture of a man. he is jumping in the air and it looks like he is on a beach somewhere.",
                  watermarks: "",
                  unreadable: true,
                  metadata: true,
                  hasDataAppended: true,
                  hasCopyright: false,
                  hasLabel: false,
               },
               device: {
                  apperture: "f/1.4",
                  type: "Nikon D200",
                  model: "D200",
                  makeBy: "-",
                  shutterSpeed: 0.5,
                  megapixels: 2.2,
                  fieldOfView: 69.2,
                  focalLength: 18,
                  hyperfocalDistance: 2.89,
                  lightValue: 14,
                  whiteBalance: "Clear Sky",
                  subjectDistanceRange: -1,
                  flash: {
                     isFired: false,
                     isFunction: true,
                     hasRedEyeMode: false,
                     hasReturn: false,
                     pixVersion: "0100",
                  },
                  lens: {
                     size: "18-200 mm f/3.5-5.6",
                     info: "Shot at 18 mm (35mm film equiv: 27mm)",
                  },
               },
               file: {
                  name: "0292fd6cb4427700adaea8d435e4d940",
                  type: "jpg",
                  source: "Digital Camera",
                  createTime: 1521350728,
                  modifyTime: 1679143652966,
                  section: "unknown",
                  dataChunked: 14000,
                  bitDepth: 323,
                  typeOfMIME: "image/jpg",
                  sharpness: "normal",
                  contrast: "low",
                  customRendered: "normal",
                  saturation: "normal",
                  yCbCrSubSampling: "YCbCr4:4:4 (1 1)",
                  ISO: 125,
                  colorSpace: ["sRGB"],
                  apperture: 12.4,
                  label: "no label",
                  softwareVersion: "Ver.111",
                  creatorTool: "Adobe Photoshop Lightroom",
                  compression: "JPEG (old-style)",
                  zoomRatio: 1,
                  exposure: {
                     compensation: 0,
                     mode: "Auto",
                     program: "Program AE",
                     time: "1/320",
                  },
                  exif: {
                     version: "0221",
                  },
                  lightSource: "Fine Weather",
                  scene: {
                     captureType: "Standard",
                     type: "Directly photographed",
                  },
               },
               location: {
                  latitude: 35.012471,
                  longitude: 135.782573,
                  altitude: 51.1,
                  versionId: "2.2.0.0",
                  latitudeRef: "North",
                  longitudeRef: "East",
                  altitudeRef: "Above sea level",
                  mapDatum: "WGS-84",
               },
               resolution: {
                  width: 1.8,
                  height: 1.205,
                  unit: "megapixels",
               },
            },
         ],
      ],
   };

   await kafka.init();
   await kafka.sendBatch(message.topic, message.meta);
   const data = await kafka.consumeMessage(message.topic);

   res.status(200);
   res.send(data ?? {});
});

routes.get("/");

export { routes };
 */
