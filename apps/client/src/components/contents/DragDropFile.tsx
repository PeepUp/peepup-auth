import React from "react";
import useDragAndDrop from "@/hooks/useDragAndDrop";
import { UploaderIcon } from "../ui/icons";
import clsx from "clsx";

function DragAndDropZone() {
	const [isOpen, setIsOpen] = React.useState(false);
	const { handleDrop, handleDragOver, handleDragLeave, isDragging } =
		useDragAndDrop(setIsOpen);

	if (isOpen) return <div>The file must be an image png or jpeg</div>;

	return (
		<div
			className={`flex flex-col justify-center items-center py-2 box-border rounded-xl select-none ${
				isDragging ? "cursor-pointer" : ""
			}`}
			onDrop={(e) => handleDrop(e)}
			onDragOver={(e) => handleDragOver(e)}
			onDragLeave={(e) => handleDragLeave(e)}
		>
			<div
				style={{ backgroundImage: "/uploader_immersive" }}
				className={clsx(
					"absolute -inset-8 z-[-1] rounded-[10%] bg-[length:180%_180%] bg-center opacity-30 blur-2xl",
					"hidden", // disable immersive on light mode
					"dark:block"
				)}
			/>
			<div
				className={clsx(
					"backdrop-blur",
					`flex max-w-sm ${isDragging ? "scale-105" : ""}`
				)}
			>
				<UploaderIcon
					props={{ className: clsx("") }}
					anoth={{ isDragging }}
				/>
			</div>
			<p className="font-thin text-xs text-center dark:text-snow">
				Drag & Drop file here
			</p>
		</div>
	);
}

export default DragAndDropZone;
