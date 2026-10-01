import AuthLayout from "@/components/layout/AuthLayout";
import React, { useContext, useEffect, useState } from "react";
import { GlobalState } from "@/Data/Context";
import { useNavigate, Link, useSearchParams } from "@/lib/router";
import Container from "@/components/ui/Container";
import { Buttons, EyeToggle } from "@/Utils";
import { toast } from "react-toastify";

const Register = () => {
	const { registerUser, auth } = useContext(GlobalState);

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	let [typePass, setTypePass] = useState(false),
		[typePass2, setTypePass2] = useState(false),
		init = {
			firstName: "",
			lastName: "",
			telephone: "",
			email: "",
			password: "",
			confirmPassword: "",
			referral: "",
		},
		[state, setState] = useState(init),
		[loading, setLoading] = useState(false),
		[terms, setTerms] = useState(false),
		[submit, setSubmit] = useState(false),
		navigate = useNavigate(),
		textChange =
			name =>
			({ target: { value } }) => {
				setState({ ...state, [name]: value });
			},
		[getSearch] = useSearchParams();

	useEffect(() => {
		if (getSearch?.get("referral"))
			setState({ ...state, referral: getSearch?.get("referral") });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [getSearch]);

	let handleSubmit = async e => {
		e.preventDefault();
		if (
			!state?.password ||
			!state?.email ||
			!state?.firstName ||
			!state?.lastName ||
			!state?.telephone
		)
			return toast.info("Please fill out all fields");
		if (state?.password !== state?.confirmPassword)
			return toast.error("Password do not match");

		if (
			!/\d/.test(state?.password) ||
			// eslint-disable-next-line no-useless-escape
			!/[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(state?.password) ||
			state?.password?.length < 8
		)
			return toast.error(
				`Password must be at least 8 characters long, contains at least 1 number, 1 uppercase, 1 lowercase letter and 1 special character`
			);
		setLoading(true);
		await registerUser(state);
		setLoading(false);
		setSubmit(true);
	};

	useEffect(() => {
		if (submit && auth?.isRegistered) {
			navigate(auth?.regCase === "enable" ? "/activate" : "/login");
			setSubmit(false);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [submit, auth?.isRegistered, auth?.regCase]);

	return (
		<DefaultAuthComponent nozoom>
			<>
				<h3 className="text-capitalize text-center">Create account</h3>
				<small className="mb-4 d-block text-center">
					Enjoy the things that you love!
				</small>
				<form className="mt-4">
					<div className="mb-3">
						<label htmlFor="firstName">First Name</label>
						<input
							type="text"
							required
							name="firstName"
							className="form-control py-3"
							value={state.firstName}
							onChange={textChange("firstName")}
						/>
					</div>
					<div className="mb-3">
						<label htmlFor="lastName">Last Name</label>
						<input
							type="text"
							required
							name="lastName"
							className="form-control py-3"
							value={state.lastName}
							onChange={textChange("lastName")}
						/>
					</div>
					<div className="mb-3">
						<label htmlFor="email">Email</label>
						<input
							type="email"
							required
							name="email"
							className="form-control py-3"
							value={state.email}
							onChange={textChange("email")}
						/>
					</div>
					<div className="mb-3">
						<label htmlFor="telephone">Phone number</label>
						<input
							type="tel"
							required
							name="telephone"
							className="form-control py-3"
							value={state.telephone}
							onChange={textChange("telephone")}
						/>
					</div>
					<div className="mb-3 show-hide2 show-hide position-relative">
						<label htmlFor="Password">Password</label>
						<input
							type={typePass ? "text" : "password"}
							required
							name="password"
							className="form-control py-3"
							value={state.password}
							onChange={textChange("password")}
						/>
						<EyeToggle typePass={typePass} setTypePass={setTypePass} />
					</div>
					<div className="mb-5 show-hide2 show-hide position-relative">
						<label htmlFor="ConfirmPassword">Confirm Password</label>
						<input
							type={typePass2 ? "text" : "password"}
							required
							name="confirmPassword"
							className="form-control py-3"
							value={state.confirmPassword}
							onChange={textChange("confirmPassword")}
						/>
						<EyeToggle typePass={typePass2} setTypePass={setTypePass2} />
					</div>
					<div className="mb-3">
						<label htmlFor="referral">
							Referral Code <small className="text-muted">(optional)</small>
						</label>
						<input
							type="tel"
							required
							name="referral"
							className="form-control py-3"
							value={state.referral}
							onChange={textChange("referral")}
							readOnly={getSearch?.get("referral")}
						/>
					</div>
					<p className="text-center d-flex align-items-center">
						<input
							type="checkbox"
							name="terms"
							className="form-check-input form-check form-check-inline"
							value={terms}
							onChange={e => setTerms(e.target.checked)}
							id=""
						/>{" "}
						<span className="myCursor" onClick={() => navigate("/privacy")}>
							By continuing you accept our standard terms and conditions and our
							privacy policy.
						</span>
					</p>
					<Buttons
						onClick={handleSubmit}
						loading={loading}
						disabled={!terms}
						title={"sign up"}
						css="btn-primary1 text-capitalize py-3 w-100 my-4"
					/>
					<p className="text-center">
						Already have an account?
						<Link
							to={`/login`}
							className="textColor ps-1 text-decoration-none fw-600">
							Log in
						</Link>{" "}
					</p>
					<div className="d-flex justify-content-end py-3">
						<Link
							to={`/activate`}
							className="textColor text-decoration-none fw-600">
							Activate account here
						</Link>{" "}
					</div>
				</form>
			</>
		</DefaultAuthComponent>
	);
};

export default Register;

export const DefaultAuthComponent = AuthLayout;
