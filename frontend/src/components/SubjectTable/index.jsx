import Subject from "../Subject";
import React, {useState} from "react";
import PopupModal from "../Modal/PopupModal";
import FormInput from "../FormInput/FormInput";

const SubjectTable = ({subjects}) => {

  const [subjectInfoModal, setSubjectInfoModal] = useState(false)

    return (
      <>
        <div className="sections-list">
          {subjects.length && (
              subjects.map((subject) => (
                <Subject showSubjectInfoModal={() => setSubjectInfoModal(subject)} key={subject.id} subject={subject}  />
              ))
          )}
          {!subjects.length && (
              <p>No subjects found!</p>
          )}
        </div>
        {subjectInfoModal && <PopupModal
						modalTitle={"Информация об испытуемом"}
						onCloseBtnPress={() => {
							setSubjectInfoModal(false);
						}}
					>
						<div className="mt-4 text-left">
							<form className="mt-5">
								<FormInput
									disabled
									type={"text"}
									name={"id"}
									label={"id"}
									value={subjectInfoModal?.id}
								/>
								<FormInput
									disabled
									type={"text"}
									name={"email"}
									label={"email"}
									value={subjectInfoModal?.email}
								/>
								<FormInput
									disabled
									type={"text"}
									name={"first name"}
									label={"Имя"}
									value={subjectInfoModal?.first_name}
								/>
								<FormInput
									disabled
									type={"text"}
									name={"last name"}
									label={"Фамилия"}
									value={subjectInfoModal?.last_name}
								/>
								<FormInput
									disabled
									type={"text"}
									name={"patronymic"}
									label={"Отчество"}
									value={subjectInfoModal?.patronymic}
								/>
							</form>
						</div>
					</PopupModal>}
      </>
    )
}

export default SubjectTable;