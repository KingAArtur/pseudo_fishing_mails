import React, { useEffect, useState } from "react";
import jwtDecode from "jwt-decode";
import * as moment from "moment";

import FastAPIClient from "../../client";
import config from "../../config";
import DashboardHeader from "../../components/DashboardHeader";
import Footer from "../../components/Footer";
import ResponseTable from "../../components/ResponseTable";
import FormInput from "../../components/FormInput/FormInput";
import Button from "../../components/Button/Button";
import { NotLoggedIn } from "./NotLoggedIn";
import PopupModal from "../../components/Modal/PopupModal";


const client = new FastAPIClient(config);

const ProfileView = ({ responses }) => {
	return (
		<>
			<ResponseTable
				responses={responses}

				showUpdate={true}
			/>

		</>
	);
};

const ResponsesDashboard = () => {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [error, setError] = useState({ label: "", url: "", source: "" });
	const [responseDeleteForm, setResponseDeleteForm] = useState({
		response_id: "",
	});
	const [responseReadForm, setResponseReadForm] = useState({
		subject_id: "",
	});

	const [showDeleteForm, setShowDeleteForm] = useState(false);
	const [showReadForm, setShowReadForm] = useState(false);
	const [responses, setResponses] = useState([]);


	const fetchResponses = () => {
		client.getResponses(responseReadForm.subject_id).then((data) => {
			setResponses(data);
		});
	};

	const onDeleteResponse = (e) => {
		e.preventDefault();

		if (responseDeleteForm.response_id.length <= 0) {
			return setError({ response_id: "Введите id отклика" });
		}

        client
            .deleteResponse(
                responseDeleteForm.response_id,
            )
            // eslint-disable-next-line no-unused-vars
            .then((data) => {  // eslint:ignore
                fetchResponses();
                setShowDeleteForm(false);
            });
	};

	const onReadResponse = (e) => {
		e.preventDefault();

        fetchResponses();
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
						Отклики испытуемых на письма
					</h1>

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
						{responses.length && (
							<ProfileView
								responses={responses}
								fetchResponses={fetchResponses}
							/>
						)}
					</div>
				</div>

				<Footer />
			</section>

			{showDeleteForm && (
				<PopupModal
					modalTitle={"Удаление отклика"}
					onCloseBtnPress={() => {
						setShowDeleteForm(false);
						setError({ response_id: "" });
					}}
				>
					<div className="mt-4 text-left">
						<form className="mt-5" onSubmit={(e) => onDeleteResponse(e)}>
							<FormInput
								type={"text"}
								name={"response_id"}
								label={"Номер отклика"}
								error={error.response_id}
								value={responseDeleteForm.response_id}
								onChange={(e) =>
									setResponseDeleteForm({ ...responseDeleteForm, response_id: e.target.value })
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
					modalTitle={"Просмотр откликов"}
					onCloseBtnPress={() => {
						setShowReadForm(false);
						setError({ subject_id: "" });
					}}
				>
					<div className="mt-4 text-left">
						<form className="mt-5" onSubmit={(e) => onReadResponse(e)}>
							<FormInput
								type={"text"}
								name={"subject_id"}
								label={"Номер испытуемого (необязательно)"}
								error={error.subject_id}
								value={responseReadForm.subject_id}
								onChange={(e) =>
									setResponseReadForm({ ...responseReadForm, subject_id: e.target.value })
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

export default ResponsesDashboard;
