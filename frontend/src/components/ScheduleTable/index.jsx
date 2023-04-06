import Schedule from "../Schedule";
import React, {useState} from "react";
import PopupModal from "../Modal/PopupModal";
import FormInput from "../FormInput/FormInput";

const ScheduleTable = ({schedules}) => {

  const [scheduleInfoModal, setScheduleInfoModal] = useState(false)

    return (
      <>
        <div className="sections-list">
          {schedules.length && (
              schedules.map((schedule) => (
                <Schedule showScheduleInfoModal={() => setScheduleInfoModal(schedule)} key={schedule.id} schedule={schedule}  />
              ))
          )}
          {!schedules.length && (
              <p>No schedules found!</p>
          )}
        </div>
        {scheduleInfoModal && <PopupModal
						modalTitle={"Информация о запланированном письме"}
						onCloseBtnPress={() => {
							setScheduleInfoModal(false);
						}}
					>
						<div className="mt-4 text-left">
							<form className="mt-5">
								<FormInput
									disabled
									type={"text"}
									name={"id"}
									label={"id"}
									value={scheduleInfoModal?.id}
								/>
								<FormInput
									disabled
									type={"text"}
									name={"subject_id"}
									label={"id испытуемого"}
									value={scheduleInfoModal?.subject_id}
								/>
								<FormInput
									disabled
									type={"text"}
									name={"send_at"}
									label={"Время отправки"}
									value={scheduleInfoModal?.send_at}
								/>
								<FormInput
									disabled
									type={"text"}
									name={"content"}
									label={"Текст письма"}
									value={scheduleInfoModal?.content}
								/>
							</form>
						</div>
					</PopupModal>}
      </>
    )
}

export default ScheduleTable;