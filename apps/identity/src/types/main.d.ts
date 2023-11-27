import type { RouteOptions } from "fastify";
import type { JwtToken } from "@/types/token";
import { HTTPMethod } from "@/common/constant";

declare namespace Identity {
    namespace Config {
        interface Api {
            environment: {
                env: Api.Environment;
                port: number;
                host?: string;
                whiteListClient?: string[];
                encryption: {
                    algorithm: string;
                    secret_key: string;
                    secret_iv: string;
                };
                cookies: {
                    secret_key: string;
                };
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
                root: string;
                paths: {
                    tokens: {
                        root: string;
                        paths: {
                            rotate: BasicRoutesPath | ComplexRoutesPath;
                            decode: BasicRoutesPath;
                            sessions: {
                                root: string;
                                method: HTTPMethod;
                                paths: {
                                    active: BasicRoutesPath;
                                    whoami: BasicRoutesPath;
                                    histories: BasicRoutesPath;
                                };
                            };
                        };
                    };
                };
            };
        }

        interface BasicRoutesPath {
            path: string;
            method: HTTPMethod;
        }

        interface ComplexRoutesPath extends BasicRoutesPath {
            root: string;
        }

        interface Certs {
            rsa: JwtToken;
            ecsda: JwtToken;
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
