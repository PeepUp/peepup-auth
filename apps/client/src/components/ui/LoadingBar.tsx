"use client";

function LoadingBar({ loading }: { loading: number }) {
	console.log({ LOAD: loading });
	return (
		<div className="flex flex-col z-10 justify-center items-center max-w-xl">
			<p className="font-normal text-[8px] text-snow"> {loading + "%"}</p>
			<svg height="6" width="300">
				<line
					x="0"
					y="0"
					x2={`${loading}%`}
					y2="0"
					className={"stroke-black stroke-6 dark:stroke-white"}
				/>
			</svg>
		</div>
	);
}

export default LoadingBar;
