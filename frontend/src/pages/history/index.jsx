import React, { useEffect, useState } from "react";
import jwtDecode from "jwt-decode";
import * as moment from "moment";

import FastAPIClient from "../../client";
import config from "../../config";
import DashboardHeader from "../../components/DashboardHeader";
import Footer from "../../components/Footer";
import HistoryTable from "../../components/HistoryTable";
import FormInput from "../../components/FormInput/FormInput";
import Button from "../../components/Button/Button";
import { NotLoggedIn } from "./NotLoggedIn";
import PopupModal from "../../components/Modal/PopupModal";


const client = new FastAPIClient(config);

const ProfileView = ({ histories }) => {
	return (
		<>
			<HistoryTable
				histories={histories}

				showUpdate={true}
			/>

		</>
	);
};

const HistoriesDashboard = () => {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [error, setError] = useState({ label: "", url: "", source: "" });
	const [historyReadForm, setHistoryReadForm] = useState({
		letter_id: "",
		subject_id: "",
	});

	const [showReadForm, setShowReadForm] = useState(false);
	const [histories, setHistories] = useState([]);


	const fetchHistories = () => {
		client.getHistories(historyReadForm.letter_id, historyReadForm.subject_id).then((data) => {
			setHistories(data);
		});
	};

	const onReadHistory = (e) => {
		e.preventDefault();

        fetchHistories();
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
						Отправленные письма
					</h1>

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
						{histories.length && (
							<ProfileView
								histories={histories}
								fetchHistories={fetchHistories}
							/>
						)}
					</div>
				</div>

				<Footer />
			</section>
			{showReadForm && (
				<PopupModal
					modalTitle={"Просмотр писем"}
					onCloseBtnPress={() => {
						setShowReadForm(false);
						setError({ letter_id: "", subject_id: "" });
					}}
				>
					<div className="mt-4 text-left">
						<form className="mt-5" onSubmit={(e) => onReadHistory(e)}>
							<FormInput
								type={"text"}
								name={"letter_id"}
								label={"Номер письма (необязательно)"}
								error={error.letter_id}
								value={historyReadForm.letter_id}
								onChange={(e) =>
									setHistoryReadForm({ ...historyReadForm, letter_id: e.target.value })
								}
							/>
							<FormInput
								type={"text"}
								name={"subject_id"}
								label={"Номер испытуемого (необязательно)"}
								error={error.subject_id}
								value={historyReadForm.subject_id}
								onChange={(e) =>
									setHistoryReadForm({ ...historyReadForm, subject_id: e.target.value })
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

export default HistoriesDashboard;
