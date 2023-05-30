import React from "react";
import { DocsThemeConfig } from "nextra-theme-docs";

const config: DocsThemeConfig = {
	logo: <span style={{ fontWeight: "bold" }}>DoFavour API</span>,
	project: {
		link: "https://github.com/kbgjtn/doFavour",
	},
	chat: {
		link: "https://discord.com",
	},
	docsRepositoryBase: "https://github.com/shuding/nextra-docs-template",
	footer: {
		text: "MIT 2023 © DoFavour",
	},
};

export default config;
