"use client";
import React from "react";
import Image from "next/image";
import { Context } from "@/context/context";
import Link from "next/link";

const Uploaded = () => {
	const { file, setFile } = React.useContext(Context);
	const [isOpen, setIsOpen] = React.useState(false);

	if (isOpen) {
		return <div>Copied to clipboard successfully!</div>;
	}

	return (
		<div className="flex flex-col justify-start py-4 gap-4 items-center w-full mx-auto">
			<div className="flex justify-center max-w-lg h-auto drop-shadow-md shadow-black">
				<h1 className="absolute text-2xl text-green-500 right-0 pr-2">
					✓
				</h1>
				<Image
					className="object-cover rounded-md w-64 h-52"
					width={100}
					height={100}
					src={file}
					placeholder="empty"
					priority={true}
					loading="eager"
					alt="Your image"
					onContextMenu={(e: any) => {
						e.preventDefault();
					}}
				/>
			</div>
			<div className="flex justify-center gap-6">
				<Link
					href={file}
					className="hidden"
					target="_blank"
					rel="noopener noreferrer"
				></Link>
				<button
					className="w-32 h-8 px-2 font-thin text-xs ring-2 dark:ring-floral/50 rounded-lg bg-floral dark:bg-earie-black dark:text-floral dark:bg-linear-suface--dark-btn focus:outline-none dark:shadow-btn-dark shadow-btn bg-linear-suface--light-btn"
					onClick={() => {
						navigator.clipboard.writeText(file);
						setIsOpen(true);
					}}
				>
					Copy link
				</button>
				<button
					className="w-32 h-8 px-2 font-thin text-xs ring-2 dark:ring-floral/50 rounded-lg bg-floral dark:bg-earie-black dark:text-floral dark:bg-linear-suface--dark-btn focus:outline-none dark:shadow-btn-dark shadow-btn bg-linear-suface--light-btn"
					onClick={() => setFile("")}
				>
					Get Back
				</button>
			</div>
		</div>
	);
};

export default Uploaded;
