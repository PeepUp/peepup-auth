import server from "@/infrastructure/http/app";
import PrismaProvider from "@/infrastructure/database/prisma-provider";

export async function main(): Promise<void> {
    await server.ready();

    const app = await server.listen({
        port: server.config.environment.port as number,
        host: server.config.environment.host as string,
    });

    console.info(`🐢 Server listening on ${app}`);
}

main().catch((error: unknown) => {
    if (error) {
        console.error({ error });
        server.close(() => {
            server.log.error("Server has been shut down");
            process.exit(0);
        });
        PrismaProvider.getInstance().disconnect();
    }
});
