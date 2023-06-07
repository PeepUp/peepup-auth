import type { UserRole } from "./types";

export function userRole(_value: UserRole) {
   return function (target: {}, propertyKey: string) {
      let value: string;

      const getter = function () {
         return value;
      };

      const setter = function (newVal: string) {
         if (newVal === undefined) {
            value = value;
         } else {
            value = newVal;
         }
      };

      Object.defineProperty(target, propertyKey, {
         get: getter,
         set: setter,
      });
   };
}
