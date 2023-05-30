// src/modules/fileUpload/application/ImageUploadApplicationService.ts

/* import { Request } from "express";
import { ImageUploadService } from "./fileUpload";
import { BadRequestError, UnexpectedError } from "@domain/logic/baseError";
import { ImageFile } from "@domain/entity/imageFile";
import {
	getByteOrder,
	getExifVersion,
	getIFDOffset,
	parseIFD,
	randomString,
} from "common";
import { DateTime, EXIF } from "@domain/value-objects";
 */

/* export class ImageUploadAggregatorService {
	constructor(private readonly imageUploadService: ImageUploadService) {}
	private readonly MAX_IMAGE_FILE_SIZE = 50000000 as const;

	private async validateImageSize(image: ImageFile): Promise<any> {
		if ((image.basic.size as number) > this.MAX_IMAGE_FILE_SIZE) {
			throw new BadRequestError(
				`Image must be smaller than ${this.MAX_IMAGE_FILE_SIZE} bytes`,
			);
		}
	}

	async uploadImage(req: Request): Promise<string | UnexpectedError> {
		const { file } = req.body;
		const { name, currentChunkIndex, size, totalChunks } = req.query;

		try {
			const imageFile = file as ImageFile;
			const name = `${await randomString(6)}.${
				imageFile.basic.format
			}`;

			return imageFile.basic.sharableLink as string;
		} catch (error: unknown) {
			let err;
			if (error instanceof Error) {
				err = new BadRequestError(
					`Failed to upload image: ${error.message}`,
				);
			}

			err = new UnexpectedError(`Failed to upload image: ${error}`);
			return err;
		}
	}

	async getExifData(buffer: Buffer): Promise<EXIF> {
		return new Promise((resolve, rejects) => {
			// create a DataView object from the buffer
			const dataView = new DataView(buffer);

			// Get the byte order of the DataView
			const byteOrder = getByteOrder(dataView, 0);

			// Get the offset to the Exif header
			const exifOffset = getExifOffset(dataView, 0);

			// get Exif VERSION
			const exifVersion = getExifVersion(
				dataView,
				exifOffset,
				byteOrder === "big-endian",
			);

			// Get the offset to the first IFD
			const ifdOffset = getIFDOffset(
				dataView,
				0,
				byteOrder === "big-endian",
			);

			// Parse the IFD and its tags
			const ifd = parseIFD(dataView, ifdOffset, byteOrder);

			// Extract the relevant EXIF data from the parsed IFD
			const exifData: EXIF = {
				resolution: {},
				datetime: new DateTime(<number>ifd.DateTimeOriginal),
				camera: {
					manufacture: ifd.Make,
					model: ifd.Model,
					apperture: ifd.FNumber,
					shotAt: "",
					shutterSpeed: ifd.ExposureTime,
				},

				version: exifVersion,
			};
 */
/*
 * Make: The manufacturer of the camera that took the photo.
 * Model: The model of the camera that took the photo.
 * ExposureTime: The length of time the camera's shutter was open when the photo was taken, represented as a fraction of a second.
 * FNumber: The aperture value used to take the photo. A smaller number represents a larger aperture, which allows more light to enter the camera and creates a shallower depth of field.
 * ISOSpeedRatings: The sensitivity of the camera's image sensor to light when the photo was taken. A higher ISO value represents higher sensitivity, but also increases noise in the image.
 * ExposureBiasValue: The amount of compensation applied to the camera's exposure settings when the photo was taken. A positive value represents overexposure, while a negative value represents underexposure.
 * DateTimeOriginal: The date and time the photo was taken, according to the camera's clock.
 * Flash: Whether or not a flash was used when the photo was taken, and the flash mode that was used.
 * FocalLength: The focal length of the lens used to take the photo, in millimeters.
 * FocalLengthIn35mmFilm: The equivalent focal length of the lens in 35mm film format.
 * ExifVersion: The version number of the Exif metadata standard used in the photo's metadata.
 * ColorSpace: The color space used by the photo. A value of 1 represents the sRGB color space, which is commonly used for web and consumer photography.
 * PixelXDimension: The width of the photo, in pixels.
 * PixelYDimension: The height of the photo, in pixels.
 * SensingMethod: The type of image sensor used by the camera.
 * SceneType: Whether the photo was taken with a direct or reflected light source.
 * ExposureMode: The exposure mode used by the camera when the photo was taken. A value of 1 represents autoexposure mode, while other values represent manual or semiautomatic exposure modes.
 * WhiteBalance: The white balance setting used by the camera when the photo was taken. A value of 0 represents auto white balance, while other values represent preset or custom white balance settings.
 * SceneCaptureType: The type of scene that the camera was set up to capture. A value of 0 represents a standard photograph, while other values represent specific scene types such as landscape, portrait, or sports.
 * LensInfo: Information about the lens used to take the photo, including the focal length range and maximum aperture.
 * LensModel: The model of the lens used to take the photo.
 * */

/* {
                  "Make": "Canon",
                  "Model": "Canon EOS 60D",
                  "ExposureTime": "1/60",
                  "FNumber": "5.6",
                  "ISOSpeedRatings": 3200,
                  "ExposureBiasValue": "0",
                  "DateTimeOriginal": "2011-12-25T12:47:01.000Z",
                  "Flash": "Flash did not fire, compulsory flash mode",
                  "FocalLength": "55",
                  "FocalLengthIn35mmFilm": "88",
                  "ExifVersion": "0230",
                  "ColorSpace": 1,
                  "PixelXDimension": 5184,
                  "PixelYDimension": 3456,
                  "SensingMethod": 2,
                  "SceneType": null,
                  "ExposureMode": 1,
                  "WhiteBalance": 0,
                  "SceneCaptureType": 0,
                  "LensInfo": "18-55mm f/3.5-5.6",
                  "LensModel": "EF-S18-55mm f/3.5-5.6"
                } */
/* 
		});
	}
} */
