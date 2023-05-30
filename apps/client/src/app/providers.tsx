"use client";

import Provider from "@/providers";

export const Providers = ({ children }: { children: React.ReactNode }) => {
	return <Provider>{children}</Provider>;
};
