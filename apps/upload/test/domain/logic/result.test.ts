import { Result } from "../../../src/domain/logic";

describe("Result", () => {
	describe("ok", () => {
		it("should create an Ok result", () => {
			const result = Result.ok("success");
			expect(result.isOk()).toBe(true);
			expect(result.unwrap()).toBe("success");
			expect(result.isSuccess).toBe(true);
			expect(result.error).toBeUndefined();
		});
	});

	describe("err", () => {
		it("should create an Error result", () => {
			const err = new Error();
			err.name = "Test Error";
			err.message = JSON.stringify({
				cause: { code: "NonCoprime", values: [1, 1] },
				details: "too many parentheses in regular expression",
			});

			const result = Result.err(err);

			expect(result.isSuccess).toBe(false);
			expect(result.isErr()).toBe(true);
			expect(result.unwrapErr()).toEqual(err);
			expect(result.error).toBe(err);
			expect(() => result.unwrap()).toThrowError(err);
		});
	});

	describe("map", () => {
		it("should transform the value of an Ok result", () => {
			const result = Result.ok(5).map(value => value * 2);
			expect(result.isOk()).toBe(true);
			expect(result.unwrap()).toBe(10);
		});

		it("should return the original error of an Err result", () => {
			const error = new Error("failure");
			const result = Result.err(error).map(value => value * 2);
			expect(result.isErr()).toBe(true);
			expect(result.error).toBe(error);
		});
	});

	describe("mapErr", () => {
		it("should transform the error of an Err result", () => {
			const result = Result.err(new Error("failure")).mapErr(
				error => new Error(`mapped ${error.message}`),
			);

			expect(result.isErr()).toBe(true);
			expect(result.error?.message).toBe("mapped failure");
		});

		it("should return the original value of an Ok result", () => {
			const result = Result.ok(5).mapErr(
				(_error: { name: string; message: string }) => ({
					name: "test mapper",
					message: "Value should be 5",
				}),
			);

			expect(result.isOk()).toBe(true);
			expect(result.unwrap()).toBe(5);
		});
	});

	describe("unwrapOr", () => {
		it("should return the value if successful", () => {
			const result = Result.ok(42);
			expect(result.unwrapOr(0)).toBe(42);
		});

		it("should return the default value if failed", () => {
			const error = new Error("Something went wrong");
			const result = Result.err(error);
			expect(result.unwrapOr(null as never)).toBe(null);
		});
	});

	describe("orElse", () => {
		it("should returns the original result if it is OK", () => {
			const result = Result.ok<string, Error>("hello");
			const defaultResult = Result.ok<string, Error>("world");
			const mappedResult = result.orElse(() => defaultResult);

			expect(mappedResult.isOk()).toBe(true);
			expect(mappedResult.unwrap()).toBe("hello");
		});

		it("should returns the default result if the original is Error", () => {
			const error = new Error("Something went wrong!");
			const result = Result.err<Error>(error);
			const defaultResult = Result.ok<string, Error>("world");
			const mappedResult = result.orElse(() => defaultResult as never);
			expect(mappedResult.isOk()).toBe(true);
			expect(mappedResult.unwrap()).toBe("world");
		});

		it("should maps the error to a different type of error", () => {
			const error = new Error("Something went wrong!");
			const result = Result.err<Error>(error);
			const mappedResult = result.orElse(err =>
				Result.err<TypeError>(new TypeError(err.message)),
			);
			expect(mappedResult.isErr()).toBe(true);
			expect(mappedResult.unwrapErr()).toBeInstanceOf(TypeError);
			expect(mappedResult.unwrapErr().message).toBe(
				"Something went wrong!",
			);
		});
	});
});
