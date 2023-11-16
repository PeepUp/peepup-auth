import server from "@/infrastructure/http/app";
import PrismaProvider from "@/infrastructure/database/prisma-provider";

export async function main(): Promise<void> {
    await server.ready();

    const app = await server.listen({
        port: server.config.environment.port as number,
        host: server.config.environment.host as string,
    });

    console.info(`🐢 Identity Server listening on ${app}`);
}

main().catch((error: unknown) => {
    if (error) {
        console.dir(error, { depth: Infinity });
        server.close(() => {
            server.log.error("Identity Server has been shut down");
            process.exit(0);
        });
        PrismaProvider.getInstance().disconnect();
    }
});
