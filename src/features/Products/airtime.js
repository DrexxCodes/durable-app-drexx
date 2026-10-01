import React, { useState, useContext, useEffect } from "react";
import Container from "@/components/ui/Container";
import { Buttons } from "@/Utils";
import { ModalComponents } from "@/components/ui/Modal";
import { GlobalState } from "@/Data/Context";
import LoadMore, { BottomTab } from "@/features/LoadMore";
import { TransactionDetails, NewPaginate } from "@/features/Transactions";
import { TransactionPinBox } from "@/features/Products/AutoBuy";
import axios from "axios";
import { ClipLoader } from "react-spinners";

const Airtime = () => {
	let [isOpen, setIsOpen] = useState(false),
		toggle = () => {
			setIsOpen(!isOpen);
		};
	let [stateData, setStateData] = useState(null);

	let {
		setStateName,
		// network,
		airtimes,
		buyServices,
		returnErrors,
		numberWithCommas,
		nairaSign,
		// nairaSignNeutral,
		settings,
		wallet,
		auth,
		usecase,
	} = useContext(GlobalState);
	useEffect(() => {
		setStateName("airtime history");
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		setStateData(settings?.settings);
	}, [settings?.settings]);

	const getCommission = (type, amount) => {
		let com;
		switch (type) {
			case "MTN": {
				com =
					auth?.user?.privilege === "standalone"
						? stateData?.mtnStandaloneCommission || stateData?.mtnCommission
						: auth?.user?.privilege === "reseller"
						? stateData?.mtnResellerCommission || stateData?.mtnCommission
						: stateData?.mtnCommission;

				return (com / 100) * amount;
			}
			case "GLO": {
				com =
					auth?.user?.privilege === "standalone"
						? stateData?.gloStandaloneCommission || stateData?.gloCommission
						: auth?.user?.privilege === "reseller"
						? stateData?.gloResellerCommission || stateData?.gloCommission
						: stateData?.gloCommission;

				return (com / 100) * amount;
			}
			case "AIRTEL": {
				com =
					auth?.user?.privilege === "standalone"
						? stateData?.airtelStandaloneCommission ||
						  stateData?.airtelCommission
						: auth?.user?.privilege === "reseller"
						? stateData?.airtelResellerCommission || stateData?.airtelCommission
						: stateData?.airtelCommission;

				return (com / 100) * amount;
			}
			case "9MOBILE": {
				com =
					auth?.user?.privilege === "standalone"
						? stateData?.mobile9StandaloneCommission ||
						  stateData?.mobile9Commission
						: auth?.user?.privilege === "reseller"
						? stateData?.mobile9ResellerCommission ||
						  stateData?.mobile9Commission
						: stateData?.mobile9Commission;

				return (com / 100) * amount;
			}
			default:
				return null;
		}
	};

	let init = {
			phone: "",
			amount: "",
			network: "",
			pin: "",
		},
		[state, setState] = useState(init),
		[loading, setLoading] = useState(false),
		[submit, setSubmit] = useState(false),
		{ resp, loading: validateLoading } = useNumberValidation({
			phone: state?.phone,
		}),
		textChange =
			name =>
			({ target: { value } }) => {
				setState({ ...state, [name]: value });
			},
		handleSubmit = async e => {
			e?.preventDefault();
			if (Number(state?.amount) < Number(usecase?.usecase?.airtimeMini))
				return returnErrors({
					error: [
						{
							msg: `Amount cannot be less than NGN ${Number(
								usecase?.usecase?.airtimeMini
							)}`,
							param: "amount",
						},
					],
				});
			if (Number(state?.amount) > Number(usecase?.usecase?.airtimeMax))
				return returnErrors({
					error: [
						{
							msg: `Amount cannot be more than NGN ${Number(
								usecase?.usecase?.airtimeMax
							)}`,
							param: "amount",
						},
					],
				});
			setLoading(true);
			await buyServices("airtime", state);
			setLoading(false);
			setSubmit(true);
		},
		[buyActive, setBuyActive] = useState(0);

	useEffect(() => {
		if (airtimes?.isAdded && submit) {
			setIsOpen(false);
			setSubmit(false);
			setState(init);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [airtimes?.isAdded, submit]);

	useEffect(() => {
		if (state?.phone?.length === 11 && resp) {
			console.log({ resp });
			let operatorName = resp?.operatorName?.split(" "),
				newOpeName = operatorName?.[0],
				nextOpeName = newOpeName?.toUpperCase();
			console.log({ nextOpeName });
			setState(prev => {
				return { ...prev, network: nextOpeName };
			});
		}
	}, [resp, state?.phone]);

	useEffect(() => {
		if (state?.pin && state?.pin?.length === 4) handleSubmit();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [state?.pin]);

	return (
		<div className="bg-white aboutScreen">
			<Container className="py-5">
				<Buttons
					title={"buy airtime"}
					css="btn-primary1 text-capitalize py-3 px-4 px-lg-5"
					width={"w-25 w25"}
					onClick={toggle}
					style={{ borderRadius: "30px" }}
				/>
				<AirtimeHistory />
			</Container>
			<ModalComponents title="buy airtime" isOpen={isOpen} back={toggle}>
				<div className="downH2 d-flex">
					{buyActive === 2 ? (
						<TransactionPinBox
							state={state}
							setState={setState}
							handleSubmit={handleSubmit}
							loading={loading}
						/>
					) : buyActive === 1 ? (
						<>
							{/* {console.log(state)} */}
							<div className="w-100">
								<p className="text-capitalize border-bottom d-flex justify-content-between printOnlyNone">
									<span>Network: </span>
									<span className="fontInherit Lexend">
										{state?.network}
									</span>{" "}
								</p>
								<p className="text-capitalize border-bottom d-flex justify-content-between printOnlyNone">
									<span>Amount: </span>
									<span className="fontInherit Lexend">
										{nairaSign}{" "}
										{numberWithCommas(Number(state?.amount).toFixed(2))}
									</span>{" "}
								</p>
								<p className="text-capitalize border-bottom d-flex justify-content-between printOnlyNone">
									<span>Commission: </span>
									<span className="fontInherit Lexend">
										{nairaSign}{" "}
										{numberWithCommas(
											Number(
												getCommission(state?.network, state?.amount)
											).toFixed(2)
										)}
									</span>{" "}
								</p>
								<p className="text-capitalize border-bottom d-flex justify-content-between printOnlyNone">
									<span>Recipient number: </span>
									<span className="fontInherit Lexend">
										{state?.phone}
									</span>{" "}
								</p>
								<div className="d-flex justify-content-end">
									<Buttons
										title={"back"}
										css="btn-outline-primary1 text-capitalize"
										width={"w-auto"}
										onClick={() => {
											setBuyActive(0);
										}}
									/>
								</div>
								<Buttons
									title={"buy"}
									css="btn-primary1 text-capitalize py-3 px-4 px-lg-5 mx-auto"
									loading={loading}
									width={"w-50 w50"}
									onClick={
										wallet?.balance?.wallet_pin
											? () => {
													setBuyActive(2);
											  }
											: () => {
													handleSubmit();
											  }
									}
									style={{ borderRadius: "30px" }}
								/>
							</div>
						</>
					) : (
						<form className="w-100">
							<div className="mb-4">
								<label htmlFor="Newtwork">Network</label>
								<NetworkList
									state={state?.network}
									setState={i => {
										setState({ ...state, network: i });
									}}
								/>
							</div>
							<div className="mb-4">
								<label htmlFor="value">Amount</label>
								<input
									type={"number"}
									placeholder="500"
									className="form-control py-3"
									value={state?.amount}
									onChange={textChange("amount")}
									min={0}
								/>
							</div>
							<div className="mb-4">
								<label htmlFor="telephone">Phone number</label>
								<input
									type={"tel"}
									maxLength={11}
									placeholder="08012345678"
									className="form-control py-3"
									value={state?.phone}
									onChange={textChange("phone")}
								/>
								{validateLoading && (
									<span>
										<ClipLoader size={16} />
									</span>
								)}
							</div>
							<Buttons
								title={"proceed"}
								css="btn-primary1 text-capitalize py-3 w-50 my-4 mx-auto"
								width={"w-50"}
								style={{ borderRadius: "30px" }}
								onClick={() => {
									if (
										Number(state?.amount) <
										Number(usecase?.usecase?.airtimeMini)
									)
										return returnErrors({
											error: [
												{
													msg: `Amount cannot be less than NGN ${Number(
														usecase?.usecase?.airtimeMini
													)}`,
													param: "amount",
												},
											],
										});
									if (
										Number(state?.amount) > Number(usecase?.usecase?.airtimeMax)
									)
										return returnErrors({
											error: [
												{
													msg: `Amount cannot be more than NGN ${Number(
														usecase?.usecase?.airtimeMax
													)}`,
													param: "amount",
												},
											],
										});
									if (!state?.phone?.startsWith("0"))
										return returnErrors({
											error: [
												{
													msg: `${state?.phone} must start with a 0 digit`,
													param: "telephone",
												},
											],
										});
									if (state?.phone?.length !== 11)
										return returnErrors({
											error: [
												{
													msg: `Phone number should be 11 digits`,
													param: "telephone",
												},
											],
										});
									setBuyActive(1);
								}}
							/>
						</form>
					)}
				</div>
			</ModalComponents>
		</div>
	);
};

export default Airtime;

const AirtimeHistory = () => {
	let { airtimes, getServicesHistory, getReload } = useContext(GlobalState);

	let [data, setData] = useState(null),
		[thisData, setThisData] = useState(null);
	let [loading, setLoading] = useState(false),
		[search, setSearch] = useState("");

	useEffect(() => {
		getServicesHistory("airtime");
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (search) {
			document.getElementById("Search").addEventListener("search", () => {
				getReload();
			});
			let handleSubmit = async () => {
				if (!search) return;

				await getServicesHistory("airtime", {
					search,
				});
			};
			handleSubmit();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [search]);

	useEffect(() => {
		if (airtimes.isFound) {
			setData(airtimes.mainSearch);
		} else setData(airtimes.airtime);
	}, [airtimes.airtime, airtimes.isFound, airtimes.mainSearch]);

	useEffect(() => {
		getReload();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	let handleLoadMore = async () => {
		setLoading(true);

		await getServicesHistory("airtime", {
			limit: Number(airtimes?.paginate?.nextPage * airtimes?.paginate?.limit),
			search,
		});

		setLoading(false);
	};

	if (!data) return;
	// console.log({ data });

	return (
		<div className="pb-5 my-5">
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
			<NewPaginate
				state={data}
				setState={setData}
				setThisData={setThisData}
				type={"airtime"}
				criteria={
					{
						// id: params?.step,
					}
				}
			/>
			<TransactionDetails
				thisData={thisData}
				setThisData={setThisData}
				type={"airtime"}
				criteria={
					{
						// id: params?.step,
					}
				}
			/>
			<BottomTab
				state={data}
				paginate={search ? airtimes?.search_paginate : airtimes?.paginate}
			/>
			<LoadMore
				next={
					search ? airtimes?.search_paginate?.next : airtimes?.paginate?.next
				}
				handleLoadMore={handleLoadMore}
				loading={loading}
			/>
		</div>
	);
};

export const NetworkList = ({ state, setState }) => {
	let { network } = useContext(GlobalState);
	return (
		<div className="row mx-0">
			{network?.data
				?.filter(
					it =>
						!["spectranet", "smile"]?.includes(
							it?.name?.split(" ")?.[0]?.toLowerCase()
						)
				)
				?.map((item, i) => (
					<div className="col p-2" onClick={() => setState(item?.name)} key={i}>
						<div
							style={{
								height: "5rem",
								width: "5rem",
							}}
							className={`rounded d-flex ${
								state === item?.name
									? "borderColor borderColor2 list-group-item-primary"
									: ""
							}`}>
							<img
								src={item?.image?.url}
								alt={item?.image?.name}
								className="img-fluid imgFluid h-75 w-75 m-auto"
							/>
						</div>
					</div>
				))}
		</div>
	);
};

export const NetworkList2 = ({ state }) => {
	let { network } = useContext(GlobalState);
	return (
		<div
			style={{
				height: "5rem",
				width: "5rem",
			}}
			className={`rounded d-flex`}>
			<img
				src={network?.data?.find?.(item => state === item?.name)?.image?.url}
				alt={network?.data?.find?.(item => state === item?.name)?.image?.name}
				className="img-fluid imgFluid h-75 w-75 m-auto"
			/>
		</div>
	);
};

// moved to a modular component (responsive grid, wrapping labels)
export { default as DataNetworkList } from "@/components/products/DataNetworkList";

export const useNumberValidation = ({ phone }) => {
	let [resp, setResp] = useState(null),
		[respErr, setRespErr] = useState(null),
		[loading, setLoading] = useState(false);

	let handleSubmit = async e => {
		e?.preventDefault();
		if (!phone) return;
		setLoading(true);
		try {
			var res = await axios.post(`/api/v1/biz/number-validation`, {
				phone,
			});
			// console.log({ res: res?.data });
			setResp(res?.data?.data || res?.data);
		} catch (err) {
			let error = err.response?.data?.error;
			if (error) {
				console.log({ error }, "number-validation");
			}
			console.log({ err }, "number-validation-main");
			setRespErr(true);
		}
		setLoading(false);
	};

	// console.log({ phone, length: phone?.length });

	useEffect(() => {
		let ableToValidate = false;
		if (process.env.REACT_APP_NUMBER_VALIDATION) ableToValidate = true;
		if (
			["KEMTECH ENTERPRISES", "Kemtech Enterprises"]?.includes(
				process.env.REACT_APP_NAME
			) ||
			ableToValidate
		) {
			if (phone?.length === 11) {
				handleSubmit();
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [phone]);

	return { resp, loading, respErr };
};