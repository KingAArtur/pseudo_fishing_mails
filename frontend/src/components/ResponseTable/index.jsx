import Response from "../Response";
import React, {useState} from "react";
import PopupModal from "../Modal/PopupModal";
import FormInput from "../FormInput/FormInput";

const ResponseTable = ({responses}) => {

  const [responseInfoModal, setResponseInfoModal] = useState(false)

    return (
      <>
        <div className="sections-list">
          {responses.length && (
              responses.map((response) => (
                <Response showResponseInfoModal={() => setResponseInfoModal(response)} key={response.id} response={response}  />
              ))
          )}
          {!responses.length && (
              <p>No responses found!</p>
          )}
        </div>
        {responseInfoModal && <PopupModal
						modalTitle={"Информация об отклике"}
						onCloseBtnPress={() => {
							setResponseInfoModal(false);
						}}
					>
						<div className="mt-4 text-left">
							<form className="mt-5">
								<FormInput
									disabled
									type={"text"}
									name={"id"}
									label={"id"}
									value={responseInfoModal?.id}
								/>
								<FormInput
									disabled
									type={"text"}
									name={"subject_id"}
									label={"id испытуемого"}
									value={responseInfoModal?.subject_id}
								/>
								<FormInput
									disabled
									type={"text"}
									name={"letter_id"}
									label={"id письма"}
									value={responseInfoModal?.letter_id}
								/>
								<FormInput
									disabled
									type={"text"}
									name={"created_at"}
									label={"Дата"}
									value={responseInfoModal?.created_at}
								/>
							</form>
						</div>
					</PopupModal>}
      </>
    )
}

export default ResponseTable;