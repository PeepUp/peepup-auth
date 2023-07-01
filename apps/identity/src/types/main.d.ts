import { RouteOptions } from "fastify";

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
    namespace Core {
        namespace Hook {
            interface HookFactory {
                create(app: Application): Hook;
            }
            interface Hook {
                app: Application;
                execute(): void;
            }
        }

        type Route = RouteOptions<
            http.Server,
            http.IncomingMessage,
            http.ServerResponse,
            any,
            any,
            any,
            any,
            FastifyBaseLogger
        >;

        export type Routes = Array<Route>;

        interface Plugin {
            plugin: any;
            options?: any;
        }

        type Plugins = Array<Plugin>;
    }
}
