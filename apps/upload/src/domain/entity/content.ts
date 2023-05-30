export interface ContentEntityProps<T> {
   readonly contentFormat: string;
   readonly value: T;
}

export class ContentFile<Type> {
   constructor(
      private readonly contentFormat: string,
      private readonly value: Type
   ) {}

   getContentFormat(): string {
      return this.contentFormat;
   }

   async getValue(): Promise<Type> {
      return new Promise(() => {
         this.value;
      });
   }
}
