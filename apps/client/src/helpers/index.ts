export const checkSizeFile = (x: string | number) => {
	let n = parseInt(x.toString(), 10) || 0;
	const units = ["B", "KB", "MB", "GB", "TB"];

	for (let i = 0; i < units.length; i++) {
		if (n < 1024) {
			return {
				size: n.toFixed(n < 10 && i > 0 ? 1 : 0),
				flag: units[i],
			};
		}
		n /= 1024;
	}

	return { size: n.toFixed(1), flag: units[units.length - 1] };
};
