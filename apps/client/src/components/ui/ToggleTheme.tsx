"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

function ToggleTheme() {
	const [changeTheme, setChangeTheme] = useState(false);
	const { resolvedTheme, setTheme } = useTheme();

	useEffect(() => setChangeTheme(true), []);

	return (
		<button
			aria-label="Toggle Theme Mode"
			type="button"
			className={`
                flex group w-8 h-8 xl:w-12 xl:h-12 
                items-center
                justify-center
                rounded-lg xl:rounded-xl
                dark:bg-earie-black 
                transition ease 
                drop-shadow-md 
                dark:bg-linear-suface--dark-btn 
                focus:outline-none text-gray-300  
                dark:shadow-btn-dark shadow-btn bg-linear-suface--light-btn`}
			onClick={() =>
				setTheme(resolvedTheme === "dark" ? "light" : "dark")
			}
		>
			{changeTheme && (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					enableBackground="accumulate"
					className={`   
                        w-5 h-5 
                        xl:w-6 xl:h-6 
                        text-royal-purple 
                        transition ease
                        dark:text-floral 
                    `}
				>
					{resolvedTheme === "dark" ? (
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
						/>
					) : (
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
						/>
					)}
				</svg>
			)}
		</button>
	);
}
export default ToggleTheme;
