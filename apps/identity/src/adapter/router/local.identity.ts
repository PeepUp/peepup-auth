import IdentityHandler from "../handler/identity";
import IdentityService from "../service/identity";

import type { FastifyReply, FastifyRequest } from "fastify";
import type { Routes } from "..";
import type {
   RequestLoginIdentityBody,
   RequestRegisterIdentityBody,
} from "../handler/identity";

export default (identitiesService: IdentityService): { routes: Routes } => {
   const identityHandler = new IdentityHandler(identitiesService);

   return {
      routes: [
         /**
          * @ref url to self-service register
          * @method POST
          * @param {string} email - should be traits registered in the identity
          * @param {string} password
          *
          * @todo
          *  ☐ encapsulte into handler function
          *
          * @figure
          *  🤔 Which one is better?
          *    ☐ encapsulte into handler function
          *    ☐ encapsulte into handler function
          */
         {
            method: "POST",
            url: "/local/registration",
            handler: async (
               request: FastifyRequest<{ Body: RequestRegisterIdentityBody }>,
               reply: FastifyReply
            ) => identityHandler.registration(request, reply),
            schema: {},
         },
         {
            method: "POST",
            url: "/local/login",
            handler: async (
               request: FastifyRequest<{ Body: RequestLoginIdentityBody }>,
               reply: FastifyReply
            ) => identityHandler.login(request, reply),
            schema: {},
         },
      ],
   };
};
