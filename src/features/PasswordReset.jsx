import React, { useEffect, useState } from "react";
import { ModalComponents } from "@/components/ui/Modal";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "@/lib/router";
import { ClipLoader } from "react-spinners";
import { VerifyMail } from "@/views/public/forget-password";

const AccountVerification = ({ isOpen, toggle, email }) => {
	let [stateData, setStateData] = useState({
		email: "",
		token: "",
	});
	let [loading, setLoading] = useState(false);
	let [message, setMessage] = useState("");
	let [message2, setMessage2] = useState("");
	let [isOpen2, setisOpen2] = useState(false),
		[code, setCode] = useState("");

	let navigate = useNavigate();

	let toggle2 = () => {
		setisOpen2(!isOpen2);
	};

	useEffect(() => {
		if (email) setStateData({ ...stateData, email });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [email]);

	let handleSubmit = async e => {
		e.preventDefault();
		if (!stateData.email) return;
		setLoading(true);
		try {
			var res = await axios.get(
				`/auth/request-email-verification?email=${stateData.email}`
			);
			setMessage(res.data.message);
			toast.success(res.data.message, { autoClose: false });
		} catch (error) {
			toast.warn(error);
		}
		setLoading(false);
	};

	let handleSubmitNew = async e => {
		e.preventDefault();
		if (!code) return;
		setLoading(true);
		try {
			let body = {
				token: code,
			};
			let res = await axios.post(`/auth/verify-email-account`, body);
			console.log({ data: res.data });
			setMessage2(res.data.message);
			toast.success(res.data.message);
		} catch (error) {
			if (error.response.data) toast.warn(error.response.data.message);
			console.log({ error });
		}
		setLoading(false);
	};

	useEffect(() => {
		if (message) {
			toggle();
			toggle2();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [message]);

	useEffect(() => {
		if (message2) {
			toggle2();
			navigate("/login");
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [message2]);

	return (
		<main>
			<ModalComponents
				isOpen={isOpen}
				toggle={toggle}
				title={"request account verification"}>
				<form>
					<div className="my-3">
						<label htmlFor="email">Email</label>
						<input
							type="email"
							className="form-control py-3"
							placeholder="example@email.com"
							required
							value={stateData.email}
							onChange={e =>
								setStateData({ ...stateData, email: e.target.value })
							}
						/>
					</div>
					<button
						type="submit"
						disabled={loading}
						onClick={handleSubmit}
						className="btn btn-primary1 w-100 text-capitalize my-3 py-3">
						send
						{loading && <ClipLoader color={"#fff"} size={16} />}
					</button>
				</form>
				<div className="d-flex">
					<button
						className="btn btn-light bg-transparent text-capitalize ms-auto"
						onClick={() => {
							toggle();
							toggle2();
						}}>
						token?
					</button>
				</div>
			</ModalComponents>
			<ModalComponents
				isOpen={isOpen2}
				toggle={toggle2}
				title={"verify account"}>
				<form>
					<div className="my-3">
						<label htmlFor="email">Email</label>
						<input
							type="email"
							className="form-control py-3"
							placeholder="example@email.com"
							required
							readOnly
							value={stateData.email}
							onChange={e =>
								setStateData({ ...stateData, email: e.target.value })
							}
						/>
					</div>
					<VerifyMail
						code={code}
						setCode={setCode}
						handleSubmit={handleSubmit}
						numInputs={7}
					/>
					<button
						type="submit"
						disabled={loading}
						onClick={handleSubmitNew}
						className="btn btn-primary1 w-100 text-capitalize my-3 py-3">
						submit
						{loading && <ClipLoader color={"#fff"} size={16} />}
					</button>
				</form>
				<div className="d-flex m-0 overflow-hidden">
					<button
						className="btn btn-light bg-transparent text-capitalize ms-auto"
						onClick={() => {
							toggle2();
							toggle();
						}}>
						Didn't receive any mail?
						<span className="textColor2 fw-600"> Edit email</span>
					</button>
				</div>
			</ModalComponents>
		</main>
	);
};

export default AccountVerification;

export const ChangePassword = ({ isOpen, toggle }) => {
	let [stateData, setStateData] = useState({
		newPassword: "",
		oldPassword: "",
	});
	let [loading, setLoading] = useState(false);
	let [message2, setMessage2] = useState("");

	let handleSubmitNew = async e => {
		e.preventDefault();
		if (!stateData.newPassword) return;
		if (stateData.oldPassword) return;

		setLoading(true);
		try {
			let body = {
				token: stateData.token,
				oldPassword: stateData.oldPassword,
			};
			let res = await axios.post(`/auth/change-password`, body);
			toast.success(res.data.message);
			setMessage2(res.data.message);
		} catch (error) {
			toast.warn(error);
		}
		setLoading(false);
	};

	useEffect(() => {
		if (message2) {
			toggle();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [message2]);

	return (
		<main>
			<ModalComponents
				isOpen={isOpen}
				toggle={toggle}
				title={"change password"}>
				<form>
					<div className="my-3">
						<label htmlFor="password">Old Password</label>
						<input
							type="password"
							className="form-control"
							placeholder="Old Password"
							required
							value={stateData.oldPassword}
							onChange={e =>
								setStateData({
									...stateData,
									oldPassword: e.target.value,
								})
							}
						/>
					</div>
					<div className="my-3">
						<label htmlFor="password">New Password</label>
						<input
							type="password"
							className="form-control"
							placeholder="New Password"
							required
							value={stateData.newPassword}
							onChange={e =>
								setStateData({
									...stateData,
									newPassword: e.target.value,
								})
							}
						/>
					</div>
					<button
						type="submit"
						disabled={loading}
						onClick={handleSubmitNew}
						className="btn btn-primary1 w-100 text-capitalize my-3">
						send
						{loading && <ClipLoader color={"#fff"} size={16} />}
					</button>
				</form>
			</ModalComponents>
		</main>
	);
};

export const PhoneVerify = ({ isOpen, toggle }) => {
	let [stateData, setStateData] = useState({
		telephone: "",
		token: "",
	});
	let [loading, setLoading] = useState(false);
	let [message, setMessage] = useState("");
	let [message2, setMessage2] = useState("");
	let [isOpen2, setisOpen2] = useState(false);
	let navigate = useNavigate();

	let toggle2 = () => {
		setisOpen2(!isOpen2);
	};

	let handleSubmit = async e => {
		e.preventDefault();
		if (!stateData.telephone) return;
		setLoading(true);
		try {
			var res = await axios.get(
				`/auth/request-phone-verification?phone=${stateData.telephone}`
			);
			setMessage(res.data.message);
			toast.success(res.data.message, { autoClose: false });
		} catch (error) {
			toast.warn(error);
		}
		setLoading(false);
	};

	let handleSubmitNew = async e => {
		e.preventDefault();
		if (!stateData.token) return;
		setLoading(true);
		try {
			let body = {
				token: stateData.token,
			};

			let res = await axios.post(`/auth/verify-phone-account`, body);
			console.log({ data: res.data });
			setMessage2(res.data.message);
			toast.success(res.data.message);
		} catch (error) {
			if (error.response.data) toast.warn(error.response.data.message);
			console.log({ error });
		}
		setLoading(false);
	};

	useEffect(() => {
		if (message) {
			toggle();
			toggle2();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [message]);

	useEffect(() => {
		if (message2) {
			toggle2();
			navigate("/login");
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [message2]);

	return (
		<main>
			<ModalComponents
				isOpen={isOpen}
				toggle={toggle}
				title={"request phone number verification"}>
				<form>
					<div className="my-3">
						<label htmlFor="email">Phone number</label>
						<input
							type="tel"
							className="form-control"
							placeholder="08100000000"
							required
							value={stateData.telephone}
							onChange={e =>
								setStateData({ ...stateData, telephone: e.target.value })
							}
						/>
					</div>
					<button
						type="submit"
						disabled={loading}
						onClick={handleSubmit}
						className="btn btn-primary1 w-100 text-capitalize my-3">
						send
						{loading && <ClipLoader color={"#fff"} size={16} />}
					</button>
				</form>
				<div className="d-flex">
					<button
						className="btn btn-light bg-transparent text-capitalize ms-auto"
						onClick={() => {
							toggle();
							toggle2();
						}}>
						token?
					</button>
				</div>
			</ModalComponents>
			<ModalComponents
				isOpen={isOpen2}
				toggle={toggle2}
				title={"verify phone number"}>
				<form>
					<div className="my-3">
						<label htmlFor="email">Phone number</label>
						<input
							type="tel"
							className="form-control"
							placeholder="08100000000"
							required
							disabled
							value={stateData.telephone}
							onChange={e =>
								setStateData({ ...stateData, telephone: e.target.value })
							}
						/>
					</div>

					<div className="my-3">
						<label htmlFor="token">Token</label>
						<input
							type="number"
							className="form-control"
							placeholder="Token"
							required
							value={stateData.token}
							onChange={e =>
								setStateData({ ...stateData, token: e.target.value })
							}
						/>
					</div>
					<button
						type="submit"
						disabled={loading}
						onClick={handleSubmitNew}
						className="btn btn-primary1 w-100 text-capitalize my-3">
						submit
						{loading && <ClipLoader color={"#fff"} size={16} />}
					</button>
				</form>
				<div className="d-flex">
					<button
						className="btn btn-light bg-transparent text-capitalize me-auto"
						onClick={() => {
							toggle2();
							toggle();
						}}>
						back?
					</button>
				</div>
			</ModalComponents>
		</main>
	);
};
