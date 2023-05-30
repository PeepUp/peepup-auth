import { NextResponse } from "next/server";

export async function GET(request: Request) {
	return NextResponse.json({
		code: "200",
		status: "OK",
		timestamp: Date.now(),
		responseTime: process.hrtime()[1],
		message: "Hello, Photo Metadata here!",
		data: {
			meta: [seederPhotoMetadata, seederPhotoMetadata],
		},
	});
}

enum WhiteBalanceType {
	CLEAR_SKY = "Clear Sky",
	CLOUDY_AND_SHADE = "Cloudy and Shade",
	NOON_DAYLIGHT = "Noon Daylight",
	DAYLIGHT = "Daylight",
	FLASH = "Flash",
	FLUORESCENT = "Fluorescent",
	EARLY_MORNING_AND_LATE_EVENING = "Early Morning and Late Evening",
	TUNGSTEN_INCANDESCENT = "Tungsten Indescent",
	CANDLE_FLAME = "Candle Flame",
}

const seederPhotoMetadata: CreatePhotoDto[] = [
	{
		id: "6aba141d-7fb2-4318-95dd-13acde95d2ca",
		shareableLink:
			"http://localhost:8888/api/v0/photo/metadata/6aba141d-7fb2-4318-95dd-13acde95d2ca",
		author: {
			name: "Dulles Ansel",
			comment:
				"this is a picture of a man. he is jumping in the air and it looks like he is on a beach somewhere.",
		},
		contain: {
			isTracked: false,
			text: true,
			faces: true,
			comment: "this is a picture of myself",
			description:
				"this is a picture of a man. he is jumping in the air and it looks like he is on a beach somewhere.",
			watermarks: "",
			unreadable: true,
			metadata: true,
			hasDataAppended: true,
			hasCopyright: false,
			hasLabel: false,
		},
		device: {
			apperture: "f/1.4",
			type: "Nikon D200",
			model: "D200",
			makeBy: "-",
			shutterSpeed: 0.5, // make it 1/x
			megapixels: 2.2, //
			fieldOfView: 69.2, // in degree
			focalLength: 18.0, // in mm
			hyperfocalDistance: 2.89, // in m
			lightValue: 14.0,
			whiteBalance: WhiteBalanceType["CLEAR_SKY"],
			subjectDistanceRange: -1,
			flash: {
				isFired: false,
				isFunction: true,
				mode: undefined,
				hasRedEyeMode: false,
				hasReturn: false,
				pixVersion: "0100",
			},
			lens: {
				size: "18-200 mm f/3.5-5.6",
				info: "Shot at 18 mm (35mm film equiv: 27mm)",
			},
		},
		file: {
			name: "0292fd6cb4427700adaea8d435e4d940",
			type: "jpg",
			source: "Digital Camera",
			createTime: 1521350728,
			modifyTime: Date.now(),
			section: "unknown",
			dataChunked: 14000,
			bitDepth: 323,
			typeOfMIME: "image/jpg",
			sharpness: "normal",
			contrast: "low",
			customRendered: "normal",
			saturation: "normal",
			yCbCrSubSampling: "YCbCr4:4:4 (1 1)",
			ISO: 125,
			colorSpace: ["sRGB"],
			apperture: 12.4,
			label: "no label",
			softwareVersion: "Ver.111",
			creatorTool: "Adobe Photoshop Lightroom",
			compression: "JPEG (old-style)",
			zoomRatio: 1,
			exposure: {
				compensation: 0,
				mode: "Auto",
				program: "Program AE",
				time: "1/320",
			},
			exif: {
				version: "0221",
			},
			lightSource: "Fine Weather",
			scene: {
				captureType: "Standard",
				type: "Directly photographed",
			},
		},
		location: {
			latitude: 35.012471,
			longitude: 135.782573,
			altitude: 51.1,
			versionId: "2.2.0.0",
			latitudeRef: "North",
			longitudeRef: "East",
			altitudeRef: "Above sea level",
			mapDatum: "WGS-84",
		},
		resolution: {
			width: 1.8,
			height: 1.205,
			unit: "megapixels",
		},
	},
];

type CreatePhotoDto = {
	id: string;
	author: IAuthorInformationProperties;
	contain: IContainInformationProperties;
	device: IDeviceInformationProperties;
	file: IFileImageInformationProperties;
	location: ILocationInformationProperties;
	resolution: IResolutionInformationProperties;
	shareableLink: string;
};

type IAuthorInformationProperties = { name: string; comment: string };
type IContainInformationProperties = {
	isTracked: boolean;
	text: boolean;
	faces: boolean;
	comment: string;
	description: string;
	watermarks: string | string[];
	unreadable: boolean;
	metadata: boolean;
	hasDataAppended: boolean;
	hasCopyright: boolean;
	hasLabel: boolean;
};
type IDeviceInformationProperties = {
	apperture: string;
	type: string;
	model: string;
	makeBy: string;
	shutterSpeed: number; // make it 1/x
	megapixels: number; //
	fieldOfView: number; // in degree
	focalLength: number; // in mm
	hyperfocalDistance: number; // in m
	lightValue: number;
	whiteBalance: WhiteBalanceType;
	subjectDistanceRange: number;
	flash: Partial<FlashProperties>;
	lens: Partial<LensProperties>;
};

type IFileImageInformationProperties = {
	name: string;
	type: string;
	source: string;
	createTime: number;
	modifyTime: number;
	section: string | string[];
	dataChunked: number; // size of data dataChunked
	bitDepth: number;
	typeOfMIME: string;
	sharpness: Level;
	contrast: Level;
	customRendered: Level;
	saturation: Level;
	yCbCrSubSampling: string;
	ISO: number;
	colorSpace: string | string[];
	apperture: number;
	label: string;
	softwareVersion: string;
	creatorTool: string;
	compression: string;
	zoomRatio: number;
	exposure: ExposureProperties;
	exif: EXIFMetadata;
	lightSource: string;
	scene: SceneProperties;
};
type ILocationInformationProperties = {
	latitude: number;
	longitude: number;
	altitude: number;
	latitudeRef: string;
	longitudeRef: string;
	altitudeRef: string;
	mapDatum: string;
	versionId: string;
};
type IResolutionInformationProperties = {
	width: number;
	height: number;
	unit: string;
};
type Level = "high" | "normal" | "low";
type FlashProperties = {
	isFired: boolean;
	isFunction: boolean;
	mode: boolean | undefined;
	hasRedEyeMode: boolean;
	hasReturn: boolean;
	pixVersion: string;
};
type LensProperties = {
	size: string;
	info: string;
};
type ExposureProperties = {
	compensation: number;
	mode: string;
	program: string;
	time: string;
};
type SceneProperties = {
	captureType: string;
	type: string;
};
type EXIFMetadata = { version: string | number };
