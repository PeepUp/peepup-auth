import { DateTime } from "../../../src/domain/value-objects";

describe("DateTimes Value Objects", () => {
	describe("New Date", () => {
		test("Should be create new Date properly", () => {
			const now = Date.now();
			const dateTime = new DateTime(now);
			expect(dateTime.getTimestamp()).toBe(now);
		});
	});

	describe("timestamp to string", () => {
		test("Should be create convert timestamp to string date", () => {
			const now = Date.now();
			const dateTime = new DateTime(now);
			expect(dateTime.toString()).toEqual(new Date(now).toString());
		});
	});

	describe("get string date", () => {
		test("Should be return string date", () => {
			const now = Date.now();
			const dateTime = new DateTime(now);
			expect(dateTime.getStringDate()).toEqual(
				new Date(now).toDateString(),
			);
		});
	});

	describe("get string time", () => {
		test("Should be return string time", () => {
			const now = Date.now();
			const dateTime = new DateTime(now);
			expect(dateTime.getStringTime()).toEqual(
				new Date(now).toTimeString(),
			);
		});
	});

	describe("get JSON Local time", () => {
		test("Should be return JSON Local time", () => {
			const now = Date.now();
			const dateTime = new DateTime(now);

			console.debug(new Date(now).toJSON());
			expect(dateTime.toJSONLocalTime()).toEqual(
				new Date(now).toJSON(),
			);
		});
	});

	describe("get Local date time", () => {
		test("Should be return current Local date time with format(dd/mm/yyyy)", () => {
			const now = Date.now();
			const dateTime = new DateTime(now);

			console.debug(new Date(now).toLocaleString());
			expect(dateTime.toLocalString()).toEqual(
				new Date(now).toLocaleString(),
			);
		});
	});

	describe("get Local date", () => {
		test("Should be return current Local Date with format(dd/mm/yyyy)", () => {
			const now = Date.now();
			const dateTime = new DateTime(now);

			console.debug(new Date(now).toLocaleDateString());
			expect(dateTime.toLocalDateString()).toEqual(
				new Date(now).toLocaleDateString(),
			);
		});
	});

	describe("get Local Time", () => {
		test("Should be return current Local time with format(ss:mm:hh)", () => {
			const now = Date.now();
			const dateTime = new DateTime(now);

			console.debug(new Date(now).toLocaleTimeString());
			expect(dateTime.toLocalTimeString()).toEqual(
				new Date(now).toLocaleTimeString(),
			);
		});
	});

	describe("toFormat", () => {
		test("Should be return date time with given datetime format options", () => {
			const now = Date.now();
			const dateTime = new DateTime(now).toFormat("en-us", {
				weekday: "long",
				year: "2-digit",
				month: "long",
				day: "numeric",
				hour12: false,
			});
			console.debug(dateTime);
		});
	});
});
