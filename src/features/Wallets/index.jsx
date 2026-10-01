import React, { useContext, useEffect, useState } from "react";
import { GlobalState } from "@/Data/Context";
import Container from "@/components/ui/Container";
import moment from "moment";
import { BiCopy, BiDotsHorizontalRounded } from "react-icons/bi";
import { FiCreditCard, FiHash, FiSend, FiUpload } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { getWalletBalance } from "@/Data/Actions/GeneralAction";
import { RiShieldStarFill } from "react-icons/ri";
import { Buttons, EmptyComponent } from "@/Utils";
import { Link } from "@/lib/router";
import { toast } from "react-toastify";
import { ModalComponents } from "@/components/ui/Modal";
import { FaCcMastercard, FaCcVisa } from "react-icons/fa";
import LoadMore, { BottomTab } from "@/features/LoadMore";
import { useFlutterwave, closePaymentModal } from "flutterwave-react-v3";
import axios from "axios";
import { usePaystackPayment } from "react-paystack";
// import { useMonnifyPayment } from "react-monnify";
import { MainPaginate, MainRanger } from "@/features/Transactions";
import { TransactionPinBox } from "@/features/Products/AutoBuy";

let colorArr = ["#E9F9F9", "#C0938E", "#000000", "#B3CEDE"];

