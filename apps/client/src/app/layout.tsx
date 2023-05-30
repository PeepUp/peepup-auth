import "../styles/globals.css";
import { Metadata } from "next";
import { Providers } from "./providers";
import { Roboto } from "next/font/google";
import { clsx } from "clsx";
import { Navigation } from "@/components/Navigation";

export const metadata: Metadata = {
	title: {
		default: "See",
		template: "%s | See",
	},
	description: "Metadata, tools, viewer",
	openGraph: {
		title: "See",
		description: "Metadata, tools, and viewer.",
		url: "https://see.coocobolo.com",
		siteName: "See sites",
		images: [
			{
				url: "https://see.coocobolo.com",
				width: 1920,
				height: 1080,
			},
		],
		locale: "en-US",
		type: "website",
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},
	icons: {
		shortcut: "/favicon.ico",
	},
};

const roboto = Roboto({
	weight: "500",
	subsets: ["latin"],
	display: "swap",
});

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body
				className={clsx([
					roboto.className,
					"text-earie-black bg-white dark:text-floral dark:bg-earie-black flex flex-col",
				])}
			>
				<main className={clsx("flex min-w-0 flex-col")}>
					<Providers>
						<Navigation />
						{children}
					</Providers>
				</main>
			</body>
		</html>
	);
}
