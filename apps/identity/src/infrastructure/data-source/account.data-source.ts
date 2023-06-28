// import { PrismaClient } from "@prisma/client";

// import type {
//     AccountContract,
//     CreateAccountInput,
//     DataSourceSQL,
//     ID,
// } from "@/types/types";

// class PrismaAccountDataSourceAdapter implements DataSourceSQL<AccountContract> {
//     constructor(private readonly db: PrismaClient) {}

//     findMany(): Promise<AccountContract[] | null> {
//         throw new Error("Method not implemented.");
//     }
//     async update(id: ID, data: AccountContract): Promise<AccountContract> {
//         throw new Error("Method not implemented.");
//     }

//     async updateById(id: ID, data: AccountContract): Promise<AccountContract> {
//         throw new Error("Method not implemented.");
//     }

//     async find(id: ID): Promise<AccountContract | null> {
//         throw new Error("Method not implemented.");
//     }

//     async create(data: AccountContract): Promise<AccountContract> {
//         throw new Error("Method not implemented.");
//     }

//     async read(id: ID): Promise<AccountContract> {
//         throw new Error("Method not implemented.");
//     }

//     async delete(id: ID): Promise<void> {
//         throw new Error("Method not implemented.");
//     }

//     async connect(): Promise<void> {
//         await this.db.$connect();
//     }

//     async disconnect(): Promise<void> {
//         await this.db.$disconnect();
//     }

//     async insert(user: CreateAccountInput): Promise<AccountContract> {
//         const newuser = await this.db.identity.create({
//             data: {
//                 email: user.profile.email,
//                 username: user.profile.username,
//                 password: user.profile.password,
//                 firstName: user.profile.firstName,
//                 lastName: user.profile.lastName,
//                 updatedAt: new Date(),
//                 createdAt: new Date(),
//             },
//         });

//         return newuser as unknown as AccountContract;
//     }

//     async findByEmail(email: string): Promise<AccountContract> {
//         throw new Error("Method not implemented.");
//     }

//     async query<Q>(query?: Q | undefined): Promise<AccountContract[]> {
//         throw new Error("Method not implemented.");
//     }
// }

// export default PrismaAccountDataSourceAdapter;
