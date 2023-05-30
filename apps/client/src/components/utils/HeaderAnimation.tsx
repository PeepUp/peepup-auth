"use client";

import { useScrollPosition } from "@/hooks/useScrollPosition";
import { motion } from "framer-motion";
import { animation } from "@/components/constant";

function HeaderWithAnimation({ children }: { children: React.ReactNode }) {
	const classNames = (...classes: string[]) =>
		classes.filter(Boolean).join(" ");

	const scrollPosition = useScrollPosition();

	return (
		<motion.header
			className={classNames(
				scrollPosition > 0
					? "backdrop-blur-sm dark:bg-black/20"
					: "bg-snow dark:bg-earie-black",
				"w-full lg:min-w-xs lg:max-w-screen-md rounded-b-lg sticky top-0 flex flex-col justify-center items-center z-10 transition ease-in-out mx-auto"
			)}
			initial={animation.hide}
			animate={animation.show}
			transition={{ delay: 0.5 }}
		>
			{children}
		</motion.header>
	);
}

export default HeaderWithAnimation;