const Wallets = () => {
	let { setStateName, wallet, numberWithCommas, usecase, nairaSign, biller } =
		useContext(GlobalState);
	const dispatch = useDispatch();
	// balance is the source the API fills; wallet_details is a fallback
	const walletId = wallet?.balance?.wallet_id || wallet?.wallet_details?.wallet_id || "";
	let [isTransfer, setIsTransfer] = useState(false);
	let [isWithdraw, setIsWithdraw] = useState(false);
	let toggleTransfer = () => {
		setIsTransfer(!isTransfer);
	};
	let toggleWithdraw = () => {
		setIsWithdraw(!isWithdraw);
	};
	let [isVirtual, setIsVirtual] = useState(false);
	let toggleVirtual = () => {
		setIsVirtual(!isVirtual);
	};
	let [isCard, setIsCard] = useState("");
	let toggleCard = () => {
		setIsCard("");
	};
	let [isCardType, setIsCardType] = useState("");
	let toggleCardType = () => {
		setIsCardType(!isCardType);
	};
	let [isManualPayment, setIsManualPayment] = useState(false);
	let toggleManualPayment = () => {
		setIsManualPayment(!isManualPayment);
	};
	let [moveType, setMoveType] = useState(false),
		[key, setKey] = useState({
			flutterwave: process.env.REACT_APP_FLUTTERWAVE_PUBLIC_KEY,
			paystack: process.env.REACT_APP_PAYSTACK_PUBLIC_KEY,
		}),
		[thisData, setThisData] = useState(false);

	useEffect(() => {
		if (biller) {
			let value = biller?.data?.find(item =>
				item?.name?.includes("flutterwave")
			);
			if (value)
				if (value?.apiKey) setKey({ ...key, flutterwave: value?.apiKey });
			let value2 = biller?.data?.find(item => item?.name?.includes("paystack"));
			if (value2)
				if (value2?.apiKey) setKey({ ...key, paystack: value2?.apiKey });
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [biller]);

	// The wallet ID normally arrives with the balance fetched at login. If it is not in the
	// store yet (staged login fetch still running, or it failed), fetch it again here.
	useEffect(() => {
		setStateName("my account");
		if (!walletId) dispatch(getWalletBalance());
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const copyWalletId = () => {
		if (!walletId) return;
		navigator.clipboard.writeText(walletId).then(
			() => toast.info("Copied", { autoClose: 2000 }),
			err => toast.warn(`Could not copy: ${err}`, { autoClose: 2000 })
		);
	};

	const money = value =>
		value ? numberWithCommas(Number(value).toFixed(2)) : 0;

	const breakdown = [
		{ key: "commission", label: "Commission", to: "/wallets/commissions" },
		{ key: "bonus", label: "Bonus", to: "/wallets/bonus" },
		{ key: "referral", label: "Referral", to: "/wallets/referral" },
	];

	return (
		<div className="aboutScreen">
			<Container className="wallet-page">
				<section className="wallet-hero">
					<div className="wallet-hero-main">
						<span className="balance-label">Wallet balance</span>
						<div className="balance-value">NGN {money(wallet?.balance?.available)}</div>
						<div className="wallet-id">
							<span className="wallet-id-label">Wallet ID</span>
							<span className="wallet-id-value">{walletId || "-"}</span>
							<button
								type="button"
								className="wallet-id-copy"
								onClick={copyWalletId}
								disabled={!walletId}
								aria-label="Copy wallet ID">
								<BiCopy /> Copy
							</button>
						</div>
					</div>
					<div className="wallet-actions">
						<span className="wallet-actions-title">Fund wallet</span>
						<button
							type="button"
							onClick={toggleVirtual}
							className="btn wallet-action is-primary">
							<FiHash /> Virtual account
						</button>
						{usecase?.usecase?.fundWallet === "enable" && (
							<button
								type="button"
								onClick={toggleCardType}
								className="btn wallet-action">
								<FiCreditCard /> Debit card
							</button>
						)}
						<button
							type="button"
							onClick={toggleManualPayment}
							className="btn wallet-action">
							<FiUpload /> Manual funding
						</button>
						{usecase?.usecase?.transferFund === "enable" && (
							<button
								type="button"
								onClick={toggleTransfer}
								className="btn wallet-action">
								<FiSend /> Wallet transfer
							</button>
						)}
					</div>
				</section>

				<section className="wallet-breakdown">
					{breakdown.map(item => (
						<div className="wallet-tile" key={item.key}>
							<span className="stat-label">{item.label}</span>
							<div className="wallet-tile-value">
								{nairaSign}
								{money(wallet?.balance?.[item.key])}
							</div>
							<div className="wallet-tile-actions">
								<button
									type="button"
									className="wallet-link"
									onClick={() => setMoveType(item.key)}>
									Move to wallet
								</button>
								<Link to={item.to} className="wallet-link">
									History
								</Link>
							</div>
						</div>
					))}
					<div className="wallet-tile">
						<span className="stat-label">Purchase</span>
						<div className="wallet-tile-value">
							{nairaSign}
							{money(wallet?.wallet_details?.purchase)}
						</div>
					</div>
				</section>

				{wallet?.cards?.length > 0 && (
					<section className="wallet-section">
						<h2 className="section-title">Saved cards</h2>
						<CardList bg />
					</section>
				)}

				<section className="wallet-section">
					<h2 className="section-title">Wallet history</h2>
					<TransferList setThisData={setThisData} />
					<WalletDetails thisData={thisData} setThisData={setThisData} />
				</section>
			</Container>
			<MakeTransfer isOpen={isTransfer} back={toggleTransfer} />
			<MakeWithdraw isOpen={isWithdraw} back={toggleWithdraw} />
			<MakeCardType
				isOpen={isCardType}
				back={toggleCardType}
				setIsCard={setIsCard}
			/>
			{key?.flutterwave &&
				usecase?.usecase?.fundWalletFlutterwave === "enable" &&
				isCard === "flutterwave" && (
					<MakeCardsFlutter
						isOpen={isCard === "flutterwave"}
						back={toggleCard}
						back2={() => setIsCard("")}
						value={isCard}
						apiKey={key?.flutterwave}
					/>
				)}
			{key?.paystack &&
				usecase?.usecase?.fundWalletPaystack === "enable" &&
				isCard === "paystack" && (
					<MakeCardsPaystack
						isOpen={isCard === "paystack"}
						back={toggleCard}
						back2={() => setIsCard("")}
						value={isCard}
						apiKey={key?.paystack}
					/>
				)}
			{
				// process.env.REACT_APP_MONNIFY_API_KEY &&
				// 	process.env.REACT_APP_MONNIFY_CONTRACT_CODE &&
				usecase?.usecase?.fundWalletMonnifyCard === "enable" &&
					isCard === "monnify" && (
						// <MakeCardsMonnify
						// 	isOpen={isCard === "monnify"}
						// 	back={toggleCard}
						// 	back2={() => setIsCard("")}
						// 	value={isCard}
						// />
						<MakeCardsMonnifyNew
							isOpen={isCard === "monnify"}
							back={toggleCard}
							back2={() => setIsCard("")}
							value={isCard}
						/>
					)
			}
			{["KEMTECH ENTERPRISES"]?.includes(process.env.REACT_APP_NAME) &&
				usecase?.usecase?.fundWalletBudpayCard === "enable" &&
				isCard === "budpay" && (
					<MakeCardsBudpay
						isOpen={isCard === "budpay"}
						back={toggleCard}
						back2={() => setIsCard("")}
						value={isCard}
					/>
				)}
			{["Durable Telecommunications"]?.includes(process.env.REACT_APP_NAME) &&
				usecase?.usecase?.fundWalletPayvesselCard === "enable" &&
				isCard === "payvessel" && (
					<MakeCardsBudpay
						isOpen={isCard === "payvessel"}
						back={toggleCard}
						back2={() => setIsCard("")}
						value={isCard}
					/>
				)}
			<MakeVirtual isOpen={isVirtual} back={toggleVirtual} />
			<MoveFund isOpen={moveType} back={() => setMoveType(false)} />
			<ManualAccounts isOpen={isManualPayment} back={toggleManualPayment} />
		</div>
	);
};

export default Wallets;

const MoveFund = ({ isOpen, back }) => {
	const { bonus, commission, manageWallet, referral } = useContext(GlobalState);

	let [loading, setLoading] = useState(false),
		[submit, setSubmit] = useState(false);
	let handleMove = async e => {
		e?.preventDefault();
		setLoading(true);
		await manageWallet(isOpen);
		setLoading(false);
		setSubmit(true);
	};

	useEffect(() => {
		if (isOpen === "bonus" && submit && bonus?.isMoved) {
			setSubmit(false);
			back();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isOpen, submit, bonus?.isMoved]);

	useEffect(() => {
		if (isOpen === "commission" && submit && commission?.isMoved) {
			setSubmit(false);
			back();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isOpen, submit, commission?.isMoved]);

	useEffect(() => {
		if (isOpen === "referral" && submit && referral?.isMoved) {
			setSubmit(false);
			back();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isOpen, submit, referral?.isMoved]);

	return (
		<>
			<ModalComponents
				isOpen={isOpen}
				back={back}
				title={`Move ${isOpen} wallet`}>
				<form>
					<div className="downH2 d-flex align-items-center justify-content-center">
						<form className="">
							<p>Do you want to move {isOpen} to main wallet?</p>
							<div className="btn-group mx-auto w-100">
								<Buttons
									loading={loading}
									onClick={handleMove}
									width="w-50"
									css="btn-primary1 text-capitalize py-3 w-50"
									title={"yes"}
								/>
								<Buttons
									onClick={back}
									width="w-50"
									css="btn-secondary text-capitalize py-3 w-50"
									title={"no"}
								/>
							</div>
						</form>
					</div>
				</form>
			</ModalComponents>
		</>
	);
};

const MakeCardType = ({ isOpen, back, setIsCard }) => {
	let { usecase } = useContext(GlobalState);
	let [details, setDetails] = useState("");
	return (
		<>
			<ModalComponents isOpen={isOpen} back={back} title="Choose provider">
				<form>
					<div>
						{process.env.REACT_APP_PAYSTACK_PUBLIC_KEY &&
							usecase?.usecase?.fundWalletPaystack === "enable" && (
								<div
									onClick={() => setDetails("paystack")}
									className={`my-3 d-flex align-items-center rounded10 myCursor flex-column p-3 ${
										details === "paystack" ? "list-group-item-info" : ""
									}`}>
									<div className="d-flex flex-column mx-auto">
										<div
											className="p-3 d-flex rounded10 align-items-center justify-content-center"
											style={{
												background: "#EFEFEF",
												height: "5rem",
												width: "100%",
											}}>
											<img
												src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Paystack_Logo.png/1200px-Paystack_Logo.png?20200430170057"
												alt="Paystack"
												className="img-fluid objectFit h-100 w-100"
											/>
										</div>
									</div>
									<div className="text-center">
										<h6 className="fw-bold text-dark Lexend text2p">
											Paystack
										</h6>
									</div>
								</div>
							)}
						{process.env.REACT_APP_FLUTTERWAVE_PUBLIC_KEY &&
							usecase?.usecase?.fundWalletFlutterwave === "enable" && (
								<div
									onClick={() => setDetails("flutterwave")}
									className={`my-3 d-flex align-items-center rounded10 myCursor flex-column p-3 ${
										details === "flutterwave" ? "list-group-item-info" : ""
									}`}>
									<div className="d-flex flex-column mx-auto">
										<div
											className="p-3 d-flex rounded10 align-items-center justify-content-center"
											style={{
												background: "#EFEFEF",
												height: "5rem",
												width: "100%",
											}}>
											<img
												src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Flutterwave_Logo.png/1200px-Flutterwave_Logo.png?20220812092224"
												alt="Flutterwave"
												className="img-fluid objectFit h-100 w-100"
											/>
										</div>
									</div>
									<div className="text-center">
										<h6 className="fw-bold text-dark Lexend text2p">
											Flutterwave
										</h6>
									</div>
								</div>
							)}
						{/* {["Durable Telecommunications"]?.includes(
							process.env.REACT_APP_NAME
						) &&
							usecase?.usecase?.fundWalletPayvesselCard === "enable" && (
								<div
									onClick={() => setDetails("payvessel")}
									className={`my-3 d-flex align-items-center rounded10 myCursor flex-column p-3 ${
										details === "payvessel" ? "list-group-item-info" : ""
									}`}>
									<div className="d-flex flex-column mx-auto">
										<div
											className="p-3 d-flex rounded10 align-items-center justify-content-center"
											style={{
												background: "#EFEFEF",
												height: "5rem",
												width: "100%",
											}}>
											<img
												src="https://payvessel.com/images/payvessel%20logo%20no%20bg%201.png"
												alt="Payvessel"
												className="img-fluid objectFit h-100 w-100"
											/>
										</div>
									</div>
									<div className="text-center">
										<h6 className="fw-bold text-dark Lexend text2p">
											Payvessel
										</h6>
									</div>
								</div>
							)} */}
						{["KEMTECH ENTERPRISES"]?.includes(process.env.REACT_APP_NAME) &&
							usecase?.usecase?.fundWalletBudpayCard === "enable" && (
								<div
									onClick={() => setDetails("budpay")}
									className={`my-3 d-flex align-items-center rounded10 myCursor flex-column p-3 ${
										details === "budpay" ? "list-group-item-info" : ""
									}`}>
									<div className="d-flex flex-column mx-auto">
										<div
											className="p-3 d-flex rounded10 align-items-center justify-content-center"
											style={{
												background: "#EFEFEF",
												height: "5rem",
												width: "100%",
											}}>
											<img
												src="https://merchant.budpay.com/assets/front/img/BudPay-Logo3.png"
												alt="Budpay"
												className="img-fluid objectFit h-100 w-100"
											/>
										</div>
									</div>
									<div className="text-center">
										<h6 className="fw-bold text-dark Lexend text2p">Budpay</h6>
									</div>
								</div>
							)}
						{
							// process.env.REACT_APP_MONNIFY_API_KEY &&
							// 	process.env.REACT_APP_MONNIFY_CONTRACT_CODE &&
							usecase?.usecase?.fundWalletMonnifyCard === "enable" && (
								<div
									onClick={() => setDetails("monnify")}
									className={`my-3 border-bottom d-flex align-items-center rounded10 myCursor flex-column p-3 ${
										details === "monnify" ? "list-group-item-info" : ""
									}`}>
									<div className="d-flex flex-column mx-auto">
										<div
											className="p-3 d-flex rounded10 align-items-center justify-content-center"
											style={{
												background: "#EFEFEF",
												height: "5rem",
												width: "100%",
											}}>
											<img
												src="https://monnify.com/assets/img/svg/site-logo.svg"
												alt="Monnify"
												className="img-fluid objectFit h-100 w-100"
											/>
										</div>
									</div>
									<div className="text-center">
										<h6 className="fw-bold text-dark Lexend text2p">Monnify</h6>
									</div>
								</div>
							)
						}
					</div>
					<Buttons
						title={"proceed"}
						css="btn-primary1 text-capitalize py-3 w-50 my-4 mx-auto"
						width={"w-50"}
						style={{ borderRadius: "30px" }}
						onClick={() => {
							if (!details) return;
							setIsCard(details);
							back();
						}}
					/>
				</form>
			</ModalComponents>
		</>
	);
};

const MakeCardsFlutter = ({ isOpen, back, back2, apiKey }) => {
	const {
		wallet,
		returnErrors,
		usecase,
		auth,
		manageFundWalletFlutterwave,
		nairaSignNeutral,
	} = useContext(GlobalState);

	let [amount, setAmount] = useState(""),
		[payment_data, setPaymentData] = useState(null),
		[reference, setReference] = useState(Date.now()),
		config = {
			public_key: apiKey,
			tx_ref: reference,
			amount,
			currency: "NGN",
			payment_options: "card",
			customer: {
				email: auth?.user?.email,
				phone_number: auth?.user?.telephone,
				name: `${auth?.user?.firstName} ${auth?.user?.lastName}`,
			},
			customizations: {
				title: process.env.REACT_APP_NAME + " Wallet Funding",
				description: "Card wallet funding",
				logo: process.env.REACT_APP_IMAGE_URL,
			},
		},
		handleFlutterPayment = useFlutterwave(config);

	useEffect(() => {
		if (payment_data) {
			let sendBackend = async () => {
				setLoading(true);
				await manageFundWalletFlutterwave(payment_data, "flutterwave");
				setLoading(false);
				setSubmit(true);
			};

			sendBackend();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [payment_data]);

	useEffect(() => {
		if (reference) {
			handleFlutterPayment({
				callback: response => {
					// console.log(response);
					setPaymentData(response);
					closePaymentModal();
				},
				onClose: () => {},
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [reference]);

	let [loading, setLoading] = useState(false),
		[submit, setSubmit] = useState(false),
		handleSubmit = async e => {
			e?.preventDefault();
			if (Number(amount) <= 0)
				return returnErrors({
					error: [
						{
							msg: `Amount cannot be less than or equal to ${nairaSignNeutral} 0`,
							param: "amount",
						},
					],
				});
			if (Number(amount) < Number(usecase?.usecase?.cardFundingMini))
				return returnErrors({
					error: [
						{
							msg: `Amount cannot be less than ${nairaSignNeutral} ${Number(
								usecase?.usecase?.cardFundingMini
							)}`,
							param: "amount",
						},
					],
				});
			if (Number(amount) > Number(usecase?.usecase?.cardFundingMax))
				return returnErrors({
					error: [
						{
							msg: `Amount cannot be more than ${nairaSignNeutral} ${Number(
								usecase?.usecase?.cardFundingMax
							)}`,
							param: "amount",
						},
					],
				});
			if (!apiKey)
				return returnErrors({
					error: [
						{
							msg: `Your request could not be processed at the moment, please try again later`,
							param: "flutterwave",
						},
					],
				});
			// console.log({ payment_data });
			try {
				setLoading(true);
				var resp = await axios.get(`/api/v2/wallet/generate-wallet-reference`);
				// console.log({ resp: resp?.data });
				setReference(resp?.data?.data);
				setLoading(false);
			} catch (err) {
				setLoading(false);
				console.log({ err });
				let error = err.response?.data?.error;
				if (error) {
					returnErrors({ error, status: err?.response?.status });
				}
				if (err?.response?.status === 429) toast.error(err?.response?.data);
			}
		};

	useEffect(() => {
		if (submit && wallet?.isFunded) {
			back2();
			setSubmit(false);
			setReference("");
			setPaymentData(null);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [submit, wallet?.isFunded]);

	// console.log({ wal: wallet?.data, updateValue });
	return (
		<>
			<ModalComponents
				isOpen={isOpen ? true : false}
				back={back}
				title="Flutterwave checkout process">
				<form>
					<div className="mb-3">
						<label htmlFor="value">Amount</label>
						<input
							type={"number"}
							placeholder="50000"
							className="form-control py-3 rounded10"
							value={amount}
							onChange={e => setAmount(e.target.value)}
						/>
					</div>
					<Buttons
						title={"fund"}
						css="btn-primary1 text-capitalize py-3 w-50 my-4 mx-auto"
						width={"w-50"}
						style={{ borderRadius: "30px" }}
						loading={loading}
						onClick={() => handleSubmit()}
					/>
				</form>
			</ModalComponents>
		</>
	);
};

// export const MakeCardsBudpay = ({ isOpen, back, back2 }) => {
// 	const { returnErrors, usecase, nairaSignNeutral } = useContext(GlobalState);

// 	let [amount, setAmount] = useState(""),
// 		[paymentData, setPaymentData] = useState(null);

// 	useEffect(() => {
// 		if (paymentData) back2();
// 		setPaymentData(null);
// 		// eslint-disable-next-line react-hooks/exhaustive-deps
// 	}, [paymentData]);

// 	let [loading, setLoading] = useState(false),
// 		handleSubmit = async e => {
// 			e?.preventDefault();
// 			if (Number(amount) <= 0)
// 				return returnErrors({
// 					error: [
// 						{
// 							msg: `Amount cannot be less than or equal to ${nairaSignNeutral} 0`,
// 							param: "amount",
// 						},
// 					],
// 				});
// 			if (Number(amount) < Number(usecase?.usecase?.cardFundingMini))
// 				return returnErrors({
// 					error: [
// 						{
// 							msg: `Amount cannot be less than ${nairaSignNeutral} ${Number(
// 								usecase?.usecase?.cardFundingMini
// 							)}`,
// 							param: "amount",
// 						},
// 					],
// 				});
// 			if (Number(amount) > Number(usecase?.usecase?.cardFundingMax))
// 				return returnErrors({
// 					error: [
// 						{
// 							msg: `Amount cannot be more than ${nairaSignNeutral} ${Number(
// 								usecase?.usecase?.cardFundingMax
// 							)}`,
// 							param: "amount",
// 						},
// 					],
// 				});
// 			// console.log({ payment_data });
// 			try {
// 				setLoading(true);
// 				var resp = await axios.post(`/api/v2/wallet/manage-budpay`, { amount });
// 				setPaymentData(resp?.data?.data);
// 				setLoading(false);
// 				window.open(resp?.data?.data?.authorization_url, "_blank");
// 			} catch (err) {
// 				setLoading(false);
// 				console.log({ err });
// 				let error = err.response?.data?.error;
// 				if (error) {
// 					returnErrors({ error, status: err?.response?.status });
// 				}
// 				if (err?.response?.status === 429) toast.error(err?.response?.data);
// 			}
// 		};

// 	// console.log({ wal: wallet?.data, updateValue });
// 	return (
// 		<>
// 			<ModalComponents
// 				isOpen={isOpen ? true : false}
// 				back={back}
// 				title="Budpay checkout process">
// 				<form>
// 					<div className="mb-3">
// 						<label htmlFor="value">Amount</label>
// 						<input
// 							type={"number"}
// 							placeholder="50000"
// 							className="form-control py-3 rounded10"
// 							value={amount}
// 							onChange={e => setAmount(e.target.value)}
// 						/>
// 					</div>
// 					<Buttons
// 						title={"fund"}
// 						css="btn-primary1 text-capitalize py-3 w-50 my-4 mx-auto"
// 						width={"w-50"}
// 						style={{ borderRadius: "30px" }}
// 						loading={loading}
// 						onClick={() => handleSubmit()}
// 					/>
// 				</form>
// 			</ModalComponents>
// 		</>
// 	);
// };

export const MakeCardsMonnifyNew = ({ isOpen, back, back2 }) => {
	const { returnErrors, usecase, nairaSignNeutral } = useContext(GlobalState);

	let [amount, setAmount] = useState(""),
		[paymentData, setPaymentData] = useState(null);

	useEffect(() => {
		if (paymentData) back2();
		setPaymentData(null);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [paymentData]);

	let [loading, setLoading] = useState(false),
		handleSubmit = async e => {
			e?.preventDefault();
			if (Number(amount) <= 0)
				return returnErrors({
					error: [
						{
							msg: `Amount cannot be less than or equal to ${nairaSignNeutral} 0`,
							param: "amount",
						},
					],
				});
			if (Number(amount) < Number(usecase?.usecase?.cardFundingMini))
				return returnErrors({
					error: [
						{
							msg: `Amount cannot be less than ${nairaSignNeutral} ${Number(
								usecase?.usecase?.cardFundingMini
							)}`,
							param: "amount",
						},
					],
				});
			if (Number(amount) > Number(usecase?.usecase?.cardFundingMax))
				return returnErrors({
					error: [
						{
							msg: `Amount cannot be more than ${nairaSignNeutral} ${Number(
								usecase?.usecase?.cardFundingMax
							)}`,
							param: "amount",
						},
					],
				});
			// console.log({ payment_data });
			try {
				setLoading(true);
				var resp = await axios.put(`/api/v1/wallet/manage-monnify`, {
					amount,
				});
				setPaymentData(resp?.data?.data);
				setLoading(false);
				window.open(
					resp?.data?.data?.checkoutUrl || resp?.data?.checkoutUrl,
					"_blank"
				);
			} catch (err) {
				setLoading(false);
				console.log({ err });
				let error = err.response?.data?.error;
				if (error) {
					returnErrors({ error, status: err?.response?.status });
				}
				if (err?.response?.status === 429) toast.error(err?.response?.data);
			}
		};

	// console.log({ wal: wallet?.data, updateValue });
	return (
		<>
			<ModalComponents
				isOpen={isOpen ? true : false}
				back={back}
				title="Monnify checkout process">
				<form onSubmit={handleSubmit}>
					<div className="mb-3">
						<label htmlFor="value">Amount</label>
						<input
							type={"number"}
							placeholder="50000"
							className="form-control py-3 rounded10"
							value={amount}
							onChange={e => setAmount(e.target.value)}
						/>
					</div>
					<Buttons
						title={"fund"}
						css="btn-primary1 text-capitalize py-3 w-50 my-4 mx-auto"
						width={"w-50"}
						style={{ borderRadius: "30px" }}
						loading={loading}
						onClick={() => handleSubmit()}
					/>
				</form>
			</ModalComponents>
		</>
	);
};

export const MakeCardsBudpay = ({ isOpen, back, back2 }) => {
	const { returnErrors, usecase, nairaSignNeutral } = useContext(GlobalState);

	let [amount, setAmount] = useState(""),
		[paymentData, setPaymentData] = useState(null);

	useEffect(() => {
		if (paymentData) back2();
		setPaymentData(null);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [paymentData]);

	let [loading, setLoading] = useState(false),
		handleSubmit = async e => {
			e?.preventDefault();
			if (Number(amount) <= 0)
				return returnErrors({
					error: [
						{
							msg: `Amount cannot be less than or equal to ${nairaSignNeutral} 0`,
							param: "amount",
						},
					],
				});
			if (Number(amount) < Number(usecase?.usecase?.cardFundingMini))
				return returnErrors({
					error: [
						{
							msg: `Amount cannot be less than ${nairaSignNeutral} ${Number(
								usecase?.usecase?.cardFundingMini
							)}`,
							param: "amount",
						},
					],
				});
			if (Number(amount) > Number(usecase?.usecase?.cardFundingMax))
				return returnErrors({
					error: [
						{
							msg: `Amount cannot be more than ${nairaSignNeutral} ${Number(
								usecase?.usecase?.cardFundingMax
							)}`,
							param: "amount",
						},
					],
				});
			// console.log({ payment_data });
			try {
				setLoading(true);
				var resp = await axios.put(`/api/v1/wallet/manage-budpay`, {
					amount,
				});
				setPaymentData(resp?.data?.data);
				setLoading(false);
				window.open(resp?.data?.data?.authorization_url, "_blank");
			} catch (err) {
				setLoading(false);
				console.log({ err });
				let error = err.response?.data?.error;
				if (error) {
					returnErrors({ error, status: err?.response?.status });
				}
				if (err?.response?.status === 429) toast.error(err?.response?.data);
			}
		};

	// console.log({ wal: wallet?.data, updateValue });
	return (
		<>
			<ModalComponents
				isOpen={isOpen ? true : false}
				back={back}
				title="Budpay checkout process">
				<form onSubmit={handleSubmit}>
					<div className="mb-3">
						<label htmlFor="value">Amount</label>
						<input
							type={"number"}
							placeholder="50000"
							className="form-control py-3 rounded10"
							value={amount}
							onChange={e => setAmount(e.target.value)}
						/>
					</div>
					<Buttons
						title={"fund"}
						css="btn-primary1 text-capitalize py-3 w-50 my-4 mx-auto"
						width={"w-50"}
						style={{ borderRadius: "30px" }}
						loading={loading}
						onClick={() => handleSubmit()}
					/>
				</form>
			</ModalComponents>
		</>
	);
};

// export const MakeCardsMonnify = ({ isOpen, back, back2 }) => {
// 	const {
// 		wallet,
// 		returnErrors,
// 		usecase,
// 		auth,
// 		manageFundWalletFlutterwave,
// 		nairaSignNeutral,
// 	} = useContext(GlobalState);

// 	let [payment_data, setPayment] = useState(null);

// 	let close = () => {
// 		console.log("Closed");
// 	};
// 	let onComplete = response => {
// 		console.log(response);
// 		setPayment(response);
// 	};
// 	let [amount, setAmount] = useState(""),
// 		[reference, setReference] = useState(),
// 		config = {
// 			apiKey: process.env.REACT_APP_MONNIFY_API_KEY,
// 			contractCode: process.env.REACT_APP_MONNIFY_CONTRACT_CODE,
// 			reference,
// 			amount,
// 			currency: "NGN",
// 			payment_options: "card",
// 			customerEmail: auth?.user?.email,
// 			customerMobileNumber: auth?.user?.telephone,
// 			customerFullName: `${auth?.user?.firstName} ${auth?.user?.lastName}`,
// 			paymentDescription:
// 				process.env.REACT_APP_AGENT_NAME +
// 				" Wallet Funding" +
// 				"Card wallet funding",
// 			isTestMode: process.env.NODE_ENV === "development",
// 			onComplete: onComplete,
// 			onClose: close,
// 		},
// 		handleMonnifyPayment = useMonnifyPayment(config);

// 	useEffect(() => {
// 		if (reference) {
// 			handleMonnifyPayment(onComplete, close);
// 		}
// 		// eslint-disable-next-line react-hooks/exhaustive-deps
// 	}, [reference]);

// 	useEffect(() => {
// 		if (payment_data) {
// 			let sendBackend = async () => {
// 				setLoading(true);
// 				await manageFundWalletFlutterwave(
// 					payment_data?.status === "SUCCESS"
// 						? payment_data
// 						: {
// 								...payment_data,
// 								transactionReference: payment_data?.paymentReference,
// 						  },
// 					"monnify"
// 				);
// 				setLoading(false);
// 				setSubmit(true);
// 			};

// 			sendBackend();
// 		}
// 		// eslint-disable-next-line react-hooks/exhaustive-deps
// 	}, [payment_data]);

// 	let [loading, setLoading] = useState(false),
// 		[submit, setSubmit] = useState(false),
// 		handleSubmit = async e => {
// 			e?.preventDefault();
// 			if (Number(amount) <= 0)
// 				return returnErrors({
// 					error: [
// 						{
// 							msg: `Amount cannot be less than or equal to ${nairaSignNeutral} 0`,
// 							param: "amount",
// 						},
// 					],
// 				});
// 			if (Number(amount) < Number(usecase?.usecase?.cardFundingMini))
// 				return returnErrors({
// 					error: [
// 						{
// 							msg: `Amount cannot be less than ${nairaSignNeutral} ${Number(
// 								usecase?.usecase?.cardFundingMini
// 							)}`,
// 							param: "amount",
// 						},
// 					],
// 				});
// 			if (Number(amount) > Number(usecase?.usecase?.cardFundingMax))
// 				return returnErrors({
// 					error: [
// 						{
// 							msg: `Amount cannot be more than ${nairaSignNeutral} ${Number(
// 								usecase?.usecase?.cardFundingMax
// 							)}`,
// 							param: "amount",
// 						},
// 					],
// 				});
// 			if (!process.env.REACT_APP_MONNIFY_API_KEY)
// 				return returnErrors({
// 					error: [
// 						{
// 							msg: `Your request could not be processed at the moment, please try again later`,
// 							param: "flutterwave",
// 						},
// 					],
// 				});
// 			// console.log({ payment_data });
// 			try {
// 				setLoading(true);
// 				var resp = await axios.get(
// 					`/api/v1/wallet/generate-wallet-reference?amount=${amount}`
// 				);
// 				// console.log({ resp: resp?.data });
// 				setReference(resp?.data?.data);
// 				setLoading(false);
// 			} catch (err) {
// 				setLoading(false);
// 				console.log({ err });
// 				let error = err.response?.data?.error;
// 				if (error) {
// 					returnErrors({ error, status: err?.response?.status });
// 				}
// 				if (err?.response?.status === 429) toast.error(err?.response?.data);
// 			}
// 		};

// 	useEffect(() => {
// 		if (submit && wallet?.isFunded) {
// 			back2();
// 			setSubmit(false);
// 			setReference("");
// 			setPayment(null);
// 		}
// 		// eslint-disable-next-line react-hooks/exhaustive-deps
// 	}, [submit, wallet?.isFunded]);

// 	// console.log({ wal: wallet?.data, updateValue });
// 	return (
// 		<>
// 			<ModalComponents
// 				isOpen={isOpen ? true : false}
// 				back={back}
// 				title="Monnify checkout process">
// 				{/* <p>
//           <span className="tw-font-bold tw-capitalize tw-text-xl">charges:</span> 1.5%
//         </p>
//         {amount && (
//           <p>
//             <span className="tw-font-bold tw-text-xl">Amount settled to you:</span> N{amount - amount * 0.015}
//           </p>
//         )} */}

// 				<form>
// 					<div className="mb-3">
// 						<label htmlFor="value">Amount</label>
// 						<input
// 							type={"number"}
// 							placeholder="50000"
// 							className="form-control py-3 rounded10"
// 							value={amount}
// 							onChange={e => setAmount(e.target.value)}
// 						/>
// 					</div>

// 					<Buttons
// 						title={"Pay"}
// 						css="btn-primary1 text-capitalize py-3 w-50 my-4 mx-auto"
// 						width={"w-50"}
// 						style={{ borderRadius: "30px" }}
// 						loading={loading}
// 						onClick={() => handleSubmit()}
// 					/>
// 				</form>
// 			</ModalComponents>
// 		</>
// 	);
// };

export const MakeCardsPaystack = ({ isOpen, back, back2, apiKey }) => {
	const {
		wallet,
		returnErrors,
		usecase,
		auth,
		manageFundWalletPaystack,
		nairaSignNeutral,
	} = useContext(GlobalState);

	let [amount, setAmount] = useState(""),
		[reference, setReference] = useState(Date.now()),
		config = {
			email: auth?.user?.email,
			amount: Number(amount * 100),
			publicKey: apiKey,
			metadata: {
				name: `${auth?.user?.firstName} ${auth?.user?.lastName}`,
				phone: auth?.user?.telephone,
			},
			reference: reference ? reference?.toString()?.split("|")?.join("") : "",
		},
		initializePayment = usePaystackPayment(config);

	let handleSuccess = async ref => {
		setLoading(true);
		await manageFundWalletPaystack(ref);
		setLoading(false);
		setSubmit(true);
	};

	// you can call this function anything
	const onClose = () => {
		// implementation for  whatever you want to do when the Paystack dialog closed.
		console.log("closed");
	};

	const onSuccess = ref => {
		// console.log({ ref });
		handleSuccess(ref);
	};

	useEffect(() => {
		if (reference) {
			initializePayment(onSuccess, onClose);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [reference]);

	let [loading, setLoading] = useState(false),
		[submit, setSubmit] = useState(false),
		handleSubmit = async e => {
			e?.preventDefault();
			if (Number(amount) <= 0)
				return returnErrors({
					error: [
						{
							msg: `Amount cannot be less than or equal to ${nairaSignNeutral} 0`,
							param: "amount",
						},
					],
				});
			if (Number(amount) < Number(usecase?.usecase?.cardFundingMini))
				return returnErrors({
					error: [
						{
							msg: `Amount cannot be less than ${nairaSignNeutral} ${Number(
								usecase?.usecase?.cardFundingMini
							)}`,
							param: "amount",
						},
					],
				});
			if (Number(amount) > Number(usecase?.usecase?.cardFundingMax))
				return returnErrors({
					error: [
						{
							msg: `Amount cannot be more than ${nairaSignNeutral} ${Number(
								usecase?.usecase?.cardFundingMax
							)}`,
							param: "amount",
						},
					],
				});
			if (!apiKey)
				return returnErrors({
					error: [
						{
							msg: `Your request could not be processed at the moment, please try again later`,
							param: "paystack",
						},
					],
				});
			// console.log({ payment_data });
			try {
				setLoading(true);
				var resp = await axios.get(`/api/v2/wallet/generate-wallet-reference`);
				// console.log({ resp: resp?.data });
				setReference(resp?.data?.data);
				setLoading(false);
			} catch (err) {
				setLoading(false);
				console.log({ err });
				let error = err.response?.data?.error;
				if (error) {
					returnErrors({ error, status: err?.response?.status });
				}
				if (err?.response?.status === 429) toast.error(err?.response?.data);
			}
		};

	useEffect(() => {
		if (submit && wallet?.isFunded) {
			back2();
			setSubmit(false);
			setReference("");
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [submit, wallet?.isFunded]);

	return (
		<>
			<ModalComponents
				isOpen={isOpen ? true : false}
				back={back}
				title="Paystack checkout process">
				<form>
					<div className="mb-3">
						<label htmlFor="value">Amount</label>
						<input
							type={"number"}
							placeholder="50000"
							className="form-control py-3 rounded10"
							value={amount}
							onChange={e => setAmount(e.target.value)}
						/>
					</div>
					<Buttons
						title={"fund"}
						css="btn-primary1 text-capitalize py-3 w-50 my-4 mx-auto"
						width={"w-50"}
						style={{ borderRadius: "30px" }}
						loading={loading}
						onClick={() => handleSubmit()}
					/>
				</form>
			</ModalComponents>
		</>
	);
};

const MakeWithdraw = ({ isOpen, back }) => {
	return (
		<>
			<ModalComponents isOpen={isOpen} back={back} title="Choose card">
				<form>
					<CardList />
					<Buttons
						title={"withdraw"}
						css="btn-primary1 text-capitalize py-3 w-50 my-4 mx-auto"
						width={"w-50"}
						style={{ borderRadius: "30px" }}
					/>
				</form>
			</ModalComponents>
		</>
	);
};

const MakeVirtual = ({ isOpen, back }) => {
	const { wallet, generateVirtual, usecase } = useContext(GlobalState);
	let [loading, setLoading] = useState(false),
		ableToGenerateBudpay = false,
		ableToGeneratePayvessel = false,
		ableToGeneratePaymentpoint = false,
		ableToGenerateBillstack = false,
		ableToGeneratePalmpay = false;

	if (process.env.REACT_APP_PAYMENT_GATEWAY) {
		let values = process.env.REACT_APP_PAYMENT_GATEWAY;
		values = values?.split(",")?.map(it => it?.trim());
		if (values?.includes("budpay")) ableToGenerateBudpay = true;
		if (values?.includes("payvessel")) ableToGeneratePayvessel = true;
		if (values?.includes("paymentpoint")) ableToGeneratePaymentpoint = true;
		if (values?.includes("billstack")) ableToGenerateBillstack = true;
		if (values?.includes("palmpay")) ableToGeneratePalmpay = true;
	}

	return (
		<>
			<ModalComponents isOpen={isOpen} back={back} title="virtual accounts">
				<form>
					{usecase?.usecase?.fundWalletMonnify === "enable" && (
						<>
							{wallet?.balance?.monnifyAccount ? (
								<div>
									{wallet?.balance?.monnifyAccount?.accounts?.map((it, i) => (
										<div
											key={i}
											className="my-3 d-flex align-items-center rounded10 bg-light p-3">
											<div className="d-flex me-2">
												<div
													className="p-3 d-flex rounded10 align-items-center justify-content-center"
													style={{
														background: `${colorArr[i % colorArr.length]}`,
													}}>
													<RiShieldStarFill
														size={24}
														color={`${
															colorArr[i % colorArr.length] === "#000000"
																? "#fff"
																: "#000"
														}`}
													/>
												</div>
											</div>
											<div>
												<h6 className="fw-bold text-muted">{it?.bankName}</h6>
												<h6 className="fw-bold force-d-flex">
													{it?.accountNumber}{" "}
													<BiCopy
														size={20}
														className="ms-3 myCursor"
														onClick={() => {
															navigator.clipboard
																.writeText(it?.accountNumber)
																.then(
																	() => {
																		toast.info("Copied", { autoClose: 2000 });
																	},
																	err => {
																		toast.warn(`Could not copy: ${err}`, {
																			autoClose: 2000,
																		});
																	}
																);
														}}
													/>{" "}
												</h6>
											</div>
										</div>
									))}
								</div>
							) : (
								<Buttons
									title={"generate account"}
									css="btn-primary1 text-capitalize py-3 w-50 my-4 mx-auto"
									width={"w-50"}
									onClick={async () => {
										setLoading("monnify");
										await generateVirtual();
										setLoading(false);
									}}
									style={{ borderRadius: "30px" }}
									loading={loading === "monnify"}
								/>
							)}
						</>
					)}
					{(["KEMTECH ENTERPRISES"]?.includes(process.env.REACT_APP_NAME) ||
						ableToGenerateBudpay) &&
						usecase?.usecase?.fundWalletBudpay === "enable" && (
							<>
								{wallet?.balance?.budpayAccount ? (
									<>
										<h3 className="Lexend">
											{["KEMTECH ENTERPRISES"]?.includes(
												process.env.REACT_APP_NAME
											)
												? process.env.REACT_APP_NAME
												: "Budpay"}{" "}
											Linked Account
										</h3>
										<div className="my-3 d-flex align-items-center rounded10 bg-light p-3">
											<div className="d-flex me-2">
												<div
													className="p-3 d-flex rounded10 align-items-center justify-content-center"
													style={{
														background: `${colorArr[colorArr.length - 1]}`,
													}}>
													<RiShieldStarFill
														size={24}
														color={`${
															colorArr[colorArr.length - 1] === "#000000"
																? "#fff"
																: "#000"
														}`}
													/>
												</div>
											</div>
											<div>
												<h6 className="fw-bold text-muted">
													{wallet?.balance?.budpayAccount?.provider
														?.bank_name ||
														wallet?.balance?.budpayAccount?.bank?.name}
												</h6>
												<h6 className="fw-bold force-d-flex">
													{wallet?.balance?.budpayAccount?.dedicated_account
														?.account_number ||
														wallet?.balance?.budpayAccount?.account_number}{" "}
													<BiCopy
														size={20}
														className="ms-3 myCursor"
														onClick={() => {
															navigator.clipboard
																.writeText(
																	wallet?.balance?.budpayAccount
																		?.dedicated_account?.account_number ||
																		wallet?.balance?.budpayAccount
																			?.account_number
																)
																.then(
																	() => {
																		toast.info("Copied", { autoClose: 2000 });
																	},
																	err => {
																		toast.warn(`Could not copy: ${err}`, {
																			autoClose: 2000,
																		});
																	}
																);
														}}
													/>{" "}
												</h6>
											</div>
										</div>
									</>
								) : (
									<Buttons
										title={`generate ${
											["KEMTECH ENTERPRISES"]?.includes(
												process.env.REACT_APP_NAME
											)
												? process.env.REACT_APP_NAME
												: "Budpay"
										} Linked Account`}
										css="btn-primary1 text-capitalize py-3 w-50 my-4 mx-auto"
										width={"w-50"}
										onClick={async () => {
											setLoading("manage-budpay");
											await generateVirtual("manage-budpay");
											setLoading(false);
										}}
										style={{ borderRadius: "30px" }}
										loading={loading === "manage-budpay"}
									/>
								)}
							</>
						)}
					{(["Durable Telecommunications"]?.includes(
						process.env.REACT_APP_NAME
					) ||
						ableToGeneratePaymentpoint) &&
						usecase?.usecase?.fundWalletPaymentpoint === "enable" && (
							<>
								{wallet?.balance?.paymentpointAccount ? (
									<>
										<h3 className="Lexend">Paymentpoint Linked Account</h3>
										<div>
											{wallet?.balance?.paymentpointAccount?.bankAccounts?.map(
												(it, i) => (
													<div
														key={i}
														className="my-3 d-flex align-items-center rounded10 bg-light p-3">
														<div className="d-flex me-2">
															<div
																className="p-3 d-flex rounded10 align-items-center justify-content-center"
																style={{
																	background: `${
																		colorArr[i % colorArr.length]
																	}`,
																}}>
																<RiShieldStarFill
																	size={24}
																	color={`${
																		colorArr[i % colorArr.length] === "#000000"
																			? "#fff"
																			: "#000"
																	}`}
																/>
															</div>
														</div>
														<div>
															<h6 className="fw-bold text-muted">
																{it?.bankName}
															</h6>
															<h6 className="fw-bold force-d-flex">
																{it?.accountNumber}{" "}
																<BiCopy
																	size={20}
																	className="ms-3 myCursor"
																	onClick={() => {
																		navigator.clipboard
																			.writeText(it?.accountNumber)
																			.then(
																				() => {
																					toast.info("Copied", {
																						autoClose: 2000,
																					});
																				},
																				err => {
																					toast.warn(`Could not copy: ${err}`, {
																						autoClose: 2000,
																					});
																				}
																			);
																	}}
																/>{" "}
															</h6>
														</div>
													</div>
												)
											)}
										</div>
									</>
								) : (
									<Buttons
										title={`generate paymentpoint Linked Account`}
										css="btn-primary1 text-capitalize py-3 w-50 my-4 mx-auto"
										width={"w-50"}
										onClick={async () => {
											setLoading("manage-paymentpoint");
											await generateVirtual("manage-paymentpoint");
											setLoading(false);
										}}
										style={{ borderRadius: "30px" }}
										loading={loading === "manage-paymentpoint"}
									/>
								)}
							</>
						)}
					{(["Durable Telecommunications"]?.includes(
						process.env.REACT_APP_NAME
					) ||
						ableToGeneratePayvessel) &&
						usecase?.usecase?.fundWalletPayvessel === "enable" && (
							<>
								{wallet?.balance?.payvesselAccount ? (
									<>
										<h3 className="Lexend">Payvessel Linked Account</h3>
										<div>
											{wallet?.balance?.payvesselAccount?.banks?.map(
												(it, i) => (
													<div
														key={i}
														className="my-3 d-flex align-items-center rounded10 bg-light p-3">
														<div className="d-flex me-2">
															<div
																className="p-3 d-flex rounded10 align-items-center justify-content-center"
																style={{
																	background: `${
																		colorArr[i % colorArr.length]
																	}`,
																}}>
																<RiShieldStarFill
																	size={24}
																	color={`${
																		colorArr[i % colorArr.length] === "#000000"
																			? "#fff"
																			: "#000"
																	}`}
																/>
															</div>
														</div>
														<div>
															<h6 className="fw-bold text-muted">
																{it?.bankName}
															</h6>
															<h6 className="fw-bold force-d-flex">
																{it?.accountNumber}{" "}
																<BiCopy
																	size={20}
																	className="ms-3 myCursor"
																	onClick={() => {
																		navigator.clipboard
																			.writeText(it?.accountNumber)
																			.then(
																				() => {
																					toast.info("Copied", {
																						autoClose: 2000,
																					});
																				},
																				err => {
																					toast.warn(`Could not copy: ${err}`, {
																						autoClose: 2000,
																					});
																				}
																			);
																	}}
																/>{" "}
															</h6>
														</div>
													</div>
												)
											)}
										</div>
									</>
								) : (
									<Buttons
										title={`generate payvessel Linked Account`}
										css="btn-primary1 text-capitalize py-3 w-50 my-4 mx-auto"
										width={"w-50"}
										onClick={async () => {
											setLoading("manage-payvessel");
											await generateVirtual("manage-payvessel");
											setLoading(false);
										}}
										style={{ borderRadius: "30px" }}
										loading={loading === "manage-payvessel"}
									/>
								)}
							</>
						)}
					{(["Vickybest Telecom", "Durable Telecommunications"]?.includes(
						process.env.REACT_APP_NAME
					) ||
						ableToGenerateBillstack) && (
						<>
							{usecase?.usecase?.fundWalletBillStack === "enable" && (
								<>
									{wallet?.balance?.billstackAccount ? (
										<>
											<h3 className="Lexend">BillStack Linked Account</h3>
											<div>
												{wallet?.balance?.billstackAccount?.account?.map(
													(it, i) => (
														<div
															key={i}
															className="my-3 d-flex align-items-center rounded10 bg-light p-3">
															<div className="d-flex me-2">
																<div
																	className="p-3 d-flex rounded10 align-items-center justify-content-center"
																	style={{
																		background: `${
																			colorArr[i % colorArr.length]
																		}`,
																	}}>
																	<RiShieldStarFill
																		size={24}
																		color={`${
																			colorArr[i % colorArr.length] ===
																			"#000000"
																				? "#fff"
																				: "#000"
																		}`}
																	/>
																</div>
															</div>
															<div>
																<h6 className="fw-bold text-muted">
																	{it?.bank_name}
																</h6>
																<h6 className="fw-bold force-d-flex">
																	{it?.account_number}{" "}
																	<BiCopy
																		size={20}
																		className="ms-3 myCursor"
																		onClick={() => {
																			navigator.clipboard
																				.writeText(it?.account_number)
																				.then(
																					() => {
																						toast.info("Copied", {
																							autoClose: 2000,
																						});
																					},
																					err => {
																						toast.warn(
																							`Could not copy: ${err}`,
																							{
																								autoClose: 2000,
																							}
																						);
																					}
																				);
																		}}
																	/>{" "}
																</h6>
															</div>
														</div>
													)
												)}
											</div>
										</>
									) : (
										<Buttons
											title={`generate billstack Linked Account`}
											css="btn-primary1 text-capitalize py-3 w-50 my-4 mx-auto"
											width={"w-50"}
											onClick={async () => {
												setLoading("manage-billstack");
												await generateVirtual("manage-billstack");
												setLoading(false);
											}}
											style={{ borderRadius: "30px" }}
											loading={loading === "manage-billstack"}
										/>
									)}
									{/* <Buttons
										title={`generate billstack Linked Account`}
										css="btn-primary1 text-capitalize py-3 w-50 my-4 mx-auto"
										width={"w-50"}
										onClick={async () => {
											setLoading("manage-billstack");
											await generateVirtual("manage-billstack");
											setLoading(false);
										}}
										style={{ borderRadius: "30px" }}
										loading={loading === "manage-billstack"}
									/> */}
								</>
							)}
						</>
					)}
					{([
						// "Vickybest Telecom",
						"Kemtech Enterprises",
						"KEMTECH ENTERPRISES",
					]?.includes(process.env.REACT_APP_NAME) ||
						ableToGeneratePalmpay) && (
						<>
							{usecase?.usecase?.fundWalletPalmpay === "enable" && (
								<>
									{wallet?.balance?.palmpayAccount ? (
										<>
											<h3 className="Lexend">Palmpay Linked Account</h3>
											<div className="my-3 d-flex align-items-center rounded10 bg-light p-3">
												<div className="d-flex me-2">
													<div
														className="p-3 d-flex rounded10 align-items-center justify-content-center"
														style={{
															background: `${colorArr[colorArr.length - 1]}`,
														}}>
														<RiShieldStarFill
															size={24}
															color={`${
																colorArr[colorArr.length - 1] === "#000000"
																	? "#fff"
																	: "#000"
															}`}
														/>
													</div>
												</div>
												<div>
													<h6 className="fw-bold text-muted">
														{wallet?.balance?.palmpayAccount?.bankName ||
															wallet?.balance?.palmpayAccount?.provider}
													</h6>
													<h6 className="fw-bold force-d-flex">
														{wallet?.balance?.palmpayAccount?.virtualAccountNo}{" "}
														<BiCopy
															size={20}
															className="ms-3 myCursor"
															onClick={() => {
																navigator.clipboard
																	.writeText(
																		wallet?.balance?.palmpayAccount
																			?.virtualAccountNo
																	)
																	.then(
																		() => {
																			toast.info("Copied", { autoClose: 2000 });
																		},
																		err => {
																			toast.warn(`Could not copy: ${err}`, {
																				autoClose: 2000,
																			});
																		}
																	);
															}}
														/>{" "}
													</h6>
												</div>
											</div>
										</>
									) : (
										<Buttons
											title={`generate Palmpay Linked Account`}
											css="btn-primary1 text-capitalize py-3 w-50 my-4 mx-auto"
											width={"w-50"}
											onClick={async () => {
												setLoading("manage-palmpay");
												await generateVirtual("manage-palmpay");
												setLoading(false);
											}}
											style={{ borderRadius: "30px" }}
											loading={loading === "manage-palmpay"}
										/>
									)}
								</>
							)}
						</>
					)}
				</form>
			</ModalComponents>
		</>
	);
};

const ManualAccounts = ({ isOpen, back }) => {
	const { stat } = useContext(GlobalState);

	return (
		<>
			<ModalComponents isOpen={isOpen} back={back} title="manual accounts">
				<form>
					{stat?.banks ? (
						<div>
							{stat?.banks?.map((it, i) => (
								<div
									key={i}
									className="my-3 d-flex align-items-center rounded10 bg-light p-3">
									<div className="d-flex me-2">
										<div
											className="p-3 d-flex rounded10 align-items-center justify-content-center"
											style={{
												background: `${colorArr[i % colorArr.length]}`,
											}}>
											<RiShieldStarFill
												size={24}
												color={`${
													colorArr[i % colorArr.length] === "#000000"
														? "#fff"
														: "#000"
												}`}
											/>
										</div>
									</div>
									<div>
										<h6 className="fw-bold text-muted">{it?.bank_name}</h6>
										<h6 className="fw-bold text-muted">{it?.account_name}</h6>
										<h6 className="fw-bold force-d-flex">
											{it?.account_number}{" "}
											<BiCopy
												size={20}
												className="ms-3 myCursor"
												onClick={() => {
													navigator.clipboard
														.writeText(it?.account_number)
														.then(
															() => {
																toast.info("Copied", { autoClose: 2000 });
															},
															err => {
																toast.warn(`Could not copy: ${err}`, {
																	autoClose: 2000,
																});
															}
														);
												}}
											/>{" "}
										</h6>
									</div>
								</div>
							))}
						</div>
					) : null}
				</form>
			</ModalComponents>
		</>
	);
};

// const MakeTransfer = ({ isOpen, back }) => {
//   let { manageWallet, wallet, returnErrors, nairaSignNeutral } =
//     useContext(GlobalState);

//   let init = {
//       type: "wallet",
//       user: "",
//       amount: "",
//     },
//     [state, setState] = useState(init),
//     [loading, setLoading] = useState(false),
//     [submit, setSubmit] = useState(false),
//     textChange =
//       (name) =>
//       ({ target: { value } }) => {
//         setState({ ...state, [name]: value });
//       },
//     handleSubmit = async (e) => {
//       e?.preventDefault();
//       if (Number(state?.amount) <= 0)
//         return returnErrors({
//           error: [
//             {
//               msg: `Amount cannot be less than or equal to ${nairaSignNeutral} 0`,
//               param: "amount",
//             },
//           ],
//         });
//       setLoading(true);
//       await manageWallet("wallet", state);
//       setLoading(false);
//       setSubmit(true);
//     };

//   useEffect(() => {
//     if (wallet?.isTransfer && submit) {
//       back();
//       setSubmit(false);
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [wallet?.isTransfer, submit]);

//   return (
//     <>
//       <ModalComponents isOpen={isOpen} back={back} title="Transfer">
//         <WalletForm state={state} textChange={textChange} />
//         <Buttons
//           title={"transfer"}
//           css="btn-primary1 text-capitalize py-3 w-50 my-4 mx-auto"
//           width={"w-50"}
//           style={{ borderRadius: "30px" }}
//           loading={loading}
//           onClick={handleSubmit}
//         />
//       </ModalComponents>
//     </>
//   );
// };

const MakeTransfer = ({ isOpen, back }) => {
	let { manageWallet, wallet, returnErrors, nairaSignNeutral } =
		useContext(GlobalState);

	let init = {
			type: "wallet",
			user: "",
			amount: "",
			pin: "",
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
			e?.preventDefault();
			if (Number(state?.amount) <= 0)
				return returnErrors({
					error: [
						{
							msg: `Amount cannot be less than or equal to ${nairaSignNeutral} 0`,
							param: "amount",
						},
					],
				});
			setLoading(true);
			await manageWallet("wallet", state);
			setLoading(false);
			setSubmit(true);
		},
		[active, setActive] = useState(0);

	useEffect(() => {
		if (wallet?.isTransfer && submit) {
			back();
			setSubmit(false);
			setState(init);
			setActive(0);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [wallet?.isTransfer, submit]);

	useEffect(() => {
		if (state?.pin && state?.pin?.length === 4) handleSubmit();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [state?.pin]);

	return (
		<>
			<ModalComponents isOpen={isOpen} back={back} title="Transfer">
				{active === 1 ? (
					<>
						<TransactionPinBox
							state={state}
							setState={setState}
							handleSubmit={handleSubmit}
							loading={loading}
							title={"transfer"}
						/>
					</>
				) : (
					<>
						<WalletForm
							state={state}
							textChange={textChange}
							setState={setState}
						/>
						<Buttons
							title={"transfer"}
							css="btn-primary1 text-capitalize py-3 w-50 my-4 mx-auto"
							width={"w-50"}
							style={{ borderRadius: "30px" }}
							loading={loading}
							onClick={
								wallet?.balance?.wallet_pin
									? () => {
											setActive(1);
									  }
									: handleSubmit
							}
						/>
					</>
				)}
			</ModalComponents>
		</>
	);
};

export const BonusCommission = ({ type, general }) => {
	const {
		bonus,
		commission,
		numberWithCommas,
		getWalletHistory,
		nairaSign,
		referral,
	} = useContext(GlobalState);

	let [state, setState] = useState(null);

	useEffect(() => {
		getWalletHistory(
			type === "bonus"
				? "bonus"
				: type === "referral"
				? "referral"
				: "commission",
			general ? { general: "general" } : null
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [general, type]);

	let [loading, setLoading] = useState(false);
	let handleLoadMore = async () => {
		setLoading(true);

		await getWalletHistory(
			type === "bonus"
				? "bonus"
				: type === "referral"
				? "referral"
				: "commission",
			general
				? {
						limit: Number(
							type === "bonus"
								? bonus?.paginate?.nextPage * bonus?.paginate?.limit
								: commission?.paginate?.nextPage * commission?.paginate?.limit
						),
						general: "general",
				  }
				: {
						limit: Number(
							type === "bonus"
								? bonus?.paginate?.nextPage * bonus?.paginate?.limit
								: type === "referral"
								? referral?.paginate?.nextPage * referral?.paginate?.limit
								: commission?.paginate?.nextPage * commission?.paginate?.limit
						),
				  }
		);
		setLoading(false);
	};

	useEffect(() => {
		if (type === "bonus") {
			setState(bonus?.bonus);
		} else if (type === "referral") {
			setState(referral?.referral);
		} else {
			if (general) setState(commission?.general_commission);
			else setState(commission?.commission);
		}
	}, [type, bonus, commission, general, referral]);

	let [range, setRange] = useState(10);

	const [itemOffset, setItemOffset] = useState(0);
	const endOffset = itemOffset + range;
	if (!state) return;

	const currentItems = state.slice(itemOffset, endOffset);
	const pageCount = Math.ceil(state.length / range);

	const handlePageClick = event => {
		const newOffset = (event.selected * range) % state.length;
		setItemOffset(newOffset);
	};

	return (
		<div className="py-5">
			<MainRanger setRange={setRange} range={range} />
			<div className="bland row mx-0 py-3 px-0 text-capitalize">
				<div className="col textTrunc fontReduce fw-bold Lexend d-none d-md-flex">
					date
				</div>
				<div className="col textTrunc fontReduce fw-bold Lexend d-none d-md-flex">
					Description
				</div>
				<div className="col textTrunc fontReduce fw-bold Lexend">Amount</div>
				<div className="col textTrunc fontReduce fw-bold Lexend">Balance</div>
				<div className="col textTrunc fontReduce fw-bold Lexend">
					Previous balance
				</div>
				<div className="col textTrunc fontReduce fw-bold Lexend">Type</div>
			</div>
			<div className="bland2 row mx-0">
				{currentItems?.length === 0 ? (
					<EmptyComponent subtitle={`${type} list is empty`} />
				) : (
					currentItems?.map((item, index) => (
						<div key={index} className="row mx-0 py-3 px-0">
							<div className="col textTrunc fontReduce2 my-auto d-none d-md-flex">
								{moment(item?.createdAt).format("DD/MM/YYYY h:mm A")}
							</div>
							<div className="col textTrunc fontReduce2 my-auto textTrunc textTrunc3 d-none d-md-flex">
								{item?.description}
							</div>
							<div className="col textTrunc fontReduce2 my-auto">
								{nairaSign}
								{numberWithCommas(Number(item?.amount).toFixed(2))}
							</div>
							<div className="col textTrunc fontReduce2 my-auto">
								{nairaSign}
								{numberWithCommas(Number(item?.balance).toFixed(2))}
							</div>
							<div className="col textTrunc fontReduce2 my-auto">
								{nairaSign}
								{numberWithCommas(Number(item?.prevBalance).toFixed(2))}
							</div>
							<div
								className={`col textTrunc fontReduce2 my-auto text-capitalize ${
									item?.type === "credit" ? "text-success" : "text-danger"
								}`}>
								{item?.type}
							</div>
						</div>
					))
				)}
			</div>
			<MainPaginate handlePageClick={handlePageClick} pageCount={pageCount} />
			<BottomTab
				state={state}
				paginate={
					type === "bonus"
						? bonus?.paginate
						: type === "referral"
						? referral?.paginate
						: general
						? commission?.general_paginate
						: commission?.paginate
				}
			/>
			<LoadMore
				next={
					type === "bonus"
						? bonus?.paginate?.next
						: type === "referral"
						? referral?.paginate?.next
						: general
						? commission?.general_paginate?.next
						: commission?.paginate?.next
				}
				handleLoadMore={handleLoadMore}
				loading={loading}
			/>
		</div>
	);
};

const TransferList = ({ setThisData }) => {
	const { wallet, getWalletHistory, getReload } = useContext(GlobalState);
	let [loading, setLoading] = useState(false),
		[search, setSearch] = useState(""),
		[state, setState] = useState(null);

	useEffect(() => {
		getWalletHistory("wallet");
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (search) {
			document.getElementById("Search").addEventListener("search", () => {
				getReload();
			});
			let handleSubmit = async () => {
				if (!search) return;

				await getWalletHistory("wallet", {
					search,
				});
			};
			handleSubmit();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [search]);

	useEffect(() => {
		if (wallet.isFound) {
			setState(wallet.mainSearch);
		} else setState(wallet.wallet);
	}, [wallet.wallet, wallet.isFound, wallet.mainSearch]);

	useEffect(() => {
		getReload();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	let handleLoadMore = async () => {
		setLoading(true);

		if (search) {
			await getWalletHistory("wallet", {
				limit: Number(wallet?.paginate?.nextPage * wallet?.paginate?.limit),
				search,
			});
		} else {
			await getWalletHistory("wallet", {
				limit: Number(wallet?.paginate?.nextPage * wallet?.paginate?.limit),
			});
		}
		setLoading(false);
	};

	if (!state) return <></>;

	return (
		<>
			<HistoryData
				search={search}
				setSearch={setSearch}
				setThisData={setThisData}
				state={state}
			/>
			<BottomTab
				state={state}
				paginate={search ? wallet?.search_paginate : wallet?.paginate}
			/>
			<LoadMore
				next={search ? wallet?.search_paginate?.next : wallet?.paginate?.next}
				handleLoadMore={handleLoadMore}
				loading={loading}
			/>
		</>
	);
};

let CardList = ({ bg, details, selectBg }) => {
	const { wallet } = useContext(GlobalState);

	let [state, setState] = useState(null);

	useEffect(() => {
		setState(bg ? wallet?.cards?.slice(0, 2) : wallet?.cards);
	}, [bg, wallet?.cards]);

	if (!state) return;

	return (
		<>
			<div>
				{state?.map((it, i) => (
					<div
						key={i}
						onClick={details ? () => details(it) : () => {}}
						className={`my-3 d-flex align-items-center rounded10 myCursor ${
							bg ? "" : "bg-light"
						}p-3 ${
							selectBg === it?.card_number ? "list-group-item-info" : ""
						}`}>
						<div className="d-flex me-2">
							<div
								className="p-3 d-flex rounded10 align-items-center justify-content-center"
								style={{ background: i % 2 === 0 ? "#EFEFEF" : "#34302F" }}>
								{it?.brand?.toLowerCase() === "visa" ? (
									<FaCcVisa
										size={30}
										color={i % 2 !== 0 ? "#EFEFEF" : "#34302F"}
									/>
								) : (
									<FaCcMastercard
										size={30}
										color={i % 2 !== 0 ? "#EFEFEF" : "#34302F"}
									/>
								)}
							</div>
						</div>
						<div>
							<h6 className="fw-bold text-dark">
								*
								{
									it?.card_number?.split(" ")[
										it?.card_number?.split(" ")?.length - 1
									]
								}
							</h6>
							<small className="fw-bold text-dark text-capitalize">
								{it?.brand}
							</small>
							{/* <h6 className="fw-bold">
								{it?.number}{" "}
								<BiCopy
									size={20}
									className="ms-3 myCursor"
									onClick={() => {
										navigator.clipboard.writeText(it?.number).then(
											() => {
												toast.info("Copied");
											},
											err => {
												toast.warn(`Could not copy: ${err}`);
											}
										);
									}}
								/>{" "}
							</h6> */}
						</div>
					</div>
				))}
			</div>
		</>
	);
};

export const WalletDetails = ({ thisData, setThisData }) => {
	let { numberWithCommas, auth, nairaSign } = useContext(GlobalState);
	return (
		<>
			<ModalComponents
				isOpen={thisData ? true : false}
				toggle={() => setThisData(false)}
				title="Wallet details">
				<div className="downH2 d-flex flex-column">
					<p className="text-capitalize border-bottom d-flex justify-content-between">
						<span>Id: </span>
						<span className="fontInherit Lexend">{thisData?.item_id}</span>{" "}
					</p>
					<p className="text-capitalize border-bottom d-flex justify-content-between">
						<span>type: </span>
						<span
							className={`fontInherit Lexend ${
								thisData?.type === "credit"
									? "text-success2 text-success-2 text-success"
									: "text-danger2"
							}`}>
							{thisData?.type}
						</span>{" "}
					</p>
					<p className="text-capitalize border-bottom d-flex justify-content-between">
						<span>date: </span>
						<span className="fontInherit Lexend">
							{moment(thisData?.createdAt).format("DD/MM/YYYY h:mm A")}
						</span>{" "}
					</p>
					{auth?.user?.isAdmin && (
						<p className="border-bottom d-flex justify-content-between">
							<span className="text-capitalize">User: </span>
							<span>
								<span className="fontInherit Lexend d-block text-capitalize">
									{thisData?.user?.lastName} {thisData?.user?.firstName}
								</span>{" "}
								<span className="fontInherit Lexend d-block">
									{thisData?.user?.telephone}
								</span>{" "}
								<span className="fontInherit Lexend d-block">
									{thisData?.user?.email}
								</span>{" "}
							</span>
						</p>
					)}
					<p className="text-capitalize border-bottom d-flex justify-content-between">
						<span>Amount: </span>
						<span className="fontInherit Lexend">
							{nairaSign}{" "}
							{thisData?.amount
								? numberWithCommas(Number(thisData?.amount).toFixed(2))
								: 0}
						</span>{" "}
					</p>
					<p className="text-capitalize border-bottom d-flex justify-content-between">
						<span>{thisData?.status ? "Previous " : "Initial "} Balance: </span>
						<span className="fontInherit Lexend">
							{nairaSign}{" "}
							{thisData?.prevBalance
								? numberWithCommas(Number(thisData?.prevBalance).toFixed(2))
								: 0}
						</span>{" "}
					</p>
					<p className="text-capitalize border-bottom d-flex justify-content-between">
						<span>{thisData?.status ? "Current " : "Expected "}Balance: </span>
						<span className="fontInherit Lexend">
							{nairaSign}{" "}
							{thisData?.balance
								? numberWithCommas(Number(thisData?.balance).toFixed(2))
								: 0}
						</span>{" "}
					</p>
					<p className="text-capitalize border-bottom d-flex justify-content-between">
						<span>Description: </span>
						<span className="fontInherit Lexend">
							{thisData?.description}
						</span>{" "}
					</p>
					<p className="text-capitalize border-bottom d-flex justify-content-between">
						<span>Status: </span>
						<span
							className={`fontInherit Lexend ${
								thisData?.status
									? "text-success2 text-success-2 text-success"
									: "text-danger2"
							}`}>
							{thisData?.statusText}
						</span>{" "}
					</p>
				</div>
			</ModalComponents>
		</>
	);
};

export const HistoryData = ({ state, search, setSearch, setThisData }) => {
	const { numberWithCommas, nairaSign } = useContext(GlobalState);

	let [range, setRange] = useState(10);

	const [itemOffset, setItemOffset] = useState(0);
	const endOffset = itemOffset + range;
	if (!state) return;

	const currentItems = state.slice(itemOffset, endOffset);
	const pageCount = Math.ceil(state.length / range);

	const handlePageClick = event => {
		const newOffset = (event.selected * range) % state.length;
		setItemOffset(newOffset);
	};
	return (
		<>
			<div className="w-50 w50 mb-3">
				<input
					type="search"
					name="search"
					id="Search"
					className="form-control w-100 py-3 borderColor2"
					placeholder="Type here to search"
					value={search}
					onChange={e => setSearch(e.target.value)}
				/>
			</div>
			<MainRanger setRange={setRange} range={range} />
			<div className="bland row mx-0 py-3 px-0 text-capitalize">
				<div className="col textTrunc fontReduce fw-bold Lexend">S/N</div>
				<div className="col textTrunc fontReduce fw-bold Lexend d-none d-md-flex"></div>
				<div className="col textTrunc fontReduce fw-bold Lexend">
					Description
				</div>
				<div className="col textTrunc fontReduce fw-bold Lexend">Amount</div>
				<div className="col textTrunc fontReduce fw-bold Lexend">
					Previous balance
				</div>
				<div className="col textTrunc fontReduce fw-bold Lexend">Balance</div>
				<div className="col textTrunc fontReduce fw-bold Lexend">date</div>
				<div className="col d-none d-md-flex"></div>
			</div>
			{currentItems?.length === 0 ? (
				<EmptyComponent subtitle={"Wallet is empty"} />
			) : (
				currentItems?.map((it, i) => (
					<div
						onClick={() => setThisData(it)}
						key={i}
						className="row mx-0 py-3 border-bottom myCursor">
						<div className="col my-auto text-capitalize fontReduce2 textTrunc py-3 py-md-4">
							{i + 1}
						</div>
						<div className="col d-none d-md-flex fontReduce2">
							<div className="d-flex">
								<div
									className="p-3 d-flex rounded10 align-items-center justify-content-center"
									style={{ background: `${colorArr[i % colorArr?.length]}` }}>
									<RiShieldStarFill
										size={24}
										color={`${
											colorArr[i % colorArr?.length] === "#000000"
												? "#fff"
												: "#000"
										}`}
									/>
								</div>
							</div>
						</div>
						<div className="col my-auto text-capitalize textTrunc textTrunc2 fw-md-bold fontReduce2">
							{it?.description}
						</div>
						<div className="col my-auto fontReduce2 d-flex w-100">
							<span className="fontInherit d-none d-md-flex me-md-1">
								{nairaSign}
							</span>{" "}
							{it?.amount ? numberWithCommas(Number(it?.amount).toFixed(2)) : 0}
						</div>
						<div className="col my-auto fontReduce2 d-flex w-100">
							<span className="fontInherit d-none d-md-flex me-md-1">
								{nairaSign}
							</span>{" "}
							{it?.prevBalance
								? numberWithCommas(Number(it?.prevBalance).toFixed(2))
								: 0}
						</div>
						<div className="col my-auto fontReduce2 d-flex w-100">
							<span className="fontInherit d-none d-md-flex me-md-1">
								{nairaSign}
							</span>{" "}
							{it?.balance
								? numberWithCommas(Number(it?.balance).toFixed(2))
								: 0}
						</div>
						<div className="col my-auto fontReduce2">
							{moment(it?.createdAt).format("DD/MM/YYYY h:mm A")}
						</div>
						<div className="col my-auto d-none d-md-flex fontReduce2">
							<div className="d-flex">
								<div
									className={`p-3 d-flex rounded10 align-items-center justify-content-center shadow2 myCursor horizHover ${
										it?.type === "credit"
											? "list-group-item-success"
											: "list-group-item-danger"
									}`}>
									<BiDotsHorizontalRounded size={24} />
								</div>
							</div>
						</div>
					</div>
				))
			)}
			<MainPaginate handlePageClick={handlePageClick} pageCount={pageCount} />
		</>
	);
};

export const MakeWallet = ({ isOpen, back, user, debit = false }) => {
	let { manageWallet, wallet, manualDirectDebit } = useContext(GlobalState);

	let init = {
			type: "wallet",
			user: user ? user : "",
			amount: "",
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
			e?.preventDefault();
			setLoading(true);
			if (debit) {
				await manualDirectDebit(state);
			} else await manageWallet("wallet", state, "add");
			setLoading(false);
			setSubmit(true);
		};

	useEffect(() => {
		if (wallet?.isAdded && submit) {
			back();
			setSubmit(false);
		}
		if (wallet?.isManualDebit && submit) {
			back();
			setSubmit(false);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [wallet?.isAdded, submit, wallet?.isManualDebit]);

	return (
		<>
			<ModalComponents
				isOpen={isOpen}
				back={back}
				title={debit ? "debit user wallet" : "top up Wallet"}>
				<WalletForm state={state} textChange={textChange} />
				<Buttons
					title={debit ? "debit user" : "top up"}
					css="btn-primary1 text-capitalize py-3 w-50 my-4 mx-auto"
					width={"w-50"}
					style={{ borderRadius: "30px" }}
					loading={loading}
					onClick={handleSubmit}
				/>
			</ModalComponents>
		</>
	);
};
export const WalletForm = ({ state, textChange }) => {
  return (
    <form className="row mx-0">
      <div className="form mb-3">
        <label htmlFor="type">Type</label>
        <select
          value={state?.type}
          onChange={textChange("type")}
          className="form-control rounded10 py-3 form-select"
        >
          <option value="">Choose type</option>
          <option value="wallet">Wallet ID</option>
          <option value="email">User Email</option>
          <option value="telephone">User Number</option>
        </select>
      </div>
      <div className="form mb-3">
        <label htmlFor="id">
          {state?.type === "email"
            ? "Email"
            : state?.type === "telephone"
            ? "Telephone"
            : "ID"}
        </label>
        <input
          type={
            state?.type === "email"
              ? "email"
              : state?.type === "telephone"
              ? "tel"
              : "text"
          }
          value={state?.user}
          onChange={textChange("user")}
          className="form-control rounded10 py-3"
          placeholder={
            state?.type === "email"
              ? "example@mail.com"
              : state?.type === "telephone"
              ? "0800 0000 000"
              : "1234567890"
          }
        />
      </div>
      <div className="form mb-3">
        <label htmlFor="wallet">Amount</label>
        <input
          type="number"
          value={state?.amount}
          onChange={textChange("amount")}
          className="form-control rounded10 py-3"
          placeholder="2000"
        />
      </div>
    </form>
  );
};
