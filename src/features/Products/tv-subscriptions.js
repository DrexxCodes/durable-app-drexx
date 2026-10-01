import React, { useContext, useEffect, useState } from "react";
import Container from "@/components/ui/Container";
import { Buttons } from "@/Utils";
import { ModalComponents } from "@/components/ui/Modal";
import { GlobalState } from "@/Data/Context";
import { useValidation } from "@/Data/useFetch";
import LoadMore, { BottomTab } from "@/features/LoadMore";
import { TransactionDetails, NewPaginate } from "@/features/Transactions";
import { TransactionPinBox } from "@/features/Products/AutoBuy";

const TVSub = () => {
	let {
		setStateName,
		cables,
		numberWithCommas,
		buyServices,
		usecase,
		nairaSign,
		settings,
		wallet,
		auth,
	} = useContext(GlobalState);
	let [stateData, setStateData] = useState(null);

	useEffect(() => {
		setStateName("cable history");
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		setStateData(settings?.settings);
	}, [settings?.settings]);
	let [isOpen, setIsOpen] = useState(false),
		toggle = () => {
			setIsOpen(!isOpen);
			if (clickedData) setClickedData(null);
		},
		init = {
			type: "",
			productsCode: "",
			packagename: "",
			amount: "",
			user: "",
			smartCardNo: "",
			pin: "",
		},
		[state, setState] = useState(init),
		[newState, setNewState] = useState(null),
		[loading, setLoading] = useState(null),
		[thisData, setThisData] = useState(false),
		[submit, setSubmit] = useState(null),
		textChange =
			name =>
			({ target: { value } }) => {
				setState({ ...state, [name]: value });
			},
		{ handleFetch, validateLoading } = useValidation(
			"smartCardNo",
			{ ...state, type: state?.type?.toUpperCase() },
			setNewState
		),
		[active, setActive] = useState(0),
		btnTab = ["cable history", "cable list"],
		[clickedData, setClickedData] = useState(null),
		[buyActive, setBuyActive] = useState(0);

	useEffect(() => {
		if (clickedData) {
			setState({
				...state,
				amount: clickedData?.price,
				packagename: clickedData?.name,
				productsCode: clickedData?.code,
				type: clickedData?.type,
			});
			setIsOpen(true);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [clickedData]);

	useEffect(() => {
		if (Array?.isArray(cables?.cable_package?.[state?.type?.toLowerCase()])) {
			setState({
				...state,
				amount: cables?.cable_package?.[state?.type?.toLowerCase()]?.find(
					item => item?.code?.toString() === state?.productsCode?.toString()
				)
					? Number(
							cables?.cable_package?.[state?.type?.toLowerCase()]?.find(
								item =>
									item?.code?.toString() === state?.productsCode?.toString()
							)?.price
					  ).toFixed(2)
					: 0,
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [state?.productsCode, state?.type, cables?.cable_package]);

	useEffect(() => {
		if (state?.amount) {
			let com = stateData?.cablesCommission;
			if (auth?.user?.privilege === "reseller") {
				com =
					stateData?.cablesResellerCommission || stateData?.cablesCommission;
			}
			if (auth?.user?.privilege === "standalone") {
				com =
					stateData?.cablesStandaloneCommission || stateData?.cablesCommission;
			}
			setState({
				...state,
				commission: Number((com / 100) * (state?.amount * state?.numberOfPin)),
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [state?.amount]);

	useEffect(() => {
		if (state?.smartCardNo?.length >= 10 && state?.type)
			if (state?.type?.toLowerCase() !== "showmax") handleFetch();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [state?.smartCardNo, state?.type]);

	useEffect(() => {
		if (validateLoading) {
			// console.log({ newState });
			setState({
				...state,
				user: null,
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [validateLoading]);

	useEffect(() => {
		if (newState) {
			console.log({ newState });
			setState({
				...state,
				user: newState?.data?.content,
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [newState]);

	let handleSubmit = async e => {
		e?.preventDefault();
		if (!state?.smartCardNo) return;
		let send = state;

		let find;
		if (Array?.isArray(cables?.cable_package?.[state?.type?.toLowerCase()])) {
			find = cables?.cable_package?.[state?.type?.toLowerCase()]?.find(
				item => item?.code === state?.productsCode
			);
			if (!find) return;
		}
		send = {
			...send,
			packagename: find?.name,
			type: state?.type?.toUpperCase(),
			amount: state?.amount || find?.price,
		};
		console.log({ send, state });
		setLoading(true);
		await buyServices("cables", send);
		setLoading(false);
		setSubmit(true);
	};

	useEffect(() => {
		if (submit && cables?.isAdded) {
			toggle();
			setState(init);
			setSubmit(false);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [submit, cables?.isAdded]);

	useEffect(() => {
		if (state?.pin && state?.pin?.length === 4) handleSubmit();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [state?.pin]);

	return (
		<div className="bg-white aboutScreen">
			<Container className="py-5">
				{usecase?.usecase?.cables === "enable" && (
					<Buttons
						title={"subscribe"}
						css="btn-primary1 text-capitalize py-3 px-4 px-lg-5"
						width={"w-25 w25"}
						onClick={toggle}
						style={{ borderRadius: "30px" }}
					/>
				)}
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
				{active === 0 ? (
					<TVSubHistory setThisData={setThisData} thisData={thisData} />
				) : (
					<>
						<h5 className="Lexend mb-3 fontReduceBig">Cable List</h5>
						<div className="row mx-0 p-3 bland">
							<div className="col my-auto textTrunc fontReduce fw-bold Lexend">
								S/N
							</div>
							<div className="col my-auto textTrunc fontReduce fw-bold Lexend">
								Logo
							</div>
							<div className="col my-auto textTrunc fontReduce fw-bold Lexend">
								Name
							</div>
						</div>
						{cables?.cable_direct?.map((item, i) => (
							<div className="row mx-0 p-3 border-bottom" key={i}>
								<div className="col my-auto textTrunc fontReduce2">{i + 1}</div>
								<div className="col my-auto textTrunc fontReduce2">
									<img
										src={item?.image?.url}
										alt={item?.image?.name}
										className="img-fluid rounded imgFluid"
										style={{
											height: "10rem",
											width: "auto",
										}}
									/>
								</div>
								<div className="col my-auto textTrunc fontReduce2 text-uppercase">
									{item?.name}
								</div>
							</div>
						))}
						<h5 className="Lexend my-3 fontReduceBig">DStv List</h5>
						<div className="row mx-0 p-3 bland">
							<div className="col my-auto textTrunc fontReduce fw-bold Lexend">
								S/N
							</div>
							<div className="col my-auto textTrunc fontReduce fw-bold Lexend">
								Name
							</div>
							<div className="col my-auto textTrunc fontReduce fw-bold Lexend">
								Price
							</div>
						</div>
						{!Array?.isArray(cables?.cable_package?.dstv)
							? null
							: cables?.cable_package?.dstv?.map((item, i) => (
									<div
										className="row mx-0 p-3 border-bottom myCursor"
										// onClick={() => setClickedData({ ...item, type: "DSTV" })}
										key={i}>
										<div className="col my-auto textTrunc fontReduce2">
											{i + 1}
										</div>
										<div className="col my-auto textTrunc fontReduce2">
											{item?.name || item?.package}
											{/* {item?.name} */}
										</div>
										<div className="col my-auto textTrunc fontReduce2">
											{nairaSign}{" "}
											{(item?.price || item?.plan_amount) &&
												numberWithCommas(
													Number(item?.price || item?.plan_amount).toFixed(2)
												)}
											{/* {item?.plan_amount &&
												numberWithCommas(Number(item?.plan_amount).toFixed(2))} */}
										</div>
									</div>
							  ))}
						<h5 className="Lexend my-3 fontReduceBig">GOtv List</h5>
						<div className="row mx-0 p-3 bland">
							<div className="col my-auto textTrunc fontReduce fw-bold Lexend">
								S/N
							</div>
							<div className="col my-auto textTrunc fontReduce fw-bold Lexend">
								Name
							</div>
							<div className="col my-auto textTrunc fontReduce fw-bold Lexend">
								Price
							</div>
						</div>
						{!Array?.isArray(cables?.cable_package?.gotv)
							? null
							: cables?.cable_package?.gotv?.map((item, i) => (
									<div
										className="row mx-0 p-3 border-bottom myCursor"
										// onClick={() => setClickedData({ ...item, type: "GOTV" })}
										key={i}>
										<div className="col my-auto textTrunc fontReduce2">
											{i + 1}
										</div>
										<div className="col my-auto textTrunc fontReduce2">
											{item?.name || item?.package}
											{/* {item?.name} */}
										</div>
										<div className="col my-auto textTrunc fontReduce2">
											{nairaSign}{" "}
											{(item?.price || item?.plan_amount) &&
												numberWithCommas(
													Number(item?.price || item?.plan_amount).toFixed(2)
												)}
										</div>
									</div>
							  ))}
						<h5 className="Lexend my-3 fontReduceBig">Startimes List</h5>
						<div className="row mx-0 p-3 bland">
							<div className="col my-auto textTrunc fontReduce fw-bold Lexend">
								S/N
							</div>
							<div className="col my-auto textTrunc fontReduce fw-bold Lexend">
								Name
							</div>
							<div className="col my-auto textTrunc fontReduce fw-bold Lexend">
								Price
							</div>
						</div>
						{!Array?.isArray(cables?.cable_package?.startimes)
							? null
							: cables?.cable_package?.startimes?.map((item, i) => (
									<div
										className="row mx-0 p-3 border-bottom myCursor"
										// onClick={() => setClickedData({ ...item, type: "STARTIMES" })}
										key={i}>
										<div className="col my-auto textTrunc fontReduce2">
											{i + 1}
										</div>
										<div className="col my-auto textTrunc fontReduce2">
											{item?.name || item?.package}
											{/* {item?.name} */}
										</div>
										<div className="col my-auto textTrunc fontReduce2">
											{nairaSign}{" "}
											{(item?.price || item?.plan_amount) &&
												numberWithCommas(
													Number(item?.price || item?.plan_amount).toFixed(2)
												)}
										</div>
									</div>
							  ))}
						{!Array?.isArray(cables?.cable_package?.showmax) ? null : (
							<>
								<h5 className="Lexend my-3 fontReduceBig">Showmax List</h5>
								<div className="row mx-0 p-3 bland">
									<div className="col my-auto textTrunc fontReduce fw-bold Lexend">
										S/N
									</div>
									<div className="col my-auto textTrunc fontReduce fw-bold Lexend">
										Name
									</div>
									<div className="col my-auto textTrunc fontReduce fw-bold Lexend">
										Price
									</div>
								</div>
								{cables?.cable_package?.showmax?.map((item, i) => (
									<div
										className="row mx-0 p-3 border-bottom myCursor"
										// onClick={() => setClickedData({ ...item, type: "STARTIMES" })}
										key={i}>
										<div className="col my-auto textTrunc fontReduce2">
											{i + 1}
										</div>
										<div className="col my-auto textTrunc fontReduce2">
											{item?.name || item?.package}
											{/* {item?.name} */}
										</div>
										<div className="col my-auto textTrunc fontReduce2">
											{nairaSign}{" "}
											{(item?.price || item?.plan_amount) &&
												numberWithCommas(
													Number(item?.price || item?.plan_amount).toFixed(2)
												)}
										</div>
									</div>
								))}
							</>
						)}
					</>
				)}
			</Container>
			<ModalComponents title="cable subscription" isOpen={isOpen} back={toggle}>
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
							<div className="w-100">
								<p className="text-capitalize border-bottom d-flex justify-content-between printOnlyNone">
									<span>Type: </span>
									<span className="fontInherit Lexend">{state?.type}</span>{" "}
								</p>
								{Array?.isArray(
									cables?.cable_package?.[state?.type?.toLowerCase()]
								) && (
									<p className="text-capitalize border-bottom d-flex justify-content-between printOnlyNone">
										<span>Package: </span>
										<span className="fontInherit Lexend">
											{state?.type &&
												cables?.cable_package?.[
													state?.type?.toLowerCase()
												]?.find(
													item =>
														item?.code?.toString() ===
														state?.productsCode?.toString()
												)?.name}
										</span>{" "}
									</p>
								)}
								<p className="text-capitalize border-bottom d-flex justify-content-between printOnlyNone">
									<span>
										{state?.type?.toLowerCase() === "showmax"
											? "Telephone"
											: `Smart Card Number`}
										:{" "}
									</span>
									<span className="fontInherit Lexend">
										{state?.smartCardNo}
									</span>{" "}
								</p>
								<p className="text-capitalize border-bottom d-flex justify-content-between printOnlyNone">
									<span>Amount: </span>
									<span className="fontInherit Lexend">
										{nairaSign}{" "}
										{!Array?.isArray(
											cables?.cable_package?.[state?.type?.toLowerCase()]
										)
											? numberWithCommas(state?.amount)
											: cables?.cable_package?.[
													state?.type?.toLowerCase()
											  ]?.find(
													item =>
														item?.code?.toString() ===
														state?.productsCode?.toString()
											  )
											? numberWithCommas(
													Number(
														cables?.cable_package?.[
															state?.type?.toLowerCase()
														]?.find(
															item =>
																item?.code?.toString() ===
																state?.productsCode?.toString()
														)?.price
													).toFixed(2)
											  )
											: 0}
									</span>{" "}
								</p>
								<p className="text-capitalize border-bottom d-flex justify-content-between printOnlyNone">
									<span>Commission: </span>
									<span className="fontInherit Lexend">
										{nairaSign}{" "}
										{numberWithCommas(Number(state?.commission).toFixed(2))}
									</span>{" "}
								</p>
								<p className="text-capitalize border-bottom d-flex justify-content-between printOnlyNone">
									<span>Customer name: </span>
									<span className="fontInherit Lexend">
										{state?.user?.Customer_Name}
									</span>{" "}
								</p>
								<p className="text-capitalize border-bottom d-flex justify-content-between printOnlyNone">
									<span>Customer number: </span>
									<span className="fontInherit Lexend">
										{state?.user?.Customer_Number}
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
									title={"pay"}
									css="btn-primary1 text-capitalize py-3 px-4 px-lg-5 mx-auto"
									width={"w-50 w50"}
									onClick={
										wallet?.balance?.wallet_pin
											? () => {
													if (!["STARTIMES", "SHOWMAX"]?.includes(state?.type))
														if (!state?.user) return;
													setBuyActive(2);
											  }
											: () => {
													if (!["STARTIMES", "SHOWMAX"]?.includes(state?.type))
														if (!state?.user) return;
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
							<div className="mb-4">
								<label htmlFor="Type">Select cable</label>
								{/* <select
									name="type"
									id="type"
									value={state?.type}
									onChange={textChange("type")}
									className="form-control form-select py-3 rounded20">
									<option value="">Select Type</option>
									{cables?.cable_direct?.map((item, i) => (
										<option value={item?.name} key={i}>
											{item?.name}
										</option>
									))}
								</select> */}
								<CablesList
									state={state?.type}
									setState={i => {
										setState({ ...state, type: i });
									}}
								/>
							</div>
							{state?.type &&
								Array?.isArray(
									cables?.cable_package?.[state?.type?.toLowerCase()]
								) && (
									<div className="mb-4">
										<label htmlFor="Package">Package</label>
										<select
											name="productsCode"
											id="productsCode"
											value={state?.productsCode}
											onChange={textChange("productsCode")}
											className="form-control form-select py-3 rounded20">
											<option value="">Select package</option>
											{Array?.isArray(
												cables?.cable_package?.[state?.type?.toLowerCase()]
											) &&
												cables?.cable_package?.[
													state?.type?.toLowerCase()
												]?.map((item, i) => (
													<option
														value={
															item?.cableplan_id
																? item?.cableplan_id
																: item?.code
														}
														key={i}>
														{item?.package ? item?.package : item?.name}{" "}
													</option>
												))}
										</select>
									</div>
								)}
							<div className="mb-4">
								<label htmlFor="telephone">
									{state?.type?.toLowerCase() === "showmax"
										? "Telephone number"
										: `Smart card number`}
								</label>
								<input
									type={"number"}
									value={state?.smartCardNo}
									onChange={textChange("smartCardNo")}
									placeholder="08012345678"
									className="form-control py-3"
								/>
							</div>
							{state?.productsCode && (
								<div className="mb-4">
									<label htmlFor="telephone">Amount</label>
									<input
										type={"number"}
										value={state?.amount}
										onChange={textChange("amount")}
										placeholder="Amount"
										className="form-control py-3"
										min={0}
										readOnly={Array?.isArray(
											cables?.cable_package?.[state?.type?.toLowerCase()]
										)}
									/>
								</div>
							)}
							<Buttons
								title={"proceed"}
								css="btn-primary1 text-capitalize py-3 px-4 px-lg-5 mx-auto"
								width={"w-50 w50"}
								onClick={() => {
									if (!state?.smartCardNo) return;
									setBuyActive(1);
								}}
								style={{ borderRadius: "30px" }}
							/>
						</form>
					)}
				</div>
			</ModalComponents>
		</div>
	);
};

export const CablesList = ({ state, setState }) => {
	let { cables } = useContext(GlobalState);
	return (
		<div className="row mx-0">
			{cables?.cable_direct?.map((item, i) => (
				<div
					className="col p-2"
					onClick={setState ? () => setState(item?.name) : () => {}}
					key={i}>
					<div
						style={{
							height: "4.5rem",
							width: "4.5rem",
						}}
						className={`rounded d-flex myCursor ${
							state === item?.name
								? "borderColor borderColor2 list-group-item-primary"
								: ""
						}`}>
						<img
							src={item?.image?.url}
							alt={item?.name || item?.image?.name}
							className="img-fluid imgFluid tw-h-96 m-auto"
						/>
					</div>
				</div>
			))}
		</div>
	);
};

export default TVSub;

const TVSubHistory = ({ setThisData, thisData }) => {
	const { cables, getServicesHistory, getReload } = useContext(GlobalState);
	let [state, setState] = useState(null);

	useEffect(() => {
		getServicesHistory("cables");
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

				await getServicesHistory("cables", {
					search,
				});
			};
			handleSubmit();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [search]);

	useEffect(() => {
		if (cables.isFound) {
			setState(cables.mainSearch);
		} else setState(cables.cable);
	}, [cables.cable, cables.isFound, cables.mainSearch]);

	useEffect(() => {
		getReload();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	let handleLoadMore = async () => {
		setLoading(true);

		if (search) {
			await getServicesHistory("cables", {
				limit: Number(cables?.paginate?.nextPage * cables?.paginate?.limit),
				search,
			});
		} else {
			await getServicesHistory("cables", {
				limit: Number(cables?.paginate?.nextPage * cables?.paginate?.limit),
			});
		}
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
			{/* <div className="bland row mx-0 p-3 text-capitalize">
				<div className="col textTrunc fontReduce fw-bold Lexend d-none d-md-flex">
					ID
				</div>
				<div className="col textTrunc fontReduce fw-bold Lexend d-none d-md-flex">
					date
				</div>
				<div className="col textTrunc fontReduce fw-bold Lexend">Type</div>
				<div className="col textTrunc fontReduce fw-bold Lexend">
					Package name
				</div>
				<div className="col textTrunc fontReduce fw-bold Lexend">price</div>
				<div className="col textTrunc fontReduce fw-bold Lexend">status</div>
			</div>
			<div className="bg-white row mx-0">
				{state?.length === 0 ? (
					<EmptyComponent subtitle={"Cables list is empty"} />
				) : (
					state?.map((item, index) => (
						<div
							onClick={() => setThisData(item)}
							key={index}
							className="row mx-0 py-3 border-bottom myCursor">
							<div className="col my-auto textTrunc fontReduce2">
								{item?.item_id}
							</div>
							<div className="col my-auto textTrunc fontReduce2">
								{moment(item?.createdAt).format("L")}
							</div>
							<div className="col my-auto textTrunc fontReduce2">
								{item?.properties?.type}
							</div>
							<div className="col my-auto textTrunc fontReduce2">
								{item?.properties?.packagename}
							</div>
							<div className="col my-auto textTrunc fontReduce2">
								{numberWithCommas(item?.properties?.amount)}
							</div>
							<div
								className={`col my-auto textTrunc fontReduce2 ${
									item?.status ? "text-success" : "text-danger"
								}`}>
								{item?.statusText}
							</div>
						</div>
					))
				)}
			</div> */}
			<NewPaginate
				state={state}
				setState={setState}
				setThisData={setThisData}
				type={"cables"}
				criteria={
					{
						// id: params?.step,
					}
				}
			/>
			<TransactionDetails
				thisData={thisData}
				setThisData={setThisData}
				type={"cables"}
				criteria={
					{
						// id: params?.step,
					}
				}
			/>
			<BottomTab
				state={state}
				paginate={search ? cables?.search_paginate : cables?.paginate}
			/>
			<LoadMore
				next={search ? cables?.search_paginate?.next : cables?.paginate?.next}
				handleLoadMore={handleLoadMore}
				loading={loading}
			/>
		</div>
	);
};
