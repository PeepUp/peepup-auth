import React from "react";
import { Context } from "./context";

const UploaderProvider = ({ children }: UploaderProviderProps) => {
	const [file, setFile] = React.useState("");
	const [loading, setLoading] = React.useState(0);

	return (
		<Context.Provider value={{ file, setFile, loading, setLoading }}>
			{children}
		</Context.Provider>
	);
};

type UploaderProviderProps = {
	children: React.ReactNode;
};

export default UploaderProvider;
