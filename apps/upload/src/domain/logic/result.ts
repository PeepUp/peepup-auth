/*
 * The code provides an implementation of a Result class with a generic type parameter T representing
 * the success value and another generic type parameter E extends string representing the error type.
 * The class has properties for isSuccess, isFailure, error, and _value, along with methods for retrieving
 * the success value, creating a successful or failed result, and combining multiple results.
 */

/*
 * The code also provides an implementation of the Either class, which represents a value that can be
 * either a Left value of type L or a Right value of type R.
 *
 * The Left class has a single value property of type L, while the Right class has a single value property
 * of type R. There are also left and right functions for creating Left and Right instances, respectively.
 */

/**
 * Represents an Results of success or error.
 * @public
 */
export class Result<T, E extends Error> {
   public readonly isSuccess: boolean;
   public readonly error: E | undefined;
   private readonly value: T | undefined;

   constructor(
      isSuccess: boolean,
      value?: T | undefined,
      error?: E | undefined
   ) {
      this.isSuccess = isSuccess;
      this.value = value;
      this.error = error;
   }

   public errorValue(): E {
      return <E>this.error;
   }

   public isOk(): boolean {
      return this.isSuccess;
   }

   public isErr(): boolean {
      return !this.isSuccess;
   }

   public unwrap(): T {
      if (this.isErr()) {
         throw this.error;
      }
      return this.value ?? <T>null;
   }

   /*
    * This method unwrapOr() is a m
    * */
   public unwrapOr(defaultValue: T): T {
      return this.isOk() ? this.value ?? <T>null : defaultValue;
   }

   public unwrapErr(): E {
      if (this.isOk()) {
         throw new Error("Called `unwrapErr()` on a `Result` that is Ok");
      }

      return <E>this.error;
   }

   /*
    * The map function in the Result class applies a transformation function to the
    * value inside the Result if it is an Ok result. If the Result is an Err, it returns the same Err value.
    *
    * @generic T  is the type of the value inside Result
    * @generic U is the type of the value that the mapper @function will transform the `Result` value into.
    *
    * @param mapper - function will transform the Result value into
    *
    * @example
    * ```ts
    * const result1 = Result.ok(5);
    * const result2 = Result.err(new Error("Something went wrong"));
    *
    * const mappedResult1 = result1.map((x) => x * 2); // Result.ok(10)
    * const mappedResult2 = result2.map((x) => x * 2); // Result.err(new Error("Something went wrong"))
    * ```
    *
    * @returns The value of mapper(value)
    *
    * */

   public map<U>(mapper: (value: T) => U): Result<U, E> {
      if (this.isErr()) {
         return Result.err(<E>this.error);
      }

      return Result.ok(mapper(this.value ?? <T>null));
   }

   public mapErr<F extends Error>(mapper: (error: E) => F): Result<T, F> {
      if (this.isOk()) {
         return Result.ok(this.value ?? <T>null);
      }
      return Result.err(mapper(<E>this.error));
   }

   public and<U>(res: Result<U, E>): Result<U, E> {
      if (this.isOk()) {
         return res;
      }

      return Result.err(<E>this.error);
   }

   /*
    * This method is used to chain together computations that @return a `Result` type.
    * It takes a function that maps the value of the current `Result` instance to a new `Result`
    * instance of a potentially different type.
    *
    * if `Result` = error - the function is not called
    * if `Result` = isSuccess - the function is called with the value of the success, and will @return value becomes the resulting `Result`
    *
    * function parseInteger(input: string): Result<number, Error> {
    *      const parsed = parseInt(input, 10);
    *
    *      if (isNaN(parsed)) {
    *       return Result.err(new Error("Invalid integer"));
    *      }
    *      return Result.ok(parsed);
    * }
    * function addOne(input: number): Result<number, Error> {
    *      return Result.ok(input + 1);
    * }
    *
    * const result = parseInteger("42").andThen(addOne);
    *
    * if (result.isOk()) {
    *      console.log(result.unwrap()); // prints 43
    * } else {
    *      console.error(result.unwrapErr());
    * }
    * */

   public andThen<U>(mapper: (value: T) => Result<U, E>): Result<U, E> {
      if (this.isErr()) {
         return Result.err(<E>this.error);
      }
      return mapper(this.value ?? <T>null);
   }

   public or(res: Result<T, E>): Result<T, E> {
      if (this.isOk()) {
         return Result.ok(this.value ?? <T>null);
      }
      return res;
   }

   /*
    * This method is used to provide an alternative value to a failed result. It takes a funtion that
    * maps the error value to another result.
    *
    * @example
    * const divide = (a: number, b: number): Result<number, Error> => {
    * if (b === 0) {
    *   return Result.err(new Error("Division by zero"));
    * }
    * return Result.ok(a / b);
    * };
    *
    * const result1 = divide(10, 2).orElse((error) => Result.ok(0));
    * console.log(result1); // prints Result {isSuccess: true, value: 5, error: undefined}
    * const result2 = divide(10, 0).orElse((error) => Result.ok(0));
    * console.log(result2); // prints Result {isSuccess: true, value: 0, error: undefined}
    *
    * @returns valeu - If the original result is successful, `orElse` simply returns it.
    * @returns alternativeValue - if the result is a failure, it applies the given function to the error value to get an alternative result
    * */
   public orElse<F extends Error>(
      mapper: (error: E) => Result<T, F>
   ): Result<T, F> {
      if (this.isOk()) {
         return Result.ok(this.value ?? <T>null);
      }
      return mapper(<E>this.error);
   }

   public static ok<T, E extends Error = never>(value: T): Result<T, E> {
      return new Result(true, value);
   }

   public static err<E extends Error>(error: unknown): Result<never, E> {
      return new Result(false, <never>undefined, <E>error);
   }
}
