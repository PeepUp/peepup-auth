"use client";

import Link from "next/link";
import { navigationLinks } from "../constant";

function NavLinkItems() {
	return (
		<div className="flex flex-col relative max-w-xl ring-1 lg:ring-2 rounded-md ring-earie-black/80 dark:ring-snow/80 items-center py-2 xl:py-4 justify-center drop-shadow-md shadow-card dark:shadow-card-dark">
			<dl className="flex text-[12px] lg:text-sm font-thin items-center mx-2 gap-4 md:mx-6">
				{navigationLinks.map(([title, url, svg]) => (
					<Link
						href={`${url}`}
						className="text-earie-black dark:text-snow"
						draggable={false}
						key={title}
						title={title}
					>
						{svg}
					</Link>
				))}
			</dl>
		</div>
	);
}

export default NavLinkItems;
