import server from "@/infrastructure/http/app";

export async function main(): Promise<void> {
    await server.ready();

    const app = await server.listen({
        port: <number>server.config.environment.port,
        host: <string>server.config.environment.host,
    });

    /* const emailSender = EmailSender.getInstance();
    emailSender.activate();
    emailSender.setEmailApi(new NodeMailerAdapter());

    emailSender.sendEmail({
        toEmail: "coocoobolo1@gmail.com",
        verificationToken: "test",
    }); */

    console.log(`🐢 Server listening on ${app}`);
}

main().catch((error: unknown) => {
    if (error) {
        console.error({ error });
        server.close(() => {
            server.log.error("Server has been shut down");
            process.exit(0);
        });
    }
});
