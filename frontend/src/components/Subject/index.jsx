import React from "react";

const Subject = ({ subject,  showSubjectInfoModal }) => {
	return (
		subject && (
			<>
				<div
					
					onClick={(e) => {showSubjectInfoModal() ; e.stopPropagation()}}
					className="flex flex-wrap items-end justify-between w-full transition duration-500 ease-in-out transform bg-black border-2 border-gray-600 rounded-lg hover:border-white mb-3"
				>
					<div className="w-full xl:w-1/4 md:w-1/4">
						<div className="relative flex flex-col h-full p-8 ">
							<h2 className="mb-4 font-semibold tracking-widest text-white uppercase title-font">
								{subject?.email}
							</h2>
						</div>
					</div>
				</div>
			</>
		)
	);
};

export default Subject;
