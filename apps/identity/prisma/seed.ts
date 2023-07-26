import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const identity: Prisma.IdentityCreateInput = {
    phoneNumber: "1234567890",
    username: "john123",
    state: "active",
    emailVerified: new Date(),
    password:
        "$argon2id$v=19$m=65536,t=3,p=4$CUsArk9CbT6eVPTTqyV7Vg$asdklfhjk3l4wjr23iojoiasdjfiodsafjiods75Z2GayCOWUJpd34",
    avatar: "https://www.google.com",
    firstName: "John",
    lastName: "Doe",
    email: "john@gmail.com",
    roles: {
        create: {
            permissions: {
                create: [
                    {
                        action: "create",
                        resource: "account",
                        attributes: {
                            create: {
                                name: "subject",
                                value: "volunteer",
                            },
                        },
                    },
                    {
                        action: "block",
                        resource: "account",
                        attributes: {
                            create: {
                                name: "subject",
                                value: "volunteer",
                            },
                        },
                    },
                ],
            },
        },
    },
};

async function main() {
    console.log(`---- Start seeding ----`);

    await prisma.identity.create({
        data: identity,
    });

    console.log(`---- Finish seeding ----`);
}

main()
    .then(() => {
        prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
    });

/* const newuser = await prisma.account.create({
      include: {
         user: true,
         roles: {
            include: { permissions: true },
         },
      },
      data: {
         user: {
            create: {
               phone: "1234567890",
               username: "john",
               emailVerified: new Date(),
               password: "1234567890",
               image: "https://www.google.com",
               name: "John Doe",
               email: "john@gmail.com",
            },
         },
         roles: {
            create: {
               type: "ADMIN",
               permissions: {
                  create: [
                     {
                        attribute: {
                           canCreateUser: true,
                           canDeleteUser: true,
                           canInviteUser: true,
                           canUpdateUser: true,
                        },
                     },
                     {
                        attribute: {
                           canDeleteOrganization: true,
                           canUpdateOrganization: true,
                           canInviteUser: true,
                        },
                     },
                  ],
               },
            },
         },
      },
   }); */
