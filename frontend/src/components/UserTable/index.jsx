import User from "../User";
import React, {useState} from "react";
import PopupModal from "../Modal/PopupModal";
import FormInput from "../FormInput/FormInput";

const UserTable = ({users}) => {

  const [userInfoModal, setUserInfoModal] = useState(false)

    return (
      <>
        <div className="sections-list">
          {users.length && (
              users.map((user) => (
                <User showUserInfoModal={() => setUserInfoModal(user)} key={user.id} user={user}  />
              ))
          )}
          {!users.length && (
              <p>No users found!</p>
          )}
        </div>
        {userInfoModal && <PopupModal
						modalTitle={"Информация о пользователе"}
						onCloseBtnPress={() => {
							setUserInfoModal(false);
						}}
					>
						<div className="mt-4 text-left">
							<form className="mt-5">
								<FormInput
									disabled
									type={"text"}
									name={"id"}
									label={"id"}
									value={userInfoModal?.id}
								/>
								<FormInput
									disabled
									type={"text"}
									name={"username"}
									label={"Имя пользователя"}
									value={userInfoModal?.username}
								/>
							</form>
						</div>
					</PopupModal>}
      </>
    )
}

export default UserTable;