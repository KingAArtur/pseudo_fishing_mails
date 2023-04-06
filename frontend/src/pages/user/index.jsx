import React, { useEffect, useState } from "react";
import jwtDecode from "jwt-decode";
import * as moment from "moment";

import FastAPIClient from "../../client";
import config from "../../config";
import DashboardHeader from "../../components/DashboardHeader";
import Footer from "../../components/Footer";
import UserTable from "../../components/UserTable";
import FormInput from "../../components/FormInput/FormInput";
import Button from "../../components/Button/Button";
import { NotLoggedIn } from "./NotLoggedIn";
import PopupModal from "../../components/Modal/PopupModal";


const client = new FastAPIClient(config);

const ProfileView = ({ users }) => {
	return (
		<>
			<UserTable
				users={users}

				showUpdate={true}
			/>

		</>
	);
};

const UsersDashboard = () => {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [error, setError] = useState({ label: "", url: "", source: "" });
	const [userCreateForm, setUserCreateForm] = useState({
		username: "",
		password: "",
		password_repeat: "",
	});
	const [userUpdateForm, setUserUpdateForm] = useState({
		user_id: "",
		password: "",
		password_repeat: "",
	});
	const [userDeleteForm, setUserDeleteForm] = useState({
		user_id: "",
	});
	const [userReadForm, setUserReadForm] = useState({
		user_id: "",
	});

	const [showCreateForm, setShowCreateForm] = useState(false);
	const [showUpdateForm, setShowUpdateForm] = useState(false);
	const [showDeleteForm, setShowDeleteForm] = useState(false);
	const [showReadForm, setShowReadForm] = useState(false);
	const [users, setUsers] = useState([]);


	const fetchUsers = () => {
		client.getUsers(userReadForm.user_id).then((data) => {
			setUsers(data);
		});
	};

	const onCreateUser = (e) => {
		e.preventDefault();

		if (userCreateForm.username.length <= 0) {
			return setError({ username: "Введите имя пользователя" });
		}
		if (userCreateForm.password.length <= 0) {
			return setError({ password: "Введите пароль" });
		}
		if (userCreateForm.password_repeat.length <= 0) {
			return setError({ password_repeat: "Введите пароль еще раз" });
		}

        client
            .createUser(
                userCreateForm.username,
                userCreateForm.password,
                userCreateForm.password_repeat,
            )
            // eslint-disable-next-line no-unused-vars
            .then((data) => {  // eslint:ignore
                fetchUsers();
                setShowCreateForm(false);
            });
	};

	const onUpdateUser = (e) => {
		e.preventDefault();

		if (userUpdateForm.user_id.length <= 0) {
			return setError({ username: "Введите id пользователя" });
		}
		if (userUpdateForm.password.length <= 0) {
			return setError({ password: "Введите пароль" });
		}
		if (userUpdateForm.password_repeat.length <= 0) {
			return setError({ password_repeat: "Введите пароль еще раз" });
		}

        client
            .updateUser(
                userUpdateForm.user_id,
                userUpdateForm.password,
                userUpdateForm.password_repeat,
            )
            // eslint-disable-next-line no-unused-vars
            .then((data) => {  // eslint:ignore
                fetchUsers();
                setShowUpdateForm(false);
            });
	};

	const onDeleteUser = (e) => {
		e.preventDefault();

		if (userDeleteForm.user_id.length <= 0) {
			return setError({ username: "Введите id пользователя" });
		}

        client
            .deleteUser(
                userDeleteForm.user_id,
            )
            // eslint-disable-next-line no-unused-vars
            .then((data) => {  // eslint:ignore
                fetchUsers();
                setShowDeleteForm(false);
            });
	};

	const onReadUser = (e) => {
		e.preventDefault();

        fetchUsers();
        setShowReadForm(false);
	};

	useEffect(() => {
		const tokenString = localStorage.getItem("token");
		if (tokenString) {
			const token = JSON.parse(tokenString);
			const decodedAccessToken = jwtDecode(token.access_token);
			if (moment.unix(decodedAccessToken.exp).toDate() > new Date()) {
				setIsLoggedIn(true);
			}
		}
	}, []);

	return ( !isLoggedIn ? <NotLoggedIn /> :
		<>
			<section
				className="flex flex-col bg-black text-center"
				style={{ minHeight: "100vh" }}
			>
				<DashboardHeader />
				<div className="container px-5 pt-6 text-center mx-auto lg:px-20">
						{/*TODO - move to component*/}
					<h1 className="mb-12 text-3xl font-medium text-white">
						Пользователи
					</h1>

					<button
						className="my-5 text-white bg-teal-500 p-3 rounded"
						onClick={() => {
							setShowCreateForm(!showCreateForm);
						}}
					>
						Создать
					</button>

					<button
						className="my-5 text-white bg-teal-500 p-3 rounded"
						onClick={() => {
							setShowUpdateForm(!showUpdateForm);
						}}
					>
						Изменить
					</button>

					<button
						className="my-5 text-white bg-teal-500 p-3 rounded"
						onClick={() => {
							setShowDeleteForm(!showDeleteForm);
						}}
					>
						Удалить
					</button>

					<button
						className="my-5 text-white bg-teal-500 p-3 rounded"
						onClick={() => {
							setShowReadForm(!showReadForm);
						}}
					>
						Просмотреть
					</button>

					<p className="text-base leading-relaxed text-white"></p>
					<div className="mainViewport text-white">
						{users.length && (
							<ProfileView
								users={users}
								fetchUsers={fetchUsers}
							/>
						)}
					</div>
				</div>

				<Footer />
			</section>
			{showCreateForm && (
				<PopupModal
					modalTitle={"Создание пользователя"}
					onCloseBtnPress={() => {
						setShowCreateForm(false);
						setError({ username: "", password: "", password_repeat: "" });
					}}
				>
					<div className="mt-4 text-left">
						<form className="mt-5" onSubmit={(e) => onCreateUser(e)}>
							<FormInput
								type={"text"}
								name={"username"}
								label={"Имя пользователя"}
								error={error.username}
								value={userCreateForm.username}
								onChange={(e) =>
									setUserCreateForm({ ...userCreateForm, username: e.target.value })
								}
							/>
							<FormInput
								type={"text"}
								name={"password"}
								label={"Пароль - не менее 8 символов"}
								error={error.password}
								value={userCreateForm.password}
								onChange={(e) =>
									setUserCreateForm({ ...userCreateForm, password: e.target.value })
								}
							/>
							<FormInput
								type={"text"}
								name={"password_repeat"}
								label={"Повторить пароль"}
								error={error.password_repeat}
								value={userCreateForm.password_repeat}
								onChange={(e) =>
									setUserCreateForm({ ...userCreateForm, password_repeat: e.target.value })
								}
							/>
							<Button
								error={error.source}
								title={"Создать!"}
							/>
						</form>
					</div>
				</PopupModal>
			)}

			{showUpdateForm && (
				<PopupModal
					modalTitle={"Редактирование пользователя"}
					onCloseBtnPress={() => {
						setShowUpdateForm(false);
						setError({ user_id: "", password: "", password_repeat: "" });
					}}
				>
					<div className="mt-4 text-left">
						<form className="mt-5" onSubmit={(e) => onUpdateUser(e)}>
							<FormInput
								type={"text"}
								name={"user id"}
								label={"Номер пользователя"}
								error={error.user_id}
								value={userUpdateForm.user_id}
								onChange={(e) =>
									setUserUpdateForm({ ...userUpdateForm, user_id: e.target.value })
								}
							/>
							<FormInput
								type={"text"}
								name={"password"}
								label={"Пароль - не менее 8 символов"}
								error={error.password}
								value={userUpdateForm.password}
								onChange={(e) =>
									setUserUpdateForm({ ...userUpdateForm, password: e.target.value })
								}
							/>
							<FormInput
								type={"text"}
								name={"password_repeat"}
								label={"Повторить пароль"}
								error={error.password_repeat}
								value={userUpdateForm.password_repeat}
								onChange={(e) =>
									setUserUpdateForm({ ...userUpdateForm, password_repeat: e.target.value })
								}
							/>
							<Button
								error={error.source}
								title={"Редактировать!"}
							/>
						</form>
					</div>
				</PopupModal>
			)}

			{showDeleteForm && (
				<PopupModal
					modalTitle={"Удаление пользователя"}
					onCloseBtnPress={() => {
						setShowDeleteForm(false);
						setError({ user_id: "" });
					}}
				>
					<div className="mt-4 text-left">
						<form className="mt-5" onSubmit={(e) => onDeleteUser(e)}>
							<FormInput
								type={"text"}
								name={"user id"}
								label={"Номер пользователя"}
								error={error.user_id}
								value={userDeleteForm.user_id}
								onChange={(e) =>
									setUserDeleteForm({ ...userDeleteForm, user_id: e.target.value })
								}
							/>
							<Button
								error={error.source}
								title={"Удалить!"}
							/>
						</form>
					</div>
				</PopupModal>
			)}

			{showReadForm && (
				<PopupModal
					modalTitle={"Просмотр пользователей"}
					onCloseBtnPress={() => {
						setShowReadForm(false);
						setError({ user_id: "" });
					}}
				>
					<div className="mt-4 text-left">
						<form className="mt-5" onSubmit={(e) => onReadUser(e)}>
							<FormInput
								type={"text"}
								name={"user_id"}
								label={"Номер пользователя (необязательно)"}
								error={error.user_id}
								value={userReadForm.user_id}
								onChange={(e) =>
									setUserReadForm({ ...userReadForm, user_id: e.target.value })
								}
							/>
							<Button
								error={error.source}
								title={"Просмотр!"}
							/>
						</form>
					</div>
				</PopupModal>
			)}
		</>
	);
};

export default UsersDashboard;
