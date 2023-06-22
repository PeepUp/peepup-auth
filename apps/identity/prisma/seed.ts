import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const account: Prisma.AccountCreateInput = {
   user: {
      create: {
         phone: "1234567890",
         username: "john123",
         emailVerified: new Date(),
         password: "$john123",
         avatar: "https://www.google.com",
         name: "John Doe",
         email: "john@gmail.com",
      },
   },
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

   await prisma.account.create({
      data: account,
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
      process.exit(1);
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
