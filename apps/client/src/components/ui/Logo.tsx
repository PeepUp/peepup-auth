"use client";

function Logo() {
	return (
		<div className="flex group justify-center items-center w-8 h-8 xl:h-12 xl:w-12">
			<svg
				viewBox="0 0 30 30"
				xmlns="http://www.w3.org/2000/svg"
				className={`
                    rounded-full
                    shadow-btn drop-shadow-md
                    stroke-earie-black
                    bg-linear-suface--light-btn
                    dark:fill-earie-black
                    dark:bg-[#1C1B1F]
                `}
			>
				<path
					d="M23.9018 20.6498L15.4362 24.4282C15.3039 24.4869 15.1548 24.5239 15.0001 24.5239C14.8454 24.5239 14.701 24.4879 14.5687 24.4291L6.09843 20.6497C5.72023 20.4805 5.47632 20.1082 5.47632 19.6983V10.051C5.47632 9.63092 5.7305 9.25258 6.12224 9.08936L6.19463 9.05918L6.21642 9.0501L14.588 5.55881C14.7201 5.50388 14.8596 5.47631 15.0001 5.47631C15.1407 5.47631 15.2801 5.50387 15.4124 5.55891L23.878 9.08947C23.8976 9.09761 23.9124 9.11223 23.9313 9.12142C23.9639 9.13917 23.9952 9.15714 24.0258 9.17823C24.3283 9.36745 24.5239 9.68929 24.5239 10.0511V19.6983C24.5239 20.1082 24.28 20.4805 23.9018 20.6498ZM7.59272 19.0242L13.9419 21.858V14.501L7.59272 11.636V19.0242ZM15.0001 7.65454L9.20933 10.0693L15.0001 12.6822L20.7909 10.0694L15.0001 7.65454ZM22.4075 11.6361L16.0583 14.5011V21.8581L22.4075 19.0243V11.6361Z"
					className="self-center stroke-[1.2px] fill-royal-purple dark:fill-earie-black stroke-floral dark:stroke-floral"
				/>
			</svg>
		</div>
	);
}

export default Logo;
