import React, { useContext, useEffect, useState } from "react";
import { GlobalState } from "@/Data/Context";
import { useNavigate, useSearchParams, Link } from "@/lib/router";
import { safeNext } from "@/lib/redirect";
import { Buttons, EyeToggle } from "@/Utils";
import { DefaultAuthComponent } from "@/views/public/register";
import { VerifyMail } from "@/views/public/forget-password";

const Login = () => {
	const { loginUser, auth, loginUser2FA } = useContext(GlobalState);

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	let [typePass, setTypePass] = useState(false),
		init = {
			email: "",
			password: "",
		},
		[stateData, setStateData] = useState(init),
		[loading, setLoading] = useState(false),
		[submit, setSubmit] = useState(false),
		[step, setStep] = useState(1),
		[code, setCode] = useState(""),
		navigate = useNavigate(),
		[query] = useSearchParams(),
		next = safeNext(query?.get("next")),
		textChange =
			name =>
			({ target: { value } }) => {
				setStateData({ ...stateData, [name]: value });
			};

	let handleSubmit = async e => {
			e.preventDefault();
			// if (!stateData?.password || !stateData?.email) return;
			setLoading(true);
			await loginUser(stateData);
			setLoading(false);
			setSubmit(true);
		},
		handleSubmit2 = async e => {
			e?.preventDefault();
			if (!code) return;
			setLoading(true);
			await loginUser2FA({ token: code });
			// getSetTempUser("auth");
			setLoading(false);
			setSubmit(true);
		};

	useEffect(() => {
		if (submit && auth?.isLoggedIn) {
			setSubmit(false);
			navigate(next || "/");
		}
		if (submit && auth?.is2FA) {
			setSubmit(false);
			setStep(2);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [submit, auth?.isLoggedIn, auth?.is2FA]);

	return (
		<DefaultAuthComponent nozoom>
			<>
				<h3 className="text-capitalize text-center">Login</h3>
				<small className="mb-4 d-block text-center">
					{step !== 1
						? `Please input the token in your ${
								auth?.is2FAType === "authenticator"
									? "Authenticator App"
									: "Email"
						  }`
						: `Data abi? Oya come!`}
				</small>
				{step !== 1 ? (
					<>
						<Enable2FAComponent
							handleSubmit={handleSubmit2}
							loading={loading}
							code={code}
							setCode={setCode}
							subtext={`Enter code from your ${
								auth?.is2FAType === "authenticator"
									? "Authenticator App"
									: "Email"
							}`}
						/>
					</>
				) : (
					<form className="mt-4">
						<div className="mb-3">
							<label htmlFor="email">Email</label>
							<input
								type="email"
								required
								name="email"
								className="form-control py-3"
								value={stateData.email}
								onChange={textChange("email")}
							/>
						</div>
						<div className="mb-3 show-hide2 show-hide position-relative">
							<label htmlFor="Password">Password</label>
							<input
								type={typePass ? "text" : "password"}
								required
								name="password"
								className="form-control py-3"
								value={stateData.password}
								onChange={textChange("password")}
							/>
							<EyeToggle typePass={typePass} setTypePass={setTypePass} />
						</div>
						<p className="my-4 justify-content-end d-flex">
							<Link
								to={`/forget-password`}
								className="text-decoration-none fw-600 text-dark">
								Forgot Password?
							</Link>{" "}
						</p>
						<Buttons
							onClick={handleSubmit}
							loading={loading}
							title={"sign in"}
							css="btn-primary1 text-capitalize py-3 w-100 my-4"
						/>
						<div className="d-flex py-5 flex-column">
							<p className="text-center">Don't have an account?</p>
							<Link
								to={`/register`}
								className="btn btn-outline-primary1 px-5 py-3 text-decoration-none fw-600 text-dark mx-auto">
								Create Account
							</Link>{" "}
						</div>
						<p className="text-center">
							By continuing you accept our standard terms and conditions and our
							privacy policy.
						</p>
						<div className="d-flex justify-content-end py-3">
							<Link
								to={`/activate`}
								className="textColor text-decoration-none fw-600">
								Activate account here
							</Link>{" "}
						</div>
					</form>
				)}
			</>
		</DefaultAuthComponent>
	);
};

export default Login;

export const Enable2FAComponent = ({
	handleSubmit,
	code,
	setCode,
	loading,
	subtext,
}) => {
	return (
		<>
			<h3 className="text-capitalize">OTP</h3>
			<form onSubmit={handleSubmit}>
				<VerifyMail
					code={code}
					setCode={setCode}
					text="confirm Token"
					numInputs={6}
					subtext={subtext}
					isInputSecure
				/>
				<Buttons
					onClick={handleSubmit}
					loading={loading}
					css="btn btn-primary1 text-capitalize py-3 w-100 my-4"
					title="confirm Token"
					type="button"
				/>
			</form>
		</>
	);
};
