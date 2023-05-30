import type { ReactNode } from "react";

function SectionContainer({ children }: { children: ReactNode }) {
	return (
		<section className="w-full flex flex-col justify-center items-center">
			{children}
		</section>
	);
}
export default SectionContainer;
