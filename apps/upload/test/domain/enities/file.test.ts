import { NoSqlFileId } from "../../../src/domain/value-objects/fileId";
import { ContentFile, ImageFile } from "../../../src/domain/entity";

describe("FileEntity", () => {
	const buffer = Buffer.from([1, 2, 3]);
	const content = new ContentFile<Buffer>(`buffer`, buffer);
	const basicInfo = {
		id: new NoSqlFileId(),
		size: 1024,
		name: "test.txt",
		updated_at: 1649128900,
		created_at: 1649128800,
		format: ".jpeg",
		content: "Lorem ipsum dolor sit amet",
		lastModified: 1649128900,
		sharableLink: "https://example.com/file123",
		path: "/path/to/test.jpeg",
	};

	describe("new file", () => {
		test("should create a file entity with correct properties", () => {
			const image = new ImageFile(basicInfo, {}, content);
			/* const { id, created_at, updated_at, ...opt } = basicInfo; */
			expect(image).toEqual({
				basic: basicInfo,
				metadata: {},
				content,
			});
		});
	});
});
