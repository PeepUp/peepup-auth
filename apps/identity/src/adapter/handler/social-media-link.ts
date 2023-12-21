import PrismaProvider from "@/infrastructure/database/prisma-provider";
import type { RequestHandler, unknown as _ } from "@/types/types";
import type { PrismaClient } from "@prisma/client";

export class SocialMediaLinkHandler {
    private readonly db: PrismaClient;

    constructor() {
        this.db = PrismaProvider.getInstance();
    }

    getAllSocialMedia: RequestHandler<_, _, _, { id: string }> = async (request, reply) => {
        const { id } = request.params;

        const data = await this.db.socialMediaLink.findMany({
            where: {
                identity: {
                    id: request.params.id,
                },
            },
        });

        return {
            data,
        };
    };
}
