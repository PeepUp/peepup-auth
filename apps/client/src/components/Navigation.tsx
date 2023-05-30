"use client";
import ToggleTheme from "./ui/ToggleTheme";
import HeaderWithAnimation from "./utils/HeaderAnimation";
import Logo from "./ui/Logo";
import NavLinkItems from "./ui/NavLinkItems";

export const Navigation = () => {
	return (
		<HeaderWithAnimation>
			<nav className="flex w-full h-16 xl:h-20 px-6 items-center justify-between bg-grey-50">
				<Logo />
				<NavLinkItems />
				<ToggleTheme />
			</nav>
		</HeaderWithAnimation>
	);
};
