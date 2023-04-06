import History from "../History";
import React, {useState} from "react";
import PopupModal from "../Modal/PopupModal";
import FormInput from "../FormInput/FormInput";

const HistoryTable = ({histories}) => {

  const [historyInfoModal, setHistoryInfoModal] = useState(false)

    return (
      <>
        <div className="sections-list">
          {histories.length && (
              histories.map((history) => (
                <History showHistoryInfoModal={() => setHistoryInfoModal(history)} key={history.id} history={history}  />
              ))
          )}
          {!histories.length && (
              <p>No histories found!</p>
          )}
        </div>
        {historyInfoModal && <PopupModal
						modalTitle={"Информация об отправленном письме"}
						onCloseBtnPress={() => {
							setHistoryInfoModal(false);
						}}
					>
						<div className="mt-4 text-left">
							<form className="mt-5">
								<FormInput
									disabled
									type={"text"}
									name={"id"}
									label={"id"}
									value={historyInfoModal?.id}
								/>
								<FormInput
									disabled
									type={"text"}
									name={"subject_id"}
									label={"id испытуемого"}
									value={historyInfoModal?.subject_id}
								/>
								<FormInput
									disabled
									type={"text"}
									name={"send_at"}
									label={"Время отправки"}
									value={historyInfoModal?.send_at}
								/>
								<FormInput
									disabled
									type={"text"}
									name={"content"}
									label={"Текст письма"}
									value={historyInfoModal?.content}
								/>
							</form>
						</div>
					</PopupModal>}
      </>
    )
}

export default HistoryTable;