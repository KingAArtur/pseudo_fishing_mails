import React, { useEffect, useState } from "react";
import jwtDecode from "jwt-decode";
import * as moment from "moment";

import FastAPIClient from "../../client";
import config from "../../config";
import DashboardHeader from "../../components/DashboardHeader";
import Footer from "../../components/Footer";
import SubjectTable from "../../components/SubjectTable";
import FormInput from "../../components/FormInput/FormInput";
import Button from "../../components/Button/Button";
import { NotLoggedIn } from "./NotLoggedIn";
import PopupModal from "../../components/Modal/PopupModal";


const client = new FastAPIClient(config);

const ProfileView = ({ subjects }) => {
	return (
		<>
			<SubjectTable
				subjects={subjects}

				showUpdate={true}
			/>

		</>
	);
};

const SubjectsDashboard = () => {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [error, setError] = useState({ label: "", url: "", source: "" });
	const [subjectCreateForm, setSubjectCreateForm] = useState({
		email: "",
		first_name: "",
		last_name: "",
		patronymic: "",
	});
	const [subjectUpdateForm, setSubjectUpdateForm] = useState({
		subject_id: "",
		first_name: "",
		last_name: "",
		patronymic: "",
	});
	const [subjectDeleteForm, setSubjectDeleteForm] = useState({
		subject_id: "",
	});
	const [subjectReadForm, setSubjectReadForm] = useState({
		subject_id: "",
		email: "",
	});

	const [showCreateForm, setShowCreateForm] = useState(false);
	const [showUpdateForm, setShowUpdateForm] = useState(false);
	const [showDeleteForm, setShowDeleteForm] = useState(false);
	const [showReadForm, setShowReadForm] = useState(false);
	const [subjects, setSubjects] = useState([]);


	const fetchSubjects = () => {
		client.getSubjects(subjectReadForm.subject_id, subjectReadForm.email).then((data) => {
			setSubjects(data);
		});
	};

	const onCreateSubject = (e) => {
		e.preventDefault();

		if (subjectCreateForm.email.length <= 0) {
			return setError({ email: "Введите email" });
		}

        client
            .createSubject(
                subjectCreateForm.email,
                subjectCreateForm.first_name,
                subjectCreateForm.last_name,
                subjectCreateForm.patronymic,
            )
            // eslint-disable-next-line no-unused-vars
            .then((data) => {  // eslint:ignore
                fetchSubjects();
                setShowCreateForm(false);
            });
	};

	const onUpdateSubject = (e) => {
		e.preventDefault();

        client
            .updateSubject(
                subjectUpdateForm.subject_id,
                subjectUpdateForm.last_name,
                subjectUpdateForm.first_name,
                subjectUpdateForm.patronymic,
            )
            // eslint-disable-next-line no-unused-vars
            .then((data) => {  // eslint:ignore
                fetchSubjects();
                setShowUpdateForm(false);
            });
	};

	const onDeleteSubject = (e) => {
		e.preventDefault();

		if (subjectDeleteForm.subject_id.length <= 0) {
			return setError({ subject_id: "Введите id пользователя" });
		}

        client
            .deleteSubject(
                subjectDeleteForm.subject_id,
            )
            // eslint-disable-next-line no-unused-vars
            .then((data) => {  // eslint:ignore
                fetchSubjects();
                setShowDeleteForm(false);
            });
	};

	const onReadSubject = (e) => {
		e.preventDefault();

        fetchSubjects();
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
						{subjects.length && (
							<ProfileView
								subjects={subjects}
								fetchSubjects={fetchSubjects}
							/>
						)}
					</div>
				</div>

				<Footer />
			</section>
			{showCreateForm && (
				<PopupModal
					modalTitle={"Создание испытуемого"}
					onCloseBtnPress={() => {
						setShowCreateForm(false);
						setError({ email: "", first_name: "", last_name: "", patronymic: "" });
					}}
				>
					<div className="mt-4 text-left">
						<form className="mt-5" onSubmit={(e) => onCreateSubject(e)}>
							<FormInput
								type={"text"}
								name={"email"}
								label={"email"}
								error={error.email}
								value={subjectCreateForm.email}
								onChange={(e) =>
									setSubjectCreateForm({ ...subjectCreateForm, email: e.target.value })
								}
							/>
							<FormInput
								type={"text"}
								name={"first_name"}
								label={"Имя"}
								error={error.first_name}
								value={subjectCreateForm.first_name}
								onChange={(e) =>
									setSubjectCreateForm({ ...subjectCreateForm, first_name: e.target.value })
								}
							/>
							<FormInput
								type={"text"}
								name={"last_name"}
								label={"Фамилия"}
								error={error.last_name}
								value={subjectCreateForm.last_name}
								onChange={(e) =>
									setSubjectCreateForm({ ...subjectCreateForm, last_name: e.target.value })
								}
							/>
							<FormInput
								type={"text"}
								name={"patronymic"}
								label={"Отчество"}
								error={error.patronymic}
								value={subjectCreateForm.patronymic}
								onChange={(e) =>
									setSubjectCreateForm({ ...subjectCreateForm, patronymic: e.target.value })
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
					modalTitle={"Редактирование испытуемого"}
					onCloseBtnPress={() => {
						setShowUpdateForm(false);
						setError({ subject_id: "", first_name: "", last_name: "", patronymic: "" });
					}}
				>
					<div className="mt-4 text-left">
						<form className="mt-5" onSubmit={(e) => onUpdateSubject(e)}>
							<FormInput
								type={"text"}
								name={"subject_id"}
								label={"Номер испытуемого"}
								error={error.subject_id}
								value={subjectUpdateForm.subject_id}
								onChange={(e) =>
									setSubjectUpdateForm({ ...subjectUpdateForm, subject_id: e.target.value })
								}
							/>
							<FormInput
								type={"text"}
								name={"first_name"}
								label={"Имя"}
								error={error.first_name}
								value={subjectUpdateForm.first_name}
								onChange={(e) =>
									setSubjectUpdateForm({ ...subjectUpdateForm, first_name: e.target.value })
								}
							/>
							<FormInput
								type={"text"}
								name={"last_name"}
								label={"Фамилия"}
								error={error.last_name}
								value={subjectUpdateForm.last_name}
								onChange={(e) =>
									setSubjectUpdateForm({ ...subjectUpdateForm, last_name: e.target.value })
								}
							/>
							<FormInput
								type={"text"}
								name={"patronymic"}
								label={"Отчество"}
								error={error.patronymic}
								value={subjectUpdateForm.patronymic}
								onChange={(e) =>
									setSubjectUpdateForm({ ...subjectUpdateForm, patronymic: e.target.value })
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
					modalTitle={"Удаление испытуемого"}
					onCloseBtnPress={() => {
						setShowDeleteForm(false);
						setError({ subject_id: "" });
					}}
				>
					<div className="mt-4 text-left">
						<form className="mt-5" onSubmit={(e) => onDeleteSubject(e)}>
							<FormInput
								type={"text"}
								name={"subject_id"}
								label={"Номер испытуемого"}
								error={error.subject_id}
								value={subjectDeleteForm.subject_id}
								onChange={(e) =>
									setSubjectDeleteForm({ ...subjectDeleteForm, subject_id: e.target.value })
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
					modalTitle={"Просмотр испытуемых"}
					onCloseBtnPress={() => {
						setShowReadForm(false);
						setError({ subject_id: "", email: "" });
					}}
				>
					<div className="mt-4 text-left">
						<form className="mt-5" onSubmit={(e) => onReadSubject(e)}>
							<FormInput
								type={"text"}
								name={"subject_id"}
								label={"Номер испытуемого (необязательно)"}
								error={error.subject_id}
								value={subjectReadForm.subject_id}
								onChange={(e) =>
									setSubjectReadForm({ ...subjectReadForm, subject_id: e.target.value })
								}
							/>
							<FormInput
								type={"text"}
								name={"email"}
								label={"email испытуемого (необязательно)"}
								error={error.email}
								value={subjectReadForm.email}
								onChange={(e) =>
									setSubjectReadForm({ ...subjectReadForm, email: e.target.value })
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

export default SubjectsDashboard;
