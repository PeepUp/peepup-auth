import server from "./infrastructure/http/app";

async function main(): Promise<void> {
    await server.ready();

    const app = await server.listen({
        port: <number>server.config.environment.port,
        host: <string>server.config.environment.host,
    });

    console.log(`🐢 Server listening on ${app}`);
}

main().catch((error: unknown) => {
    if (error) {
        server.close(() => {
            server.log.error("Server has been shut down");
            process.exit(0);
        });
    }
});
