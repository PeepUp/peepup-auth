import RBAC from "@/domain/access-control";
import Role from "@/domain/entities/role";
import {
   AccessControlAccessor,
   AccessInfo,
   RoleAccessor,
   RoleType,
} from "@/common/types";

describe("RBAC implements AccessControlAccessor", () => {
   let roleRepository: RoleAccessor;
   let accessControlRepository: AccessControlAccessor;
   let rbac: RBAC;

   beforeEach(() => {
      // Create a mock role repository
      roleRepository = {
         getRole: jest.fn(),
         getRoles: jest.fn(),
         createRole: jest.fn(),
         updateRole: jest.fn(),
         deleteRole: jest.fn(),
         upsertRole: jest.fn(),
      };

      // Create a mock access control repository
      accessControlRepository = {
         getAccessById: jest.fn(),
         getAccess: jest.fn(),
         getAllAccess: jest.fn(),
         updateAccess: jest.fn(),
         createAccess: jest.fn(),
         deleteAccess: jest.fn(),
      };

      // Create a new RBAC instance
      rbac = new RBAC(roleRepository, accessControlRepository);
   });

   describe("Grant", () => {
      it("should create a new access control if permission doesn't exist", async () => {
         const role: Role = {
            id: 1,
            type: RoleType.ADMIN,
            permissions: [],
         };

         const access: AccessInfo = {
            id: 1,
            action: "create",
            resource: "user",
            possession: "any",
            scope: "post",
         };

         roleRepository.getRole = jest.fn().mockResolvedValue(role);
         accessControlRepository.getAccess = jest
            .fn()
            .mockResolvedValue(undefined);
         accessControlRepository.createAccess = jest.fn();
         await rbac.grant(role, access);

         expect(accessControlRepository.createAccess).toHaveBeenCalledWith(
            role,
            access
         );
      });
   });
});
