import compression from "compression";
import cors from "cors";
import express from "express";
import hpp from "hpp";

import { shouldCompress } from "../../common/compression";
import { logger } from "../../common/utils/logger";
import { config, environment, node_env } from "../../config";

import type { Routes } from "@/interfaces/routes.interface";
import type { Application } from "express";

export class App {
   public app: Application;
   public node_env: string;
   public port: number | string;

   constructor(routes: Routes[]) {
      this.app = express();
      this.node_env = node_env;
      this.port = environment.app.port;

      this.initializeRoutes(routes);
   }

   public initializeRoutes(routes: Routes[]) {
      console.log("initializeRoutes");
      routes.forEach((route) => {
         this.app.use("/api/v1/", route.router);
      });
   }

   public initializeMiddlewares() {
      this.app.use(express.json());
      this.app.use(hpp());
      this.app.use(compression({ filter: shouldCompress }));
      this.app.use(express.urlencoded({ extended: true }));
      this.app.use(cors({ origin: "*", credentials: config.credentials }));
   }

   public listen() {
      this.app.listen(this.port, () => {
         logger.info(`=================================`);
         logger.info(`======= ENV: ${this.node_env} =======`);
         logger.info(`🚀 Upload Service listening on the port ${this.port}`);
         logger.info(`=================================`);
      });
   }
}

/* const app: Application = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({ origin: "*" }));

app.use("/api/v1", routes);
app.use("/", (_: Request, res: Response) => {
   res.redirect("/docs");
});

const httpServer = createServer(app);

httpServer.listen(process.env.PORT || 8888, () =>
   console.log("[APP] server listening on port http://127.0.0.1:8888")
);

process.on("SIGINT", () => {
   console.log("Received SIGINT signal");
   // close database connections
   // release resources that were allocated by the process
   process.exit(0);
});

process.on("SIGTERM", () => {
   console.log("Received SIGTERM signal");
   // Perform clean-up operations here
   httpServer.close(() => {
      console.log("Express server closed");
      process.exit(0);
   });
}); */

/*
 * IPC (Inter-Process Communication) signals
 * SIGHUP:
 *   - default: Terminate Process
 *   - desc: Terminal line hangup
 * SIGINT:
 *   - default: Terminate Process
 *   - desc: Interrupt Program
 * SIGNKILL:
 *   - default: Terminate Proccess
 *   - desc: Kill Program
 * SIGTERM:
 *   - default: Terminate Process
 *   - desc: Software termination signal
 *
 * Ref: https://dev.to/wakeupmh/graceful-shutdown-with-nodejs-and-terminus-1gjn
 */

/*
 * In general, it is not recommended to handle the SIGKILL signal in an application, including an ExpressJS application. The SIGKILL signal is a special signal that cannot be caught or ignored by the application, and when it is received, the operating system immediately terminates the process without allowing it to perform any cleanup operations.
 * This means that if your ExpressJS application receives the SIGKILL signal, it will not be able to perform any graceful shutdown procedures, such as closing database connections or releasing resources, and this can result in data corruption or other issues.
 */

/*
 * Program will interrupted when `ctr + c` the signal is "SIGINT"
 * to kill in a good way
 */
