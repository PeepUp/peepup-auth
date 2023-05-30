import { ApiRoute } from "./infra/http/api/routes/v1";

import { App } from "./infra/http/app";

const app = new App([new ApiRoute()]);

app.listen();
/*import * as fs from "fs";
import path from "path";
import exifr from "exifr";
const ExifImage = require("exif").ExifImage;

const imgPath = path.join(__dirname, "png_with_exif_and_gps.png");

async function getExifData(file: string): Promise<any> {
	const buffer = await fs.promises.readFile(file);
	const exifData = await exifr.	parse(buffer, true);
	const gps = await exifr.gps(buffer);
	const orientation = await exifr.orientation(buffer);

	console.log({ exifData, gps, orientation });

	return exifData;
}

async function main() {
	try {
		new ExifImage({ image: imgPath }, function (
			error: unknown,
			exifData: any
		) {
			if (error) console.log("Error frist: " + error);
			else {
				const uint8array = new TextEncoder().encode(
					exifData.exifData?.makerNote
				);

				const makerNote = new TextDecoder().decode(uint8array);

				console.log(makerNote);
			} // Do something with your data!
		});
	} catch (error) {
		console.log("Error: " + error);
	}

	const buffer = fs.readFileSync(imgPath);
	const a = await getExifData(imgPath);
}

main(); */
