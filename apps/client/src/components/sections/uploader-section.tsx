"use client";

import Uploader from "../contents/Uploader";
import SectionContainer from "../utils/SectionContainer";
import UploaderProvider from "@/context/provider";

function UploaderSection() {
	return (
		<UploaderProvider>
			<SectionContainer>
				<Uploader />
			</SectionContainer>
		</UploaderProvider>
	);
}

export default UploaderSection;
