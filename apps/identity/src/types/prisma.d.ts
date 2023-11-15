import { prismaExtendedIdentityModel } from "@/infrastructure/prisma";
/**
 * @todo:
 *  - make this to file definition type
 *  - !i guest this is not the best way to do this!
 *
 * @figure out how to extend prisma model with custom methods, so we can used by modules declared in the domain layer
 */
export type PrismaIdentityExtendedModel = typeof prismaExtendedIdentityModel;
