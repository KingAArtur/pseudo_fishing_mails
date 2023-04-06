import React from "react";

const Response = ({ response,  showResponseInfoModal }) => {
	return (
		response && (
			<>
				<div
					
					onClick={(e) => {showResponseInfoModal() ; e.stopPropagation()}}
					className="flex flex-wrap items-end justify-between w-full transition duration-500 ease-in-out transform bg-black border-2 border-gray-600 rounded-lg hover:border-white mb-3"
				>
					<div className="w-full xl:w-1/4 md:w-1/4">
						<div className="relative flex flex-col h-full p-8 ">
							<h2 className="mb-4 font-semibold tracking-widest text-white uppercase title-font">
								subject_id: {response?.subject_id}, letter_id: {response?.letter_id}, created_at: {response?.created_at}
							</h2>
						</div>
					</div>
				</div>
			</>
		)
	);
};

export default Response;
