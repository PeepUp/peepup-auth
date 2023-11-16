import { Prisma, PrismaClient, SystemRole } from "@prisma/client";

const prisma = new PrismaClient();

const identity: Prisma.IdentityCreateInput = {
    phoneNumber: "1234567890",
    username: "john123",
    state: "active",
    emailVerified: new Date(),
    password:
        "NmVhNzgzOWE2ZjhmZWVlOGE3NjJmZWZkMTg0YzZjNjY0YzU0ZjZhOTg4NzY4OTU2ZDg0MmY1MTc0MmEwNzc5NTBjODBlNzY5MWU2YzVlZTAzNzJlZjM1MGJmNTg0ZjVhN2VlMWU1ZTBmNTM2MDUzNTBmMTZlZDFiMjdhNmRmOGNkNTU1OTZiMmIwYzcxNGJjNGZiMzdkMzQ2OWNlNjQ2MjcwYzViMDk3YjQxY2JjMzlmYWQ0MDg1YzEwMzhkZDg1ZjJlMGM4YzhkYzY3ZDFjYTRiZjIzNzc3NzViNGYzMTU1NWMzNjFkYzBjNmRkNmY5MzUwNTZjMTQ3ZGYxZTAxMQ==",
    avatar: "https://www.google.com",
    firstName: "John",
    lastName: "Doe",
    email: "john@gmail.com",
    role: SystemRole.admin,
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
