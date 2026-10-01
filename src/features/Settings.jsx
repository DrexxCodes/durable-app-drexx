import React, { useContext, useEffect, useState } from "react";
import Container from "@/components/ui/Container";
import { GlobalState } from "@/Data/Context";
import Avatar from "@/components/ui/Avatar";
import { toast } from "react-toastify";
import { BsImage } from "react-icons/bs";
import { Buttons, EyeToggle } from "@/Utils";
import { ModalComponents } from "@/components/ui/Modal";
import { useParams } from "@/lib/router";
// import moment from "moment";

const MainSettings = () => {
	const { auth, updateUser, setStateName } = useContext(GlobalState);

	useEffect(() => {
		setStateName("settings");
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	let [state, setState] = useState(null),
		[logo, setLogo] = useState(false),
		[isOpen, setIsOpen] = useState(false),
		[loading, setLoading] = useState(false),
		toggle = () => {
			setIsOpen(!isOpen);
		},
		[active, setActive] = useState(0);

	useEffect(() => {
		setState(auth?.user);
	}, [auth?.user]);

	let handleChangeImage = e => {
			const file = e.target.files[0];
			let err = "";

			if (!file) return (err = `File, ${file?.name} does not exist`);
			if (!file.type.includes("image"))
				return (err = `File, ${file?.name} format not supported`);

			if (err) {
				return toast.error(err);
			} else {
				setLogo(file);
			}
		},
		handleSubmit = type => async e => {
			if (e) e.preventDefault();
			if (type === "profile-image") {
				if (!logo) return toast.info("Image required", { auth: 10000 });
				setLoading(true);
				await updateUser({ logo }, "profile-image");
				setLoading(false);
			} else {
				if (!state?.gender && !state?.bio)
					return toast.info("Gender or bio required", { auth: 10000 });
				setLoading(true);
				await updateUser(state);
				setLoading(false);
			}
		};

	let textChange =
		name =>
		({ target: { value } }) => {
			setState({ ...state, [name]: value });
		};

	// if (!state) return;

	return (
		<div className="py-4 bg-white aboutScreen">
			<Container className="py-5">
				<div className="d-flex justify-content-between align-items-center mb-3 px-md-4 px-2">
					<div>
						<h4 className="Lexend fw-600 fontReduceBig">My Account settings</h4>
						<div>
							<button
								onClick={() => setActive(0)}
								className={`btn ${
									active !== 0 ? "btn-light" : "btn-outline-primary1"
								}
								text-capitalize px-md-4 px-2 mx-1 mx-md-3 py-1 py-md-2 fontReduce2 text-dark`}>
								profile
							</button>
							<button
								onClick={() => setActive(1)}
								className={`btn ${
									active !== 1 ? "btn-light" : "btn-outline-primary1"
								}
								text-capitalize px-md-4 px-2 mx-1 mx-md-3 py-1 py-md-2 fontReduce2 text-dark`}>
								settings
							</button>
						</div>
					</div>
					<div className="d-flex align-items-center">
						<Avatar user={auth?.user} size={96} className="mx-3" />
						<div className="d-none d-md-block">
							<h5 className="Lexend">
								{auth?.user?.firstName} {auth?.user?.lastName}
							</h5>
							<small className="text-uppercase">{auth?.user?.privilege}</small>
						</div>
					</div>
				</div>
				{active === 1 ? (
					<GeneralSettings />
				) : (
					<ProfileSetup
						state={state}
						textChange={textChange}
						handleChangeImage={handleChangeImage}
						handleSubmit={handleSubmit}
						toggle={toggle}
						logo={logo}
						loading={loading}
						isOpen={isOpen}
					/>
				)}
			</Container>
		</div>
	);
};

export default MainSettings;

const ProfileSetup = ({
	state,
	textChange,
	isOpen,
	toggle,
	logo,
	handleChangeImage,
	handleSubmit,
	loading,
}) => {
	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	const { auth, usecase } = useContext(GlobalState);

	let [isRequest, setIsRequest] = useState(""),
		closeRequest = () => {
			setIsRequest("");
		};

	return (
		<>
			<div className="px-md-4 px-2 mb-5">
				<h5 className="Lexend fw-600 fontReduceBig">Profile</h5>
				<p className="fontReduce2">Upload phone and personal details here</p>
				<h5 className="mt-3 Lexend fw-600 fontReduceBig">Photos</h5>
				<div className="d-flex align-items-center">
					<Avatar user={state} size={64} className="mx-3" />
					<div className="d-flex align-items-center">
						{/* <button
							className={`btn btn-outline-primary1 text-capitalize px-md-4 px-2 mx-1 mx-md-3 py-1 py-md-2 fontReduce2 text-dark`}>
							remove
						</button> */}
						<button
							onClick={toggle}
							className={`btn btn-light text-capitalize px-md-4 px-2 mx-1 mx-md-3 py-1 py-md-2 fontReduce2 text-dark`}>
							change
						</button>
						<ModalComponents
							isOpen={isOpen}
							back={toggle}
							title="Update profile image">
							<div className="d-flex">
								<div className="mx-auto position-relative">
									<Avatar
										user={state}
										src={logo ? URL.createObjectURL(logo) : undefined}
										size={240}
										className="mx-auto"
									/>
									<div className="file_upload d-flex myCursor mt-auto ms-auto justify-content-end">
										<BsImage
											size={22}
											title="Upload image"
											className="mx-2 myCursor statusIcon"
										/>
										<input
											title="Upload file"
											type="file"
											name="file"
											id="file"
											multiple
											className="myCursor"
											accept="image/*"
											onChange={handleChangeImage}
										/>
									</div>
									{logo && (
										<Buttons
											onClick={handleSubmit("profile-image")}
											loading={logo && loading}
											css="btn btn-primary1 text-capitalize py-3 my-4"
											title={"Update profile image"}
										/>
									)}
								</div>
							</div>
						</ModalComponents>
					</div>
				</div>
			</div>
			<ProfileForm state={state} textChange={textChange} />
			<div className="d-flex justify-content-end my-3">
				<div className="d-flex align-items-center">
					<Buttons
						onClick={handleSubmit("update")}
						loading={!logo && loading}
						width=""
						css="btn-primary1 text-capitalize px-md-4 px-2 mx-1 mx-md-3 py-1 py-md-2 fontReduce2 text-white"
						title={"save"}
					/>
					<button
						className={`btn btn-outline-primary1 text-capitalize px-md-4 px-2 mx-1 mx-md-3 py-1 py-md-2 fontReduce2 text-primary1`}>
						cancel
					</button>
				</div>
			</div>
			{!auth?.user?.isAdmin && (
				<div>
					{auth?.user?.privilege !== "reseller" &&
						usecase?.usecase?.resellerUpgrade === "enable" && (
							<button
								onClick={() => setIsRequest("reseller")}
								className="btn btn-primary1
								text-capitalize px-md-4 px-2 mx-1 mx-md-3 py-1 py-md-3 fontReduce2 text-white">
								become a reseller
							</button>
						)}
					{auth?.user?.privilege !== "topuser" &&
						usecase?.usecase?.topuserUpgrade === "enable" && (
							<button
								onClick={() => setIsRequest("topuser")}
								className="btn btn-primary1
								text-capitalize px-md-4 px-2 mx-1 mx-md-3 py-1 py-md-3 fontReduce2 text-white">
								become a topuser
							</button>
						)}
					{["Teetop Digitals", "TEETOP DIGITALS"]?.includes(
						process.env.REACT_APP_NAME
					) &&
						auth?.user?.privilege !== "standalone" &&
						usecase?.usecase?.standaloneUpgrade === "enable" && (
							<button
								onClick={() => setIsRequest("standalone")}
								className="btn btn-primary1
								text-capitalize px-md-4 px-2 mx-1 mx-md-3 py-1 py-md-3 fontReduce2 text-white">
								become a standalone
							</button>
						)}
				</div>
			)}
			<WalletPinBox />
			<PasswordBox />
			<BecomeAgent isOpen={isRequest} back={closeRequest} />
		</>
	);
};

export const BecomeAgent = ({ isOpen, back }) => {
	let {
		usecase,
		upgrade,
		numberWithCommas,
		manageUpgrade,
		returnErrors,
		nairaSignNeutral,
	} = useContext(GlobalState);

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	let init = {
			privilege: isOpen,
			businessName: "",
			stateOfResidence: "",
			// dateOfBirth: "",
		},
		[state, setState] = useState(init),
		textChange =
			name =>
			({ target: { value } }) => {
				setState({ ...state, [name]: value });
			},
		[loading, setLoading] = useState(false),
		[submit, setSubmit] = useState(false),
		handleSubmit = async () => {
			let errArr = [];

			if (!state?.businessName)
				errArr.push({
					msg: "Business name is required",
					param: "businessName",
				});
			if (!state?.stateOfResidence)
				errArr.push({
					msg: "State of residence is required",
					param: "stateOfResidence",
				});
			// if (!state?.dateOfBirth)
			// 	errArr.push({ msg: "Date of birth is required", param: "dateOfBirth" });
			// if (!state?.ninNumber)
			// 	errArr.push({ msg: "NIN number is required", param: "ninNumber" });
			if (errArr?.length > 0)
				return returnErrors({
					error: errArr,
				});

			setLoading(true);
			await manageUpgrade({ ...state, privilege: isOpen });
			setLoading(false);
			setSubmit(true);
		};

	useEffect(() => {
		if (submit && upgrade?.isAdded) {
			back();
			setSubmit(false);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [submit, upgrade]);

	return (
		<>
			<ModalComponents
				isOpen={isOpen ? true : false}
				back={back}
				title={`Become a ${isOpen}`}>
				<div>
					<div className="mb-3">
						<label htmlFor="businessName">Business name</label>
						<input
							type="text"
							name="businessName"
							value={state?.businessName}
							onChange={textChange("businessName")}
							placeholder="Your Business Name"
							className="form-control py-3"
						/>
					</div>
					{/* <div className="mb-3">
						<label htmlFor="websiteURL">Website URL</label>
						<input
							type="url"
							name="websiteURL"
							value={state?.websiteURL}
							onChange={textChange("websiteURL")}
							placeholder="Your Website URL"
							className="form-control py-3"
						/>
					</div>
					<div className="mb-3">
						<label htmlFor="ninNumber">NIN</label>
						<input
							type="text"
							name="ninNumber"
							value={state?.ninNumber}
							onChange={textChange("ninNumber")}
							placeholder="Your NIN number"
							className="form-control py-3"
						/>
					</div> */}
					<div className="mb-3">
						<label htmlFor="stateOfResidence">State of Residence</label>
						<input
							type="text"
							name="stateOfResidence"
							value={state?.stateOfResidence}
							onChange={textChange("stateOfResidence")}
							placeholder="Your State of Residence"
							className="form-control py-3"
						/>
					</div>
					{/* <div className="mb-3">
						<label htmlFor="dateOfBirth">Date of birth</label>
						<input
							type="date"
							name="dateOfBirth"
							value={state?.dateOfBirth}
							onChange={textChange("dateOfBirth")}
							placeholder="Your Date of Birth"
							className="form-control py-3"
							max={moment().format("YYYY-MM-DD")}
						/>
					</div> */}
					<Buttons
						title={`Proceed ${nairaSignNeutral} ${
							isOpen === "reseller"
								? numberWithCommas(
										Number(usecase?.usecase?.resellerUpgradeFee).toFixed()
								  )
								: isOpen === "standalone"
								? numberWithCommas(
										Number(usecase?.usecase?.standaloneUpgradeFee).toFixed()
								  )
								: numberWithCommas(
										Number(usecase?.usecase?.topuserUpgradeFee).toFixed(2)
								  )
						} `}
						css="btn-primary1 text-capitalize py-3 w-50 my-4 mx-auto"
						width={"w-50"}
						style={{ borderRadius: "30px" }}
						loading={loading}
						onClick={handleSubmit}
					/>
				</div>
			</ModalComponents>
		</>
	);
};

const GeneralSettings = () => {
	const { settings, auth } = useContext(GlobalState);

	let [stateData, setStateData] = useState(null),
		[submit, setSubmit] = useState(false);

	useEffect(() => {
		setStateData(settings?.settings);
	}, [settings?.settings]);

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	useEffect(() => {
		if (submit && settings?.isUpdated) {
			setSubmit(false);
		}
	}, [settings?.isUpdated, submit]);

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	return (
		<Container className="px-lg-5  pt-3 pt-lg-0">
			<div className="mb-5">
				<h5 className="Lexend fw-600 fontReduceBig">General settings</h5>
			</div>
			<div className="row mx-0 g-3 g-md-4">
				<p className="fontReduce col-md-6">
					MTN commission:{" "}
					{auth?.user?.privilege === "standalone"
						? stateData?.mtnStandaloneCommission || stateData?.mtnCommission
						: auth?.user?.privilege === "reseller"
						? stateData?.mtnResellerCommission || stateData?.mtnCommission
						: stateData?.mtnCommission}
					%
				</p>
				<p className="fontReduce col-md-6">
					GLO commission:{" "}
					{auth?.user?.privilege === "standalone"
						? stateData?.gloStandaloneCommission || stateData?.gloCommission
						: auth?.user?.privilege === "reseller"
						? stateData?.gloResellerCommission || stateData?.gloCommission
						: stateData?.gloCommission}
					%
				</p>
				<p className="fontReduce col-md-6">
					AIRTEL commission:{" "}
					{auth?.user?.privilege === "standalone"
						? stateData?.airtelStandaloneCommission ||
						  stateData?.airtelCommission
						: auth?.user?.privilege === "reseller"
						? stateData?.airtelResellerCommission || stateData?.airtelCommission
						: stateData?.airtelCommission}
					%
				</p>
				<p className="fontReduce col-md-6">
					9MOBILE commission:{" "}
					{auth?.user?.privilege === "standalone"
						? stateData?.mobile9StandaloneCommission ||
						  stateData?.mobile9Commission
						: auth?.user?.privilege === "reseller"
						? stateData?.mobile9ResellerCommission ||
						  stateData?.mobile9Commission
						: stateData?.mobile9Commission}
					%
				</p>
				<p className="fontReduce col-md-6">
					MTN Card commission:{" "}
					{auth?.user?.privilege === "standalone"
						? stateData?.mtnCardStandaloneCommission ||
						  stateData?.mtnCardCommission
						: auth?.user?.privilege === "reseller"
						? stateData?.mtnCardResellerCommission ||
						  stateData?.mtnCardCommission
						: stateData?.mtnCardCommission}
					%
				</p>
				<p className="fontReduce col-md-6">
					GLO Card commission:{" "}
					{auth?.user?.privilege === "standalone"
						? stateData?.gloCardStandaloneCommission ||
						  stateData?.gloCardCommission
						: auth?.user?.privilege === "reseller"
						? stateData?.gloCardResellerCommission ||
						  stateData?.gloCardCommission
						: stateData?.gloCardCommission}
					%
				</p>
				<p className="fontReduce col-md-6">
					AIRTEL Card commission:{" "}
					{auth?.user?.privilege === "standalone"
						? stateData?.airtelCardStandaloneCommission ||
						  stateData?.airtelCardCommission
						: auth?.user?.privilege === "reseller"
						? stateData?.airtelCardResellerCommission ||
						  stateData?.airtelCardCommission
						: stateData?.airtelCardCommission}
					%
				</p>
				<p className="fontReduce col-md-6">
					9MOBILE Card commission:{" "}
					{auth?.user?.privilege === "standalone"
						? stateData?.mobile9StandaloneCommission ||
						  stateData?.mobile9Commission
						: auth?.user?.privilege === "reseller"
						? stateData?.mobile9ResellerCommission ||
						  stateData?.mobile9Commission
						: stateData?.mobile9CardCommission}
					%
				</p>
				<p className="fontReduce col-md-6">
					Electricity commission:{" "}
					{auth?.user?.privilege === "standalone"
						? stateData?.electricityStandaloneCommission ||
						  stateData?.electricityCommission
						: auth?.user?.privilege === "reseller"
						? stateData?.electricityResellerCommission ||
						  stateData?.electricityCommission
						: stateData?.electricityCommission}
					%
				</p>
				<p className="fontReduce col-md-6">
					Cables commission:{" "}
					{auth?.user?.privilege === "standalone"
						? stateData?.cablesStandaloneCommission ||
						  stateData?.cablesCommission
						: auth?.user?.privilege === "reseller"
						? stateData?.cablesResellerCommission || stateData?.cablesCommission
						: stateData?.cablesCommission}
					%
				</p>
				<p className="fontReduce col-md-6">
					Education commission:{" "}
					{auth?.user?.privilege === "standalone"
						? stateData?.educationStandaloneCommission ||
						  stateData?.educationCommission
						: auth?.user?.privilege === "reseller"
						? stateData?.educationResellerCommission ||
						  stateData?.educationCommission
						: stateData?.educationCommission}
					%
				</p>
				<p className="fontReduce col-md-6">
					Airtime to cash return: {stateData?.airtimeToCashCommission}%
				</p>
			</div>
		</Container>
	);
};

export const ProfileForm = ({ state, textChange }) => {
	let params = useParams(),
		{ auth } = useContext(GlobalState),
		[typePass, setTypePass] = useState(false),
		[typePass2, setTypePass2] = useState(false);
		
	return (
		<div className="row mx-0 g-3 g-md-5">
			<div className="col-md-6">
				<label className="dmMonoFont text-uppercase" htmlFor="firstName">
					First Name
				</label>
				<input
					type="text"
					className="form-control py-3 dmMonoFont"
					name="firstName"
					value={state?.firstName}
					onChange={textChange("firstName")}
					readOnly={params?.page === "users"}
				/>
			</div>
			<div className="col-md-6">
				<label className="dmMonoFont text-uppercase" htmlFor="lastName">
					Last Name
				</label>
				<input
					type="text"
					className="form-control py-3 dmMonoFont"
					name="lastName"
					value={state?.lastName}
					onChange={textChange("lastName")}
					readOnly={params?.page === "users"}
				/>
			</div>
			<div className="col-md-6">
				<label className="dmMonoFont text-uppercase" htmlFor="gender">
					Gender
				</label>
				<input
					type="text"
					className="form-control py-3 dmMonoFont"
					name="gender"
					value={state?.gender}
					onChange={textChange("gender")}
					placeholder="Gender"
					readOnly={params?.page === "users"}
				/>
			</div>
			<div className="col-md-6">
				<label className="dmMonoFont text-uppercase" htmlFor="bvnNumber">
					BVN Number
				</label>
				{/* <input
					type="text"
					className="form-control py-3 dmMonoFont"
					name="bvnNumber"
					value={state?.bvnNumber}
					onChange={textChange("bvnNumber")}
					placeholder="BVN Number"
					maxLength={11}
					readOnly={params?.page === "users"}
				/> */}
				<div className="relative">
					<div className="flex h-full w-full items-center">
						<input
							readOnly={auth?.user?.bvnNumber || params?.page === 'users'}
							type={typePass2 ? "tel" : "password"}
							maxLength={11}
							required
							style={{
								border: "none !important",
							}}
							name="bvnNumber"
							className="form-control py-3 dmMonoFont"
							value={state?.bvnNumber}
							onChange={textChange("bvnNumber")}
							placeholder="BVN Number"
						/>
						{!auth?.user?.bvnNumber && (
							<div className="absolute top-4 right-4">
								<EyeToggle typePass={typePass2} setTypePass={setTypePass2} />
							</div>
						)}
					</div>
				</div>
			</div>
			<div className="col-md-6">
				<label className="dmMonoFont text-uppercase" htmlFor="ninNumber">
					NIN Number
				</label>
				{/* <input
					type="text"
					className="form-control py-3 dmMonoFont"
					name="ninNumber"
					value={state?.ninNumber}
					onChange={textChange("ninNumber")}
					maxLength={11}
					readOnly={params?.page === "users"}
				/> */}
				<div className="relative">
					<div className="flex h-full w-full items-center">
						<input
							readOnly={auth?.user?.ninNumber || params?.page === 'users'}
							type={typePass ? "tel" : "password"}
							maxLength={11}
							required
							style={{
								border: "none !important",
							}}
							name="ninNumber"
							className="form-control py-3 dmMonoFont"
							value={state?.ninNumber}
							onChange={textChange("ninNumber")}
							placeholder="NIN Number"
						/>
						{!auth?.user?.ninNumber && (
							<div className="absolute top-4 right-4">
								<EyeToggle typePass={typePass} setTypePass={setTypePass} />
							</div>
						)}
					</div>
				</div>
			</div>
			<div className="col-md-6">
				<label className="dmMonoFont text-uppercase" htmlFor="bio">
					Bio
				</label>
				<textarea
					style={{
						height: "10rem",
						resize: "none",
					}}
					className="form-control py-3 dmMonoFont"
					name="bio"
					placeholder="Brief description"
					value={state?.bio}
					onChange={textChange("bio")}
					readOnly={params?.page === "users"}
				/>
			</div>
		</div>
	);
};

export const PasswordBox = () => {
	let { updatePassword, auth } = useContext(GlobalState);
	let init = {
			oldPassword: "",
			newPassword: "",
		},
		[state, setState] = useState(init),
		[loading, setLoading] = useState(false),
		[submit, setSubmit] = useState(false),
		textChange =
			name =>
			({ target: { value } }) => {
				setState({ ...state, [name]: value });
			},
		handleSubmit = async e => {
			e.preventDefault();
			if (!state?.oldPassword || !state?.newPassword) return;
			setLoading(true);
			await updatePassword(state);
			setLoading(false);
			setSubmit(true);
		};

	useEffect(() => {
		if (submit && auth?.isPassword) {
			setState(init);
			setSubmit(false);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [submit, auth?.isPassword]);

	return (
		<div className="py-4 py-md-5">
			<h6 className="Lexend fw-600 fontReduceBig text-uppercase mt-3 mt-md-5">
				change password
			</h6>
			<small className="">
				Please enter your current password to change your password.
			</small>
			<div className="row mx-0 g-5 col-md-8 mt-3">
				<div className="col-md-6">
					<label className="dmMonoFont text-uppercase" htmlFor="password">
						old Password
					</label>
					<input
						type="password"
						className="form-control py-3 dmMonoFont"
						name="password"
						placeholder="Old Password"
						value={state?.oldPassword}
						onChange={textChange("oldPassword")}
					/>
				</div>
				<div className="col-md-6">
					<label className="dmMonoFont text-uppercase" htmlFor="password">
						new Password
					</label>
					<input
						type="password"
						className="form-control py-3 dmMonoFont"
						name="password"
						placeholder="New Password"
						value={state?.newPassword}
						onChange={textChange("newPassword")}
					/>
				</div>
			</div>
			<div className="d-flex align-items-center my-3">
				<Buttons
					onClick={handleSubmit}
					loading={loading}
					css="btn-primary1 text-capitalize px-md-4 px-3 fontReduce mx-md-3 mx-2 py-2 text-white"
					title={"save"}
					width="w-auto"
				/>
				<button
					onClick={() => setState(init)}
					type="button"
					className={`btn btn-outline-primary1 text-capitalize px-md-4 px-3 fontReduce mx-md-3 mx-2 py-2 text-primary1`}>
					cancel
				</button>
			</div>
		</div>
	);
};

export const WalletPinBox = () => {
	let { manageWalletPin, wallet } = useContext(GlobalState);
	let init = {
			pin: "",
			oldPin: "",
		},
		[state, setState] = useState(init),
		[loading, setLoading] = useState(false),
		[submit, setSubmit] = useState(false),
		textChange =
			name =>
			({ target: { value } }) => {
				setState({ ...state, [name]: value });
			},
		handleSubmit = async e => {
			e.preventDefault();
			if (wallet?.balance?.wallet_pin)
				if (!state?.pin || !state?.oldPin) return;
				else if (!state?.pin) return;
			setLoading(true);
			await manageWalletPin(
				wallet?.balance?.wallet_pin ? "put" : "post",
				state
			);
			setLoading(false);
			setSubmit(true);
		};

	useEffect(() => {
		if (submit && wallet?.isWalletPin) {
			setState(init);
			setSubmit(false);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [submit, wallet?.isWalletPin]);

	return (
		<form
			onSubmit={handleSubmit}
			className="py-4 py-md-5 border-top border-bottom">
			<h6 className="Lexend fw-600 fontReduceBig text-uppercase mt-3 mt-md-5">
				manage transaction pin
			</h6>
			<small className="">
				{wallet?.balance?.wallet_pin
					? `Please enter your current pin to change your pin.`
					: `Add transaction pin`}
			</small>
			<div className="row mx-0 g-5 col-md-8 mt-3">
				{wallet?.balance?.wallet_pin && (
					<div className="col-md-6">
						<label className="dmMonoFont text-uppercase" htmlFor="password">
							old pin <small className="text-muted">4 digits</small>
						</label>
						<input
							type="number"
							className="form-control py-3 dmMonoFont"
							name="password"
							placeholder="Old pin"
							value={state?.oldPin}
							onChange={textChange("oldPin")}
							maxLength={4}
						/>
					</div>
				)}
				<div className="col-md-6">
					<label className="dmMonoFont text-uppercase" htmlFor="password">
						Pin<small className="text-muted">4 digits</small>
					</label>
					<input
						type="number"
						className="form-control py-3 dmMonoFont"
						name="password"
						placeholder="Pin"
						value={state?.pin}
						onChange={textChange("pin")}
						maxLength={4}
					/>
				</div>
			</div>
			<div className="d-flex align-items-center my-3">
				<Buttons
					onClick={handleSubmit}
					loading={loading}
					css="btn-primary1 text-capitalize px-md-4 px-3 fontReduce mx-md-3 mx-2 py-2 text-white"
					title={"save"}
					width="w-auto"
				/>
				<button
					onClick={() => setState(init)}
					type="button"
					className={`btn btn-outline-primary1 text-capitalize px-md-4 px-3 fontReduce mx-md-3 mx-2 py-2 text-primary1`}>
					cancel
				</button>
			</div>
		</form>
	);
};