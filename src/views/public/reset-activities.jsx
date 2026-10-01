import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, useSearchParams } from "@/lib/router";
import { DefaultAuthComponent } from "@/views/public/register";

const ResetActivities = () => {
	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	let [loading, setLoading] = useState(false);
	let [message, setMessage] = useState("");
	let [getSearch] = useSearchParams();

	let navigate = useNavigate();
	let email = getSearch?.get("email");

	let handleSubmit = async e => {
		e?.preventDefault();
		if (!email) return;
		setLoading(true);
		try {
			var res = await axios.put(
				`/api/v1/user/reset-activities?email=${email}`,
				{
					email,
				}
			);
			setMessage(res?.data);

			setTimeout(() => {
				navigate("/");
			}, 5000);
		} catch (err) {
			let error = err.response?.data?.error;
			if (error) {
				setMessage(error);
			}
			if (err?.response?.status === 429 || err?.response?.status === 405)
				toast.error(err?.response?.data ? err?.response?.data : err?.message);
		}
		setLoading(false);
	};

	useEffect(() => {
		if (email) handleSubmit();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [email]);

	return (
		<DefaultAuthComponent>
			<>
				<h3 className="textColor2 text-capitalize fw-600">Reset Activities</h3>
				{loading && <>Loading.....</>}
				{message && (
					<>
						<pre>{JSON.stringify(message, null, 2)}</pre>
					</>
				)}
			</>
		</DefaultAuthComponent>
	);
};

export default ResetActivities;
