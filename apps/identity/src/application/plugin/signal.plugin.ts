import type { FastifyPluginAsync } from "fastify";
import type { FastifyGracefulExitOptions } from "@/types/types";

export const signal: FastifyPluginAsync<FastifyGracefulExitOptions> = async (
    fastify,
    options = {
        timeout: 3000,
        message: "🌿 Server is shutting down",
    }
): Promise<void> => {
    const { timeout = 30000 } = options;
    const { log } = fastify;
    let closePromise: Promise<undefined> | null = null;

    const gracefullyClose = async (sign: string): Promise<unknown> => {
        if (closePromise) return closePromise;

        console.warn(
            `🌿 Server has been interrupt on ${sign} gracefully and will be shut down ...`
        );

        setTimeout(() => {
            console.warn(`Failed to gracefully close before timeout`);
            process.exit(1);
        }, timeout);

        closePromise = fastify.close();
        await closePromise;
        return process.exit(0);
    };

    process.on("uncaughtException", (err) => {
        log.error({ err }, `Uncaught Exception: ${err.message}`);
        gracefullyClose("uncaughtException");
    });

    process.on("unhandledRejection", (reason) => {
        log.error({ reason }, `Unhandled Rejection: ${reason}`);
        gracefullyClose("unhandledRejection");
    });

    for (const sig of ["SIGINT", "SIGTERM"]) {
        process.on(sig, () => {
            console.warn(
                `🌿 Server has been interrupt on ${sig} gracefully and will be shut down ...`
            );
            gracefullyClose(sig);
        });
    }

    fastify.decorate("signal", gracefullyClose);
};
