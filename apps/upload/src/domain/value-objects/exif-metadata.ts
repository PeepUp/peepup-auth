/*  Note that not all images will have Exif metadata,
 *  and the metadata may vary depending on the camera or
 *  device used to capture the image. */
import { File } from "buffer";
import { DateTime } from "./dateTimes";

export interface EXIF {
   readonly resolution: Resolution;
   readonly datetime: DateTime;
   readonly camera: Camera;
   readonly flash: FlashProperties;
   readonly lens: LensProperties;
   readonly version: string;
}

export type Resolution = {
   height: number;
   width: number;
   rasio: number;
   size: number;
   units: string;
   resolution: number;
   dimension: number;
};

export type Camera = {
   manufacture: string;
   shotAt: string;
   apperture: number;
   model: string;
   shutterSpeed: number;
   megapixels: number;
   fieldOfView: number;
   focalLength: number;
   hyperfocalDistance: number;
   lightValue: number;
   whiteBalance: number;
   subjectDistanceRange: number;
};

export type LensProperties = {
   size: number;
   info: string;
};

export type FlashProperties = {
   isFired: boolean;
   isFunction: boolean;
   mode: boolean;
   hasRedEyeMode: boolean;
   hasReturn: boolean;
   pixVersion: string;
};

import exifr from "exifr";

export async function getExifData(file: File): Promise<any> {
   const exifData = await exifr.parse(file);
   return exifData;
}

/* const getExifData = (buffer: Buffer): Promise<any> => {
	return new Promise((resolve, reject) => {
		const dataView = new DataView(buffer);

		if (dataView.getUint16(0, false) !== 0xffd8) {
			reject(new Error("Not a valid JPEG image"));
			return;
		}
		const length = dataView.byteLength;
		let offset = 2;
		while (offset < length) {
			if (dataView.getUint16(offset + 2, false) <= 8) break;
			const marker = dataView.getUint16(offset, false);
			offset += 2;
			if (marker === 0xffe1) {
				const exifData = {};
				const tiffOffset =
					offset + 2 + dataView.getUint16(offset, false);
				const tiffDataView = new DataView(
					reader.result.slice(tiffOffset, tiffOffset + 20),
				);
				if (tiffDataView.getUint16(0, false) === 0x4949) {
					const exifOffset = tiffDataView.getUint32(4, false);
					const exifDataView = new DataView(
						reader.result.slice(
							tiffOffset + exifOffset,
							tiffOffset + exifOffset + 20,
						),
					);
					if (exifDataView.getUint16(0, false) === 0x4578) {
						const endian =
							exifDataView.getUint16(2, false) === 0x4949
								? "little"
								: "big";
						const tagsCount = exifDataView.getUint16(
							4,
							endian,
						);
						let tagsOffset = 8;
						for (let i = 0; i < tagsCount; i++) {
							const tagOffset = tagsOffset + i * 12;
							const tagId = exifDataView.getUint16(
								tagOffset,
								endian,
							);
							if (tagId === 0x0112) {
								const orientation =
									exifDataView.getUint16(
										tagOffset + 8,
										endian,
									);
								exifData.orientation = orientation;
							}
						}
						resolve(exifData);
					}
				}
				break;
			} else {
				offset += dataView.getUint16(offset, false);
			}
		}

		reject(new Error("No Exif data found"));
	});
}; */
