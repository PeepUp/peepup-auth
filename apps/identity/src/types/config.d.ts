declare namespace Identity {
   namespace Config {
      interface Api {
         environment: {
            env: Api.Environment;
            port: number;
            host?: string;
            whiteListClient?: string[];
         };
         logging: {
            level: Api.LogLevel;
         };
         swagger: {
            title: string;
            description: string;
            url: string;
         };
         api: {
            prefix: string;
         };
      }
   }
}
