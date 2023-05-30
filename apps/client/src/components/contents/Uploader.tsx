"use client";

import React from "react";
import DragAndDropZone from "./DragDropFile";
import Uploaded from "./UploadedPreview";
import useFile from "@/hooks/useFile";
import { Context } from "@/context/context";
import SpinnerLoading from "../ui/SpinnerLoading";

function Uploader() {
	const { file, loading } = React.useContext(Context);

	if (loading !== 0) {
		return (
			<div className="flex flex-col justify-center items-center rounded-xl w-full mx-auto max-w-[450px] h-[500px] px-10 dark:bgcard-linear-suface-1-v2--dark">
				<SpinnerLoading />
			</div>
		);
	} else if (file && loading === 0) {
		return (
			<div className="flex flex-col justify-center items-center rounded-xl w-full mx-auto max-w-[450px] h-auto px-10 dark:bgcard-linear-suface-1-v2--dark">
				<Uploaded />
			</div>
		);
	} else {
		return (
			<div className="flex flex-col justify-start items-center rounded-xl w-full mx-auto max-w-[450px] h-[320px] px-10 border-2 border-dashed border-earie-black dark:border-snow dark:bgcard-linear-suface-1-v2--dark">
				<ChooseFileUploader />
			</div>
		);
	}
}

export default Uploader;

const ChooseFileUploader = () => {
	const { fileInputRef, handleChooseFile, handleChange } = useFile();

	return (
		<>
			<DragAndDropZone />
			<input
				ref={fileInputRef}
				className="none hidden"
				type="file"
				multiple={false}
				onChange={handleChange}
			/>
			<p className="font-thin dark:text-snow/50 text-[8px] mb-4">
				*accepted image extension : png, jpg, jpeg
			</p>
			<button
				className="w-72 h-8 px-2 font-thin text-xs text-earie-black ring-2 ring-earie-black dark:ring-snow/50 rounded-lg dark:text-snow focus:outline-none dark:shadow-btn-dark shadow-btn"
				onClick={handleChooseFile}
			>
				Choose files
			</button>
		</>
	);
};
