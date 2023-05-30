import { Result } from "./result";
import { ErrorType } from "./errorType";

export interface UnexpectedErrorType {
   name: string;
   message: string;
   data?: unknown;
}

export interface BadRequestErrorType {
   name: string;
   message: string;
   data?: unknown;
}

class BadRequestError extends Result<never, BadRequestErrorType> {
   constructor(data: unknown) {
      super(false, null as never, data as BadRequestErrorType);
   }

   static create(error: unknown): UnexpectedError {
      return new UnexpectedError(error);
   }
}

class UnexpectedError extends Result<never, UnexpectedErrorType> {
   constructor(data: unknown) {
      super(false, null as never, data as UnexpectedErrorType);
   }

   static create(error: unknown): UnexpectedError {
      return new UnexpectedError(error);
   }
}

class GenericError extends Result<ErrorType, Error> {
   constructor(message: string, status: boolean, data?: unknown) {
      super(status, {
         message,
         data,
      });
      console.error(`ApiError: ${message}`, data);
   }

   static create(message: string, status: boolean, error?: unknown): ApiError {
      return new ApiError(message, status, error);
   }
}

class ApiError extends Result<ErrorType, Error> {
   constructor(message: string, status: boolean, data?: unknown) {
      super(status, {
         message,
         data,
      });
      console.error(`ApiError: ${message}`, data);
   }

   static create(message: string, status: boolean, error?: unknown): ApiError {
      return new ApiError(message, status, error);
   }
}

export { UnexpectedError, ApiError, GenericError, BadRequestError };
