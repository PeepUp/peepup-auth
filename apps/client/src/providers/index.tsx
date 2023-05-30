import { ThemeProvider } from "next-themes";

import type { PropsWithChildren } from "react";

function Provider({ children }: PropsWithChildren) {
	return (
		<ThemeProvider
			defaultTheme="dark"
			enableColorScheme
			enableSystem={true}
			attribute="class"
			disableTransitionOnChange={false}
		>
			{children}
		</ThemeProvider>
	);
}

export default Provider;
