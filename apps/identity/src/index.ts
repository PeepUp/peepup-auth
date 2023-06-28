import { server } from "./infrastructure/http/app";
async function main() {
    await server.ready();

    const _ = await server.listen({
        port: <number>server.config.environment.port,
        host: <string>server.config.environment.host,
    });

    // server.ready(() => {
    //     console.log(server.getSchemas());
    // });

    console.log(`🐢 Server listening on ${_}`);
}

void main().catch((error: unknown) => {
    if (error) {
        server.close(() => {
            server.log.error("Server has been shut down");
            process.exit(0);
        });
    }
});
