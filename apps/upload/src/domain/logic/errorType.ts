export abstract class ErrorType implements IErrorType {
   public readonly message: string;
   public readonly data?: unknown;

   constructor(message: string, data?: unknown) {
      this.message = message;
      this.data = data;
   }
}

interface IErrorType {
   message: string;
   data?: unknown;
}
