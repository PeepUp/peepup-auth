export const navigationLinks = [
	["abtus", "/", "About us"],
	["upload", "/upload", "Upload"],
	["repository", "/", "Source"],
	["book", "/", "Tools"],
	["project", "/", "Docs"],
] as const;

export const animation = {
	hide: { y: -8, opacity: 0 },
	show: {
		y: 0,
		opacity: 1,
	},
} as const;
