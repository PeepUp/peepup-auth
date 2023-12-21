import { Prisma, PrismaClient, SystemRole } from "@prisma/client";

const prisma = new PrismaClient();

const identityAdmin: Prisma.IdentityCreateInput = {
    phoneNumber: "1234567890",
    username: "john123",
    state: "active",
    emailVerified: new Date(),
    password:
        "NmVhNzgzOWE2ZjhmZWVlOGE3NjJmZWZkMTg0YzZjNjY0YzU0ZjZhOTg4NzY4OTU2ZDg0MmY1MTc0MmEwNzc5NTBjODBlNzY5MWU2YzVlZTAzNzJlZjM1MGJmNTg0ZjVhN2VlMWU1ZTBmNTM2MDUzNTBmMTZlZDFiMjdhNmRmOGNkNTU1OTZiMmIwYzcxNGJjNGZiMzdkMzQ2OWNlNjQ2MjcwYzViMDk3YjQxY2JjMzlmYWQ0MDg1YzEwMzhkZDg1ZjJlMGM4YzhkYzY3ZDFjYTRiZjIzNzc3NzViNGYzMTU1NWMzNjFkYzBjNmRkNmY5MzUwNTZjMTQ3ZGYxZTAxMQ==",
    avatar: "http://127.0.0.1:3000/assets/images/apple-bubble-background-b2-3840x2160-4051695046.jpeg",
    firstName: "John",
    lastName: "Doe",
    email: "john@gmail.com",
    role: SystemRole.admin,
};

const identity2: Prisma.IdentityCreateInput = {
    phoneNumber: "902334023",
    username: "ucup_83",
    state: "active",
    emailVerified: new Date(),
    password:
        "NmVhNzgzOWE2ZjhmZWVlOGE3NjJmZWZkMTg0YzZjNjYyOWQ0MzZkYTNjZWNkNWYxMjNmYTNjMzkwYTIxOGE3MTE1YmQ5MDZlNGJmODRhZDU4YWI0YmE5ZDQ1Mzk5OTRlMDRjYThjNWFlN2I0OWNjODE2MzBjNmVlZjIxNjBjNzY2OWFkMmExY2Y3ZmM1N2M5MjIwYzgzMzBkYTgwMjQ0MTJkMDM5NmM5NmExMGQ0ZWUxNzI0Y2ZlZDRkMmM3NWJkMzMzOTdlZDUwNGU0ODU4ODM5MTJiM2NiZWFlMzIzZmEwZWE5YTQ4NWM2MjU4YmU0YWY4MmI2NWEwN2FiNjlkOQ==",
    avatar: "https://nextui-docs-v2.vercel.app/images/hero-card-complete.jpeg",
    firstName: "Ucup",
    lastName: "Bahruddin",
    email: "ucup_bahrudin@gmail.com",
    role: SystemRole.member,
};

const identity: Prisma.IdentityCreateInput = {
    phoneNumber: "902334023",
    username: "alex_ethan",
    state: "active",
    emailVerified: new Date(),
    password:
        "NmVhNzgzOWE2ZjhmZWVlOGE3NjJmZWZkMTg0YzZjNjYyOWQ0MzZkYTNjZWNkNWYxMjNmYTNjMzkwYTIxOGE3MTE1YmQ5MDZlNGJmODRhZDU4YWI0YmE5ZDQ1Mzk5OTRlMDRjYThjNWFlN2I0OWNjODE2MzBjNmVlZjIxNjBjNzY2OWFkMmExY2Y3ZmM1N2M5MjIwYzgzMzBkYTgwMjQ0MTJkMDM5NmM5NmExMGQ0ZWUxNzI0Y2ZlZDRkMmM3NWJkMzMzOTdlZDUwNGU0ODU4ODM5MTJiM2NiZWFlMzIzZmEwZWE5YTQ4NWM2MjU4YmU0YWY4MmI2NWEwN2FiNjlkOQ==",
    avatar: "http://127.0.0.1:3000/assets/images/mantic-minotaur-black.png",
    firstName: "Alex",
    lastName: "Ethan",
    email: "alex_ethan@gmail.com",
    role: SystemRole.member,
};

async function main() {
    console.log(`---- Start dropping existing data ----`);
    await prisma.identity.deleteMany({});
    console.log(`---- Finish dropping existing data ----`);
    console.log(`---- Start seeding ----`);
    await prisma.identity.create({ data: identityAdmin });
    await prisma.identity.create({ data: identity });
    await prisma.identity.create({ data: identity2 });
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
