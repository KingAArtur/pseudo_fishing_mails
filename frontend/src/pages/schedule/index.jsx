import React, { useEffect, useState } from "react";
import jwtDecode from "jwt-decode";
import * as moment from "moment";

import FastAPIClient from "../../client";
import config from "../../config";
import DashboardHeader from "../../components/DashboardHeader";
import Footer from "../../components/Footer";
import ScheduleTable from "../../components/ScheduleTable";
import FormInput from "../../components/FormInput/FormInput";
import Button from "../../components/Button/Button";
import { NotLoggedIn } from "./NotLoggedIn";
import PopupModal from "../../components/Modal/PopupModal";


const client = new FastAPIClient(config);

const ProfileView = ({ schedules }) => {
	return (
		<>
			<ScheduleTable
				schedules={schedules}

				showUpdate={true}
			/>

		</>
	);
};

const SchedulesDashboard = () => {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [error, setError] = useState({ label: "", url: "", source: "" });
	const [scheduleCreateForm, setScheduleCreateForm] = useState({
		subjects_id: "",
		send_at: "2023-04-07T17:23:38.867Z",
		content: "Hello, {last_name} {first_name} {patronymic}! Go to link: {link}",
	});
	const [scheduleUpdateForm, setScheduleUpdateForm] = useState({
		letter_id: "",
		send_at: "2023-04-07T17:23:38.867Z",
		content: "Hello, {last_name} {first_name} {patronymic}! Go to link: {link}",
	});
	const [scheduleDeleteForm, setScheduleDeleteForm] = useState({
		letter_id: "",
	});
	const [scheduleReadForm, setScheduleReadForm] = useState({
		letter_id: "",
		subject_id: "",
	});

	const [showCreateForm, setShowCreateForm] = useState(false);
	const [showUpdateForm, setShowUpdateForm] = useState(false);
	const [showDeleteForm, setShowDeleteForm] = useState(false);
	const [showReadForm, setShowReadForm] = useState(false);
	const [schedules, setSchedules] = useState([]);


	const fetchSchedules = () => {
		client.getSchedules(scheduleReadForm.letter_id, scheduleReadForm.subject_id).then((data) => {
			setSchedules(data);
		});
	};

	const onCreateSchedule = (e) => {
		e.preventDefault();

		if (scheduleCreateForm.subjects_id.length <= 0) {
			return setError({ subjects_id: "Введите id испытуемых" });
		}
		if (scheduleCreateForm.content.length <= 0) {
			return setError({ content: "Введите текст письма" });
		}
		if (scheduleCreateForm.send_at.length <= 0) {
			return setError({ send_at: "Введите время отправки" });
		}

        client
            .createSchedule(
                scheduleCreateForm.subjects_id.split(','),
                scheduleCreateForm.content,
                scheduleCreateForm.send_at,
            )
            // eslint-disable-next-line no-unused-vars
            .then((data) => {  // eslint:ignore
                fetchSchedules();
                setShowCreateForm(false);
            });
	};

	const onUpdateSchedule = (e) => {
		e.preventDefault();

		if (scheduleUpdateForm.letter_id.length <= 0) {
			return setError({ letter_id: "Введите id письма" });
		}

        client
            .updateSchedule(
                scheduleUpdateForm.letter_id,
                scheduleUpdateForm.content,
                scheduleUpdateForm.send_at,
            )
            // eslint-disable-next-line no-unused-vars
            .then((data) => {  // eslint:ignore
                fetchSchedules();
                setShowUpdateForm(false);
            });
	};

	const onDeleteSchedule = (e) => {
		e.preventDefault();

		if (scheduleDeleteForm.letter_id.length <= 0) {
			return setError({ letter_id: "Введите id письма" });
		}

        client
            .deleteSchedule(
                scheduleDeleteForm.letter_id,
            )
            // eslint-disable-next-line no-unused-vars
            .then((data) => {  // eslint:ignore
                fetchSchedules();
                setShowDeleteForm(false);
            });
	};

	const onReadSchedule = (e) => {
		e.preventDefault();

        fetchSchedules();
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
						Письма к отправке
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
						{schedules.length && (
							<ProfileView
								schedules={schedules}
								fetchSchedules={fetchSchedules}
							/>
						)}
					</div>
				</div>

				<Footer />
			</section>
			{showCreateForm && (
				<PopupModal
					modalTitle={"Создание письма"}
					onCloseBtnPress={() => {
						setShowCreateForm(false);
						setError({ subjects_id: "", send_at: "", content: "" });
					}}
				>
					<div className="mt-4 text-left">
						<form className="mt-5" onSubmit={(e) => onCreateSchedule(e)}>
							<FormInput
								type={"text"}
								name={"subjects_id"}
								label={"Список id испытуемых (через запятую: '1, 2')"}
								error={error.subjects_id}
								value={scheduleCreateForm.subjects_id}
								onChange={(e) =>
									setScheduleCreateForm({ ...scheduleCreateForm, subjects_id: e.target.value })
								}
							/>
							<FormInput
								type={"text"}
								name={"send_at"}
								label={"Дата отправки"}
								error={error.send_at}
								value={scheduleCreateForm.send_at}
								onChange={(e) =>
									setScheduleCreateForm({ ...scheduleCreateForm, send_at: e.target.value })
								}
							/>
							<FormInput
								type={"text"}
								name={"content"}
								label={"Текст письма"}
								error={error.content}
								value={scheduleCreateForm.content}
								onChange={(e) =>
									setScheduleCreateForm({ ...scheduleCreateForm, content: e.target.value })
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
					modalTitle={"Редактирование письма"}
					onCloseBtnPress={() => {
						setShowUpdateForm(false);
						setError({ letter_id: "", content: "", send_at: "" });
					}}
				>
					<div className="mt-4 text-left">
						<form className="mt-5" onSubmit={(e) => onUpdateSchedule(e)}>
							<FormInput
								type={"text"}
								name={"letter_id"}
								label={"Номер письма"}
								error={error.letter_id}
								value={scheduleUpdateForm.letter_id}
								onChange={(e) =>
									setScheduleUpdateForm({ ...scheduleUpdateForm, letter_id: e.target.value })
								}
							/>
							<FormInput
								type={"text"}
								name={"send_at"}
								label={"Время отправки"}
								error={error.send_at}
								value={scheduleUpdateForm.send_at}
								onChange={(e) =>
									setScheduleUpdateForm({ ...scheduleUpdateForm, send_at: e.target.value })
								}
							/>
							<FormInput
								type={"text"}
								name={"content"}
								label={"Текст письма"}
								error={error.content}
								value={scheduleUpdateForm.content}
								onChange={(e) =>
									setScheduleUpdateForm({ ...scheduleUpdateForm, content: e.target.value })
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
					modalTitle={"Удаление письма"}
					onCloseBtnPress={() => {
						setShowDeleteForm(false);
						setError({ letter_id: "" });
					}}
				>
					<div className="mt-4 text-left">
						<form className="mt-5" onSubmit={(e) => onDeleteSchedule(e)}>
							<FormInput
								type={"text"}
								name={"letter_id"}
								label={"Номер письма"}
								error={error.letter_id}
								value={scheduleDeleteForm.letter_id}
								onChange={(e) =>
									setScheduleDeleteForm({ ...scheduleDeleteForm, letter_id: e.target.value })
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
					modalTitle={"Просмотр писем"}
					onCloseBtnPress={() => {
						setShowReadForm(false);
						setError({ letter_id: "", subject_id: "" });
					}}
				>
					<div className="mt-4 text-left">
						<form className="mt-5" onSubmit={(e) => onReadSchedule(e)}>
							<FormInput
								type={"text"}
								name={"letter_id"}
								label={"Номер письма (необязательно)"}
								error={error.letter_id}
								value={scheduleReadForm.letter_id}
								onChange={(e) =>
									setScheduleReadForm({ ...scheduleReadForm, letter_id: e.target.value })
								}
							/>
							<FormInput
								type={"text"}
								name={"subject_id"}
								label={"Номер испытуемого (необязательно)"}
								error={error.subject_id}
								value={scheduleReadForm.subject_id}
								onChange={(e) =>
									setScheduleReadForm({ ...scheduleReadForm, subject_id: e.target.value })
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

export default SchedulesDashboard;
