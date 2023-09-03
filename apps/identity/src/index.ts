import server from "./infrastructure/http/app";

import { AbilityFactory, dummy_identity } from "./domain/factory/ability";
import { Action } from "./common/constant";

async function main(): Promise<void> {
    await server.ready();

    const user = dummy_identity;
    const ability = AbilityFactory.defineAbilitiesFor(user, user.role);

    console.log({
        ...ability,
        can_read: ability.can(Action.read, "Identity"),
        can_update: ability.can(Action.update, "Identity"),
        can_create: ability.can(Action.create, "Identity"),
        can_delete: ability.can(Action.delete, "Identity"),
    });

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
