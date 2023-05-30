import {
	UnexpectedError,
	UnexpectedErrorType,
} from "../../../src/domain/logic";

describe("UnexpectedError", () => {
	it("should create an instance with the correct error message and data", () => {
		const err: UnexpectedErrorType = new Error();
		err.name = "Name";
		err.message = "UnexpectedErrorType";
		err.data = {
			cause: { code: "NonCoprime", values: [1, 1] },
			details: "too many parentheses in regular expression",
		};

		const unexpectedError = new UnexpectedError(err);
		expect(unexpectedError.errorValue().message).toBe(err.message);
		expect(unexpectedError.isErr()).toBe(true);
		expect(unexpectedError.isSuccess).toBe(false);
		expect(unexpectedError.errorValue().data).toBe(err.data);
	});

	it("should create an instance with the correct error message and data using the create static method", () => {
		const errorData: UnexpectedErrorType = new Error();
		errorData.name = "Name";
		errorData.message = "UnexpectedErrorType";
		errorData.data = {
			cause: { code: "NonCoprime", values: [1, 1] },
			details: "too many parentheses in regular expression",
		};

		const unexpectedError = UnexpectedError.create(errorData);
		expect(unexpectedError.isErr()).toBe(true);
		expect(unexpectedError.errorValue().message).toBe(errorData.message);
		expect(unexpectedError.errorValue()).toBe(errorData);
	});
});
