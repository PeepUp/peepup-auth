import { Context } from "@/context/context";
import React from "react";

const useFile = () => {
	const fileInputRef = React.useRef<HTMLInputElement>(null);
	const { setFile, setLoading } = React.useContext(Context);

	const handleChooseFile = () => {
		if (!fileInputRef.current) return;

		fileInputRef.current.click();
	};

	const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		console.log({ file });

		if (!file) return;

		try {
			await sendFileChunks("http:8000/api/v1/uploads", file);
		} catch (error) {
			console.log({ error });
		}

		readFile(file);
	};

	const readFile = (file: any) => {
		const reader = new FileReader();
		console.log(reader);
		setLoading(0);

		reader.readAsDataURL(file);

		reader.onprogress = async e => {
			// The real one is very fast, we need to simulate it
			if (e.lengthComputable) {
				const percentLoaded = Math.round(
					(e.loaded / e.total) * 100,
				);
				setLoading(percentLoaded);
			}

			// Simulate the loading
			let percentLoaded = 0;

			const interval = setInterval(() => {
				setLoading(percentLoaded++);

				console.log({ percentLoaded });
				if (percentLoaded === 100) {
					clearInterval(interval);
					setLoading(0);
				}
			}, 5);
		};

		reader.onload = (e: any) => {
			setFile(e.target.result);
			setLoading(0);
		};
	};

	const sendFileChunks = async (
		url: string,
		file: Blob,
		chunkSize = 10240,
	): Promise<void> => {
		const totalChunks = Math.ceil(file.size / chunkSize);

		for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
			const start = chunkIndex * chunkSize;
			const end = Math.min(start + chunkSize, file.size);
			const chunk = file.slice(start, end);

			const res = await fetch(url, {
				method: "POST",
				headers: {
					"Content-Type": "application/octet-stream",
					"X-Chunk-Index": chunkIndex.toString(),
					"X-Total-Chunks": totalChunks.toString(),
				},
				body: chunk,
			});

			if (!res.ok) {
				throw new Error(
					`Error sending image chunk ${chunkIndex}: ${res.statusText}`,
				);
			}
		}
	};

	return {
		fileInputRef,
		handleChooseFile,
		handleChange,
		readFile,
	};
};

export default useFile;
