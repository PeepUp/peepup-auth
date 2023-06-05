import { EntityProps } from "common/types";

/**
 * @example:
 ```
   const entity = {
      id: 1,
      name: "John Doe"
   };

   const isEntityResult = isEntity(entity);
   console.log(isEntityResult); // true
 ```
*/

export function isEntity<Type>(value: Entity<Type>): value is Entity<Type> {
   return value instanceof Entity;
}

export class Entity<T> implements EntityProps<T> {
   props: T;

   constructor(props: T) {
      if (props) {
         this.props = props;
      }
   }

   public equals(props: Entity<T>): boolean {
      return props != null && isEntity(props) && this === props;
   }
}
