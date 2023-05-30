import clsx from "clsx";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type ModalProps = {
	content: string;
	icon: string;
	color: string;
	close: () => void;
};

function ModalUI({ content, icon, color, close }: ModalProps) {
	return (
		<div
			className={clsx(
				"flex flex-col absolute",
				"top-[8rem] left-0 right-0 bottom-0",
				"m-auto w-full h-full p-60",
				"items-center content-center",
				"rounded-xl z-10",
				[`text-${color}`]
			)}
		>
			<div>test modal</div>
			<button
				className={clsx("px-4 py-2 dark:ring-snow")}
				onClick={close}
			>
				Close
			</button>
		</div>
	);
}

function Modal(props: ModalProps) {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
		return () => setMounted(false);
	}, []);

	const container = document.getElementById("modal");

	if (!mounted || !container) {
		console.log("modal is not found!");
		return null;
	}
	return createPortal(<ModalUI {...props} />, container);
}

export default Modal;
