import React from "react";

interface ButtonProps {
	name?: string;
	isDisabled?: boolean;
}

function Button({ name, isDisabled }: ButtonProps) {
	return (
		<button
			className="w-26 h-10 px-2 rounded-sm bg-floral dark:bg-linear-suface--dark-btn dark:text-earie-black"
			disabled={isDisabled}
		>
			{name}
		</button>
	);
}

export default Button;
