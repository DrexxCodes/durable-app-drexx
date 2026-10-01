/* eslint-disable no-useless-escape */
import React, { useContext, useEffect, useState, Fragment } from "react";
import Container from "@/components/ui/Container";
import { ModalComponents } from "@/components/ui/Modal";
import { Buttons } from "@/Utils";
import { GlobalState } from "@/Data/Context";
import LoadMore, { BottomTab } from "@/features/LoadMore";
import { TransactionDetails, NewPaginate } from "@/features/Transactions";
import { DataNetworkList, useNumberValidation } from "@/features/Products/airtime";
import { TransactionPinBox } from "@/features/Products/AutoBuy";
import { useValidation } from "@/Data/useFetch";
import { ClipLoader } from "react-spinners";

export let validateEmail = email => {
	const re =
		/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email);
};

const Data = () => {
	// let dataSortTab = [
	// 	{
	// 		name: "data history",
	// 		type: "button",
	// 		link: `detail`,
	// 	},
	// 	{ name: "mtn" },
	// 	{ name: "glo" },
	// 	{ name: "airtel" },
	// 	{ name: "9mobile" },
	// 	// { name: "vodafone" },
	// 	// { name: "multilinks" },
	// ];
	// let dataTab = [
	// 	{ name: "buy data", type: "button", link: "transfer" },
	// 	// { name: "data pin", type: "button", link: "pin" },
	// 	dataSortTab[0],
	// ];

	let { setStateName } = useContext(GlobalState),
		[active, setActive] = useState(0),
		btnTab = ["data history", "data list"];
	useEffect(() => {
		setStateName(btnTab[active]);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	let [isPin, setIsPin] = useState(false),
		[isBuy, setIsBuy] = useState(false),
		[isTransfer, setIsTransfer] = useState(false),
		togglePin = () => {
			setIsPin(!isPin);
		},
		toggleTransfer = () => {
			setIsTransfer(!isTransfer);
			if (isBuy) setIsBuy(false);
		};

	useEffect(() => {
		if (isBuy) {
			setIsTransfer(true);
		}
	}, [isBuy]);

	return (
		<div className="bg-white aboutScreen">
			<Container className="py-5">
				<div className="row mx-0">
					<div className="col d-flex">
						<Buttons
							title={"buy data"}
							css="btn-primary1 text-capitalize p-3 px-md-5"
							width={"w-50 w50"}
							onClick={toggleTransfer}
							style={{ borderRadius: "30px" }}
						/>
					</div>
				</div>
				<div className="btn-group w-100 py-3">
					{btnTab?.map((item, i) => (
						<button
							key={i}
							className={`btn py-3 text-capitalize fw-bold ${
								i === active ? "border-bottom textColor" : ""
							} rounded-0`}
							onClick={() => setActive(i)}>
							{item}
						</button>
					))}
				</div>
				<h4 className="text-capitalize my-3 Lexend">
					{active === 0 ? `data history` : "Data list"}
				</h4>
				{active === 1 ? (
					<DataList setIsBuy={setIsBuy} />
				) : (
					<TransferHistory active={active} />
				)}
			</Container>
			<MakePin isOpen={isPin} back={togglePin} />
			<MakeTransfer isOpen={isTransfer} back={toggleTransfer} datum={isBuy} />
		</div>
	);
};

export default Data;

const MakeTransfer = ({ isOpen, back, datum }) => {
	const {
		data,
		category,
		buyServices,
		numberWithCommas,
		returnErrors,
		nairaSign,
		wallet,
		auth,
	} = useContext(GlobalState);
	let [state, setState] = useState(null),
		init = {
			network: "",
			planId: "",
			phone: "",
			amount: "",
			name: "",
			pin: "",
		},
		[buy, setBuy] = useState(init),
		[loading, setLoading] = useState(false),
		[type, setType] = useState([]),
		[submit, setSubmit] = useState(false),
		{
			resp,
			loading: validateNumberLoading,
			respErr,
		} = useNumberValidation({
			phone: buy?.phone,
		}),
		[filterBy, setFilterBy] = useState(""),
		[displayNetwork, setDisplayNetwork] = useState(true),
		textChange =
			name =>
			({ target: { value } }) => {
				setBuy({ ...buy, [name]: value });
			},
		[buyActive, setBuyActive] = useState(0),
		[newState, setNewState] = useState(null),
		{ handleFetch, validateLoading } = useValidation(
			"SMILE",
			{ ...buy, network: "SMILE" },
			setNewState
		);

	useEffect(() => {
		let ableToValidate = false;
		if (process.env.REACT_APP_NUMBER_VALIDATION) ableToValidate = true;
		if (
			["KEMTECH ENTERPRISES", "Kemtech Enterprises"]?.includes(
				process.env.REACT_APP_NAME
			) ||
			ableToValidate
		) {
			setDisplayNetwork(false);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (validateEmail(buy?.phone) && buy?.name?.includes("SMILE"))
			handleFetch();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [buy?.phone, buy?.network]);

	useEffect(() => {
		if (newState) {
			// console.log({ newState });
			setBuy({
				...buy,
				user: newState?.data?.content,
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [newState]);

	useEffect(() => {
		if (validateLoading) {
			// console.log({ newState });
			setBuy({
				...buy,
				user: null,
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [validateLoading]);

	useEffect(() => {
		if (datum) {
			setBuy({ ...buy, ...datum, name: datum?.category?.categoryId });
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [datum]);

	useEffect(() => {
		if (buy?.name) {
			let newOne = data?.dataToBuy
				?.sort((a, b) => a?.price - b?.price)
				?.filter(
					item =>
						item?.category?.categoryId?.toLowerCase() ===
						buy?.name?.toLowerCase()
				);
			setType(newOne);
		}
	}, [buy?.name, data?.dataToBuy]);

	useEffect(() => {
		setState(data?.dataToBuy);
	}, [data?.dataToBuy]);

	let handleSubmit = async e => {
		e?.preventDefault();
		if (!buy?.phone) return;
		setLoading(true);
		let newBuy = buy;
		if (buy?.name?.includes("SMILE")) {
			newBuy = {
				...newBuy,
				phone:
					buy?.user?.AccountList?.AccountId ||
					buy?.user?.AccountList?.Account?.[0]?.AccountId,
			};
		}
		await buyServices("data", newBuy);
		setLoading(false);
		setSubmit(true);
	};

	useEffect(() => {
		if (submit && data?.isAdded) {
			back();
			setState(init);
			setSubmit(false);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [submit, data?.isAdded]);

	useEffect(() => {
		if (buy?.name && buy?.planId) {
			let item = data?.dataToBuy?.find(
				item =>
					item?.category?.categoryId?.toLowerCase() ===
						buy?.name?.toLowerCase() &&
					Number(item?.planId) === Number(buy?.planId)
			);

			let price = item?.price;
			if (auth?.user?.privilege === "superadmin")
				price = item?.topuserPrice || item?.price;
			if (auth?.user?.privilege === "topuser")
				price = item?.topuserPrice || item?.price;
			if (auth?.user?.privilege === "reseller")
				price = item?.resellerPrice || item?.price;
			if (auth?.user?.privilege === "standalone")
				price = item?.standalonePrice || item?.price;
			setBuy({
				...buy,
				amount: price,
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [buy?.name, buy?.planId, data?.dataToBuy, auth?.user]);
	// console.log({ buy });

	useEffect(() => {
		if (buy?.pin && buy?.pin?.length === 4) handleSubmit();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [buy?.pin]);

	useEffect(() => {
		if (buy?.phone?.length === 11 && resp && !buy?.name?.includes("SMILE")) {
			console.log({ resp });
			let operatorName = resp?.operatorName?.split(" "),
				newOpeName = operatorName?.[0],
				nextOpeName = newOpeName?.toUpperCase();
			console.log({ nextOpeName });
			setFilterBy(nextOpeName);
			// setState(prev => {
			// 	return { ...prev, network: nextOpeName };
			// });
		}
	}, [resp, buy?.phone, buy?.name]);

	useEffect(() => {
		if (resp || respErr) {
			setDisplayNetwork(true);
		}
	}, [resp, respErr]);

	if (!state) return <></>;

	return (
		<>
			<ModalComponents title="
			" isOpen={isOpen} back={back}>
				<div className="downH2 d-flex">
					{buyActive === 2 ? (
						<TransactionPinBox
							state={buy}
							setState={setBuy}
							handleSubmit={handleSubmit}
							loading={loading}
						/>
					) : buyActive === 1 ? (
						<>
							<div className="w-100">
								<p className="text-capitalize border-bottom d-flex justify-content-between printOnlyNone">
									<span>Network: </span>
									<span className="fontInherit Lexend">
										{buy?.network}
									</span>{" "}
								</p>
								<p className="text-capitalize border-bottom d-flex justify-content-between printOnlyNone">
									<span>Category: </span>
									<span className="fontInherit Lexend">
										{/* {buy?.name} */}
										{buy?.name}
									</span>{" "}
								</p>
								<p className="text-capitalize border-bottom d-flex justify-content-between printOnlyNone">
									<span>Plan: </span>
									<span className="fontInherit Lexend">
										{
											type?.find(item => item?.planId === buy?.planId)
												?.allowance
										}
										{type?.find(item => item?.planId === buy?.planId)?.size}
										{" | "}
										{type?.find(item => item?.planId === buy?.planId)?.validity}
									</span>{" "}
								</p>
								<p className="text-capitalize border-bottom d-flex justify-content-between printOnlyNone">
									<span>Amount: </span>
									<span className="fontInherit Lexend">
										{nairaSign}{" "}
										{numberWithCommas(Number(buy?.amount).toFixed(2))}
									</span>{" "}
								</p>
								<p className="text-capitalize border-bottom d-flex justify-content-between printOnlyNone">
									<span>
										Recipient{" "}
										{buy?.name?.includes("SMILE") ? "email" : `number`}:{" "}
									</span>
									<span className="fontInherit Lexend">{buy?.phone}</span>{" "}
								</p>
								{buy?.name?.includes("SMILE") && (
									<>
										<p className="text-capitalize border-bottom d-flex justify-content-between printOnlyNone">
											<span>Customer name: </span>
											<span className="fontInherit Lexend">
												{buy?.user?.Customer_Name}
											</span>{" "}
										</p>
										<p className="text-capitalize border-bottom d-flex justify-content-between printOnlyNone">
											<span>Customer ID: </span>
											<span className="fontInherit Lexend">
												{buy?.user?.AccountList?.AccountId ||
													buy?.user?.AccountList?.Account?.[0]?.AccountId}
											</span>{" "}
										</p>
									</>
								)}
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
									width={"w-50 w50"}
									onClick={
										wallet?.balance?.wallet_pin
											? () => {
													if (buy?.name?.includes("SMILE"))
														if (!buy?.user) return;
													setBuyActive(2);
											  }
											: () => {
													if (buy?.name?.includes("SMILE"))
														if (!buy?.user) return;
													handleSubmit();
											  }
									}
									loading={loading}
									style={{ borderRadius: "30px" }}
								/>
							</div>
						</>
					) : (
						<form className="w-100">
							{displayNetwork && (
								<div className="mb-4">
									<label htmlFor="Network">Network</label>

									<DataNetworkList
										state={buy?.name}
										setState={i => {
											setBuy({ ...buy, name: i });
										}}
										filterBy={filterBy}
									/>
								</div>
							)}
							{buy?.name && (
								<div className="mb-4">
									<label htmlFor="value">Value</label>
									<select
										name="value"
										id="value"
										value={buy?.planId}
										onChange={textChange("planId")}
										className="form-control form-select py-3 rounded20">
										<option value="">Select value</option>
										{type?.map((item, i) => (
											<option value={item?.planId} key={i}>
												{item?.allowance}
												{item?.size} {item?.validity}
											</option>
										))}
									</select>
								</div>
							)}
							{buy?.name && buy?.planId && (
								<div className="mb-4">
									<label htmlFor="telephone">Amount</label>
									<input
										type={"number"}
										placeholder="300"
										readOnly
										className="form-control py-3"
										value={buy?.amount}
										onChange={textChange("amount")}
									/>
								</div>
							)}
							<div className="mb-4">
								<label htmlFor="telephone">
									{buy?.name?.includes("SMILE") ? "Email" : `Phone number`}
								</label>
								<input
									type={buy?.name?.includes("SMILE") ? "email" : "tel"}
									placeholder="300"
									className="form-control py-3"
									value={buy?.phone}
									maxLength={buy?.name?.includes("SMILE") ? null : 11}
									onChange={textChange("phone")}
								/>
								{validateNumberLoading && !buy?.name?.includes("SMILE") && (
									<span>
										<ClipLoader size={16} />
									</span>
								)}
							</div>
							<Buttons
								title={"proceed"}
								css="btn-primary1 text-capitalize py-3 px-4 px-lg-5 mx-auto"
								width={"w-50 w50"}
								onClick={() => {
									if (!buy?.phone) return;
									if (!buy?.phone?.startsWith("0"))
										return returnErrors({
											error: [
												{
													msg: `${buy?.phone} must start with a 0 digit`,
													param: "telephone",
												},
											],
										});
									if (buy?.phone?.length !== 11)
										return returnErrors({
											error: [
												{
													msg: `Phone number should be 11 digits`,
													param: "telephone",
												},
											],
										});
									setBuy({
										...buy,
										network: buy?.name?.includes("_")
											? buy?.name?.slice(0, buy?.name?.indexOf("_"))
											: buy?.name?.split(" ")[0],
									});
									let findCate = category?.data?.find(
										item => item?.categoryId === buy?.name
									);

									if (findCate?.enabler !== "enable")
										return returnErrors({
											error: [
												{
													msg: `This service is currently not available, please try other ${
														buy?.name?.includes("_")
															? buy?.name?.slice(0, buy?.name?.indexOf("_"))
															: buy?.name
													} options`,
													param: buy?.name,
												},
											],
										});

									setBuyActive(1);
								}}
								style={{ borderRadius: "30px" }}
							/>
						</form>
					)}
				</div>
			</ModalComponents>
		</>
	);
};

const MakePin = ({ isOpen, back }) => {
	return (
		<>
			<ModalComponents title="data pin" isOpen={isOpen} back={back}>
				<div className="downH2 d-flex">
					<form className="w-100">
						<div className="mb-4">
							<label htmlFor="Newtwork">Network</label>
							<select
								name="network"
								id="network"
								className="form-control form-select py-3 rounded20">
								<option value="mtn">MTN</option>
							</select>
						</div>
						<div className="mb-4">
							<label htmlFor="value">Value</label>
							<input
								type={"number"}
								placeholder="500"
								className="form-control py-3"
							/>
						</div>
						<Buttons
							title={"get pin"}
							css="btn-primary1 text-capitalize py-3 px-4 px-lg-5"
							width={"w-50 w50"}
							onClick={back}
							style={{ borderRadius: "30px" }}
						/>
					</form>
				</div>
			</ModalComponents>
		</>
	);
};

const TransferHistory = () => {
	const { data, getServicesHistory, getReload } = useContext(GlobalState);
	let [state, setState] = useState(null),
		[thisData, setThisData] = useState(null);

	useEffect(() => {
		setState(data?.data);
	}, [data?.data]);

	useEffect(() => {
		getServicesHistory("data");
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	let [loading, setLoading] = useState(false),
		[search, setSearch] = useState("");

	useEffect(() => {
		if (search) {
			document.getElementById("Search").addEventListener("search", () => {
				getReload();
			});
			let handleSubmit = async () => {
				if (!search) return;

				await getServicesHistory("data", {
					search,
				});
			};
			handleSubmit();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [search]);

	useEffect(() => {
		if (data.isFound) {
			setState(data.mainSearch);
		} else setState(data.data);
	}, [data.data, data.isFound, data.mainSearch]);

	useEffect(() => {
		getReload();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	let handleLoadMore = async () => {
		setLoading(true);

		await getServicesHistory("data", {
			limit: Number(data?.paginate?.nextPage * data?.paginate?.limit),
			search,
		});

		setLoading(false);
	};

	if (!state) return;

	return (
		<div className="py-5">
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
				state={state}
				setState={setState}
				setThisData={setThisData}
				type={"data"}
				criteria={
					{
						// id: params?.step,
					}
				}
			/>
			<TransactionDetails
				thisData={thisData}
				setThisData={setThisData}
				type={"data"}
				criteria={
					{
						// id: params?.step,
					}
				}
			/>
			<BottomTab
				state={state}
				paginate={search ? data?.search_paginate : data?.paginate}
			/>
			<LoadMore
				next={search ? data?.search_paginate?.next : data?.paginate?.next}
				handleLoadMore={handleLoadMore}
				loading={loading}
			/>
		</div>
	);
};

const DataList = ({ setIsBuy }) => {
	const { data, network } = useContext(GlobalState);
	let [state, setState] = useState(null),
		[newState, setNewState] = useState(null);
	// [stateMTNSME, setStateMTNSME] = useState([]),
	// [stateMTNSME2, setStateMTNSME2] = useState([]),
	// [stateMTNDG, setStateMTNDG] = useState([]),
	// [stateMTNCG, setStateMTNCG] = useState([]),
	// [stateAIRTELDG, setStateAIRTELDG] = useState([]),
	// [stateAIRTELCG, setStateAIRTELCG] = useState([]),
	// [stateAIRTELSME, setStateAIRTELSME] = useState([]),
	// [stateGLOCG, setStateGLOCG] = useState([]),
	// [stateGLODG, setStateGLODG] = useState([]),
	// [stateGLOSME, setStateGLOSME] = useState([]),
	// [state9MOBILE, setState9MOBILE] = useState([]),
	// [state9MOBILESME, setState9MOBILESME] = useState([]),
	// [state9MOBILECG, setState9MOBILECG] = useState([]),
	// [state9MOBILEDG, setState9MOBILEDG] = useState([]),
	// [stateGLO, setStateGLO] = useState([]);

	useEffect(() => {
		setState(data?.dataToBuy);
		if (data?.dataToBuy) {
			let groups = data?.dataToBuy?.reduce((groups, game) => {
				let name = JSON.stringify(game?.category);
				if (!groups[name]) {
					groups[name] = [];
				}
				groups[name].push(game);
				return groups;
			}, {});
			// console.log({ groups });
			const groupArrays = Object.keys(groups).map(name => {
				return {
					name: groups?.[name]?.[0]?.category?.categoryId?.toLowerCase(),
					data: groups?.[name],
				};
			});
			setNewState(groupArrays);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data?.dataToBuy]);

	if (!state) return;

	return (
		<div className="pb-3 pb-md-5 my-3 py-md-5">
			<div className="bland row mx-0 py-3 px-0 text-capitalize">
				<div className="col textTrunc  d-none d-md-flex fontReduce fw-bold Lexend">
					s/n
				</div>
				<div className="col textTrunc fontReduce fw-bold Lexend">Network</div>
				<div className="col textTrunc fontReduce fw-bold Lexend">Category</div>
				<div className="col textTrunc fontReduce fw-bold Lexend">Price</div>
				<div className="col textTrunc fontReduce fw-bold Lexend">Reseller</div>
				{["Teetop Digitals", "TEETOP DIGITALS"]?.includes(
					process.env.REACT_APP_NAME
				) && (
					<div className="col textTrunc fontReduce fw-bold Lexend">
						Standalone
					</div>
				)}
				<div className="col textTrunc fontReduce fw-bold Lexend">Topuser</div>
				<div className="col textTrunc fontReduce fw-bold Lexend">Validity</div>
				<div className="col textTrunc fontReduce fw-bold Lexend">Allowance</div>
			</div>
			{network?.data
				?.sort((a, b) => {
					let nameA = a?.name,
						nameB = b?.name;
					var textA = nameA?.toUpperCase();
					var textB = nameB?.toUpperCase();
					return textA < textB ? -1 : textA > textB ? 1 : 0;
				})
				?.reverse()
				?.map((net, ac) => (
					<Fragment key={ac}>
						<h5 className="text-uppercase my-3 Lexend">{net?.name}</h5>
						<div className="bland2 row mx-0">
							{newState
								?.filter(newS =>
									newS?.name
										?.toUpperCase()
										?.includes(net?.name?.split(" ")?.[0]?.toUpperCase())
								)
								?.sort((a, b) => {
									let nameA = a?.name,
										nameB = b?.name;
									var textA = nameA?.toUpperCase();
									var textB = nameB?.toUpperCase();
									return textA < textB ? -1 : textA > textB ? 1 : 0;
								})
								?.reverse()
								?.map((dat, ind) => (
									<Fragment key={ind}>
										<h6 className="text-uppercase my-3 Lexend">
											{dat?.name?.replace(/[_]/g, " ")}
										</h6>
										{dat?.data
											?.sort((a, b) => a?.price - b?.price)
											?.map((item, index) => (
												<UserDataRecurrence
													item={item}
													index={index}
													key={index}
													setIsBuy={setIsBuy}
												/>
											))}
									</Fragment>
								))}
						</div>
					</Fragment>
				))}
			{/* <h5 className="text-capitalize my-3 Lexend">MTN</h5>
			<div className="bland2 row mx-0">
				{stateMTNSME?.length > 0 && (
					<h6 className="text-capitalize my-3 Lexend">MTN SME</h6>
				)}
				{stateMTNSME
					?.sort((a, b) => a?.price - b?.price)
					?.map((item, index) => (
						<UserDataRecurrence
							item={item}
							index={index}
							key={index}
							setIsBuy={setIsBuy}
						/>
					))}
				{stateMTNSME2?.length > 0 && (
					<h6 className="text-capitalize my-3 Lexend">MTN SME 2</h6>
				)}
				{stateMTNSME2
					?.sort((a, b) => a?.price - b?.price)
					?.map((item, index) => (
						<UserDataRecurrence
							item={item}
							index={index}
							key={index}
							setIsBuy={setIsBuy}
						/>
					))}
				{stateMTNCG?.length > 0 && (
					<h6 className="text-capitalize my-3 Lexend">MTN CG</h6>
				)}
				{stateMTNCG
					?.sort((a, b) => a?.price - b?.price)
					?.map((item, index) => (
						<UserDataRecurrence
							item={item}
							index={index}
							key={index}
							setIsBuy={setIsBuy}
						/>
					))}
				{stateMTNDG?.length > 0 && (
					<h6 className="text-capitalize my-3 Lexend">MTN DG</h6>
				)}
				{stateMTNDG
					?.sort((a, b) => a?.price - b?.price)
					?.map((item, index) => (
						<UserDataRecurrence
							item={item}
							index={index}
							key={index}
							setIsBuy={setIsBuy}
						/>
					))}
			</div>
			<h5 className="text-capitalize my-3 Lexend">GLO</h5>
			<div className="bland2 row mx-0">
				{stateGLO?.length > 0 && (
					<h6 className="text-capitalize my-3 Lexend">GLO</h6>
				)}
				{stateGLO
					?.sort((a, b) => a?.price - b?.price)
					?.map((item, index) => (
						<UserDataRecurrence
							item={item}
							index={index}
							key={index}
							setIsBuy={setIsBuy}
						/>
					))}
				{stateGLOSME?.length > 0 && (
					<h6 className="text-capitalize my-3 Lexend">GLO SME</h6>
				)}
				{stateGLOSME
					?.sort((a, b) => a?.price - b?.price)
					?.map((item, index) => (
						<UserDataRecurrence
							item={item}
							index={index}
							key={index}
							setIsBuy={setIsBuy}
						/>
					))}
				{stateGLOCG?.length > 0 && (
					<h6 className="text-capitalize my-3 Lexend">GLO CG</h6>
				)}
				{stateGLOCG
					?.sort((a, b) => a?.price - b?.price)
					?.map((item, index) => (
						<UserDataRecurrence
							item={item}
							index={index}
							key={index}
							setIsBuy={setIsBuy}
						/>
					))}
				{stateGLODG?.length > 0 && (
					<h6 className="text-capitalize my-3 Lexend">GLO DG</h6>
				)}
				{stateGLODG
					?.sort((a, b) => a?.price - b?.price)
					?.map((item, index) => (
						<UserDataRecurrence
							item={item}
							index={index}
							key={index}
							setIsBuy={setIsBuy}
						/>
					))}
			</div>
			<h5 className="text-capitalize my-3 Lexend">AIRTEL</h5>
			<div className="bland2 row mx-0">
				{stateAIRTELSME?.length > 0 && (
					<h6 className="text-capitalize my-3 Lexend">AIRTEL SME</h6>
				)}
				{stateAIRTELSME
					?.sort((a, b) => a?.price - b?.price)
					?.map((item, index) => (
						<UserDataRecurrence
							item={item}
							index={index}
							key={index}
							setIsBuy={setIsBuy}
						/>
					))}
				{stateAIRTELCG?.length > 0 && (
					<h6 className="text-capitalize my-3 Lexend">AIRTEL CG</h6>
				)}
				{stateAIRTELCG
					?.sort((a, b) => a?.price - b?.price)
					?.map((item, index) => (
						<UserDataRecurrence
							item={item}
							index={index}
							key={index}
							setIsBuy={setIsBuy}
						/>
					))}
				{stateAIRTELDG?.length > 0 && (
					<h6 className="text-capitalize my-3 Lexend">AIRTEL DG</h6>
				)}
				{stateAIRTELDG
					?.sort((a, b) => a?.price - b?.price)
					?.map((item, index) => (
						<UserDataRecurrence
							item={item}
							index={index}
							key={index}
							setIsBuy={setIsBuy}
						/>
					))}
			</div>
			<h5 className="text-capitalize my-3 Lexend">9MOBILE</h5>
			<div className="bland2 row mx-0">
				{state9MOBILE?.length > 0 && (
					<h6 className="text-capitalize my-3 Lexend">9MOBILE</h6>
				)}
				{state9MOBILE
					?.sort((a, b) => a?.price - b?.price)
					?.map((item, index) => (
						<UserDataRecurrence
							item={item}
							index={index}
							key={index}
							setIsBuy={setIsBuy}
						/>
					))}
				{state9MOBILESME?.length > 0 && (
					<h6 className="text-capitalize my-3 Lexend">9MOBILE SME</h6>
				)}
				{state9MOBILESME
					?.sort((a, b) => a?.price - b?.price)
					?.map((item, index) => (
						<UserDataRecurrence
							item={item}
							index={index}
							key={index}
							setIsBuy={setIsBuy}
						/>
					))}
				{state9MOBILEDG?.length > 0 && (
					<h6 className="text-capitalize my-3 Lexend">9MOBILE DG</h6>
				)}
				{state9MOBILEDG
					?.sort((a, b) => a?.price - b?.price)
					?.map((item, index) => (
						<UserDataRecurrence
							item={item}
							index={index}
							key={index}
							setIsBuy={setIsBuy}
						/>
					))}
				{state9MOBILECG?.length > 0 && (
					<h6 className="text-capitalize my-3 Lexend">9MOBILE CG</h6>
				)}
				{state9MOBILECG
					?.sort((a, b) => a?.price - b?.price)
					?.map((item, index) => (
						<UserDataRecurrence
							item={item}
							index={index}
							key={index}
							setIsBuy={setIsBuy}
						/>
					))}
			</div> */}
		</div>
	);
};

let UserDataRecurrence = ({ item, index, setIsBuy }) => {
	const { numberWithCommas, usecase } = useContext(GlobalState);
	return (
		<div
			key={index}
			className="d-block d-md-flex row mx-0  py-3 border-bottom px-0">
			<div
				onClick={
					usecase?.usecase?.data === "enable" ? () => setIsBuy(item) : () => {}
				}
				className="col textTrunc my-auto d-flex fontReduceMini myCursor align-items-center justify-content-between py-1 py-md-0">
				<span className="fontReduce d-md-none Lexend">S/N:</span>

				{index + 1}
			</div>
			<div
				onClick={
					usecase?.usecase?.data === "enable" ? () => setIsBuy(item) : () => {}
				}
				className="col textTrunc my-auto d-flex fontReduceMini myCursor align-items-center justify-content-between py-1 py-md-0">
				<span className="fontReduce d-md-none Lexend">Network:</span>

				{item?.network}
			</div>
			<div
				onClick={
					usecase?.usecase?.data === "enable" ? () => setIsBuy(item) : () => {}
				}
				className="col textTrunc my-auto d-flex fontReduceMini myCursor align-items-center justify-content-between py-1 py-md-0">
				<span className="fontReduce d-md-none Lexend">Category:</span>

				{item?.category?.name}
			</div>
			<div
				onClick={
					usecase?.usecase?.data === "enable" ? () => setIsBuy(item) : () => {}
				}
				className="col textTrunc my-auto d-flex fontReduceMini myCursor align-items-center justify-content-between py-1 py-md-0">
				<span className="fontReduce d-md-none Lexend">Price:</span>

				{item?.price && numberWithCommas(Number(item?.price).toFixed(2))}
			</div>
			<div
				onClick={
					usecase?.usecase?.data === "enable" ? () => setIsBuy(item) : () => {}
				}
				className="col textTrunc my-auto d-flex fontReduceMini myCursor align-items-center justify-content-between py-1 py-md-0">
				<span className="fontReduce d-md-none Lexend">Reseller:</span>

				{item?.resellerPrice
					? numberWithCommas(Number(item?.resellerPrice).toFixed(2))
					: 0}
			</div>
			{["Teetop Digitals", "TEETOP DIGITALS"]?.includes(
				process.env.REACT_APP_NAME
			) && (
				<div
					onClick={
						usecase?.usecase?.data === "enable"
							? () => setIsBuy(item)
							: () => {}
					}
					className="col textTrunc my-auto d-flex fontReduceMini myCursor align-items-center justify-content-between py-1 py-md-0">
					<span className="fontReduce d-md-none Lexend">Standalone:</span>

					{item?.standalonePrice
						? numberWithCommas(Number(item?.standalonePrice).toFixed(2))
						: 0}
				</div>
			)}
			<div
				onClick={
					usecase?.usecase?.data === "enable" ? () => setIsBuy(item) : () => {}
				}
				className="col textTrunc my-auto d-flex fontReduceMini myCursor align-items-center justify-content-between py-1 py-md-0">
				<span className="fontReduce d-md-none Lexend">Topuser:</span>

				{item?.topuserPrice
					? numberWithCommas(Number(item?.topuserPrice).toFixed(2))
					: 0}
			</div>
			<div
				onClick={
					usecase?.usecase?.data === "enable" ? () => setIsBuy(item) : () => {}
				}
				className="col textTrunc my-auto d-flex fontReduceMini myCursor align-items-center justify-content-between py-1 py-md-0">
				<span className="fontReduce d-md-none Lexend">Validity:</span>

				{item?.validity}
			</div>
			<div
				onClick={
					usecase?.usecase?.data === "enable" ? () => setIsBuy(item) : () => {}
				}
				className="col textTrunc my-auto d-flex fontReduceMini myCursor align-items-center justify-content-between py-1 py-md-0 textrTrunc2">
				<span className="fontReduce d-md-none Lexend">Allowance:</span>
				{item?.allowance} {item?.size}
			</div>
		</div>
	);
};
