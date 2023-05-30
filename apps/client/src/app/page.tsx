import clsx from "clsx";

function Home() {
	return (
		<section>
			<div
				className={clsx(
					"flex relative flex-col h-screen w-full items-center justify-center bg-white dark:bg-earie-black"
				)}
			>
				<h1 className={clsx("text-center font-bold text-6xl ")}>
					Metadata viewer
				</h1>
			</div>
			<div
				className={clsx(
					"flex mt-16 flex-col w-full items-center justify-center bg-transparent dark:bg-transparent"
				)}
			>
				<div className={clsx("flex")}>
					<h1
						className={clsx(
							"font-extrabold text-start dark:text-snow text-2xl md:text-4xl"
						)}
					></h1>
				</div>
			</div>
		</section>
	);
}

export default Home;
