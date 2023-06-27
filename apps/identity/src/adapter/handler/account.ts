// import { FastifyReply, FastifyRequest } from "fastify";
// import AccountService from "../service/account";

// import {
//    CREATE_ACCOUNT_REQUEST_BODY_SCHEMA_TYPE,
//    GET_ACCOUNT_PARAMS_ID_SCHEMA_TYPE,
//    GET_ACCOUNT_PARAMS_USERNAME_SCHEMA_TYPE,
//    LOGIN_ACCOUNT_REQUEST_BODY_SCHEMA_TYPE,
//    REGISTRATION_ACCOUNT_REQUEST_BODY_SCHEMA,
// } from "../schema/account.schema";
// import { randomUUID } from "crypto";

// export async function getUserById(
//    request: FastifyRequest<{ Params: GET_ACCOUNT_PARAMS_ID_SCHEMA_TYPE }>,
//    reply: FastifyReply,
//    accountService: AccountService
// ) {
//    const profile = await accountService.getAccountById(request.params.accountId);

//    return reply.code(200).send({
//       data: {
//          profile,
//       },
//    });
// }

// export async function getUserByUserName(
//    _request: FastifyRequest<{
//       Params: GET_ACCOUNT_PARAMS_USERNAME_SCHEMA_TYPE;
//    }>,
//    reply: FastifyReply
// ) {
//    return reply.code(200).send({
//       data: {
//          profile: {
//             username: "test",
//             name: "test",
//             email: "test",
//             password: "test",
//             phone: "test",
//             emailVerified: new Date(),
//             avatar: "test",
//          },
//       },
//    });
// }

// export async function getUserProfileByUsername(
//    request: FastifyRequest<{ Params: GET_ACCOUNT_PARAMS_USERNAME_SCHEMA_TYPE }>,
//    reply: FastifyReply,
//    accountService: AccountService
// ) {
//    const { user } = await accountService.getProfileByUsername(request.params.username);

//    return reply.code(200).send({
//       data: {
//          ...user,
//       },
//    });
// }

// export async function registerAccount(
//    request: FastifyRequest<{ Body: CREATE_ACCOUNT_REQUEST_BODY_SCHEMA_TYPE }>,
//    reply: FastifyReply,
//    accountService: AccountService
// ) {
//    const { email, password } = request.body;

//    const existingAccount = await accountService.getProfileByEmail(email);
//    console.log({ existingAccount });

//    if (existingAccount.user !== undefined) {
//       return reply.code(422).send({
//          error: {
//             error: {
//                id: randomUUID(),
//                code: "409",
//                message: "Account is already taken",
//                details: "Account is already taken",
//                reason: "Account is already taken",
//                request: randomUUID(),
//                status: "Conflict",
//             },
//          },
//       });
//    }

//    await accountService.registerAccount({
//       email,
//       password,
//    });

//    return reply.code(201).send({
//       data: {
//          code: "Created",
//          message: "Account is created successfully!",
//          status: "Success",
//       },
//    });
// }

// export async function loginAccount(
//    request: FastifyRequest<{ Body: CREATE_ACCOUNT_REQUEST_BODY_SCHEMA_TYPE }>,
//    reply: FastifyReply,
//    accountService: AccountService
// ) {
//    const { email, password } = request.body;
//    const existingAccount = await accountService.getProfileByEmail(email);

//    if (existingAccount !== undefined && existingAccount.user.email !== email) {
//       return reply.code(404).send({
//          code: "404",
//          codeStatus: "Not Found",
//          ok: false,
//          message: "Account is not found",
//          error: {
//             details: [
//                {
//                   message: `Account with email '${email}' is not found`,
//                },
//             ],
//          },
//       });
//    }

//    const { user } = await accountService.loginAccount({
//       email,
//       password,
//    });

//    if (user) {
//       return reply.code(200).send({
//          data: {
//             access_token: "test",
//             refresh_token: "test",
//             token_type: "Bearer",
//          },
//       });
//    }
// }
