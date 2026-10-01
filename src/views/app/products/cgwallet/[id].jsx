import React, { useContext, useState, useEffect } from "react";
import Container from "@/components/ui/Container";
import { MainPaginate, MainRanger } from "@/features/Transactions";
import { BiDotsHorizontalRounded, BiCopy } from "react-icons/bi";
import moment from "moment";
import { GlobalState } from "@/Data/Context";
import LoadMore, { BottomTab } from "@/features/LoadMore";
import { ModalComponents } from "@/components/ui/Modal";
import { EmptyComponent } from "@/Utils";
import { RiShieldStarFill } from "react-icons/ri";
import { useParams } from "@/lib/router";
import { toast } from "react-toastify";

const Transactions = () => {
	let [thisData, setThisData] = useState(null),
		{ manageCGWalletHistory } = useContext(GlobalState);

	useEffect(() => {
		manageCGWalletHistory("debit");
		manageCGWalletHistory("credit");
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div className="bg-white aboutScreen">
			<Container className="py-3 py-md-5">
				<TransferList setThisData={setThisData} />
				<WalletDetails thisData={thisData} setThisData={setThisData} />
			</Container>
		</div>
	);
};

export default Transactions;

export const TransferList = ({ setThisData }) => {
	const { cgwallet, manageCGWalletHistory, getReload, setStateName } =
		useContext(GlobalState);
	let [loading, setLoading] = useState(false),
		[search, setSearch] = useState(""),
		[state, setState] = useState(null),
		{ step } = useParams();

	useEffect(() => {
		if (search) {
			document.getElementById("Search").addEventListener("search", () => {
				getReload();
			});
			let handleSubmit = async () => {
				if (!search) return;

				await manageCGWalletHistory(step, {
					search,
				});
			};
			handleSubmit();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [search, step]);

	useEffect(() => {
		if (cgwallet.isFound) {
			setState(cgwallet.mainSearch);
		} else setState(step === "credit" ? cgwallet.purchase : cgwallet?.usage);
	}, [
		cgwallet.purchase,
		cgwallet.isFound,
		cgwallet.mainSearch,
		step,
		cgwallet?.usage,
	]);

	useEffect(() => {
		getReload();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [step]);

	useEffect(() => {
		setStateName(
			`CG ${step === "credit" ? "purchase" : "usage"} Wallet History`
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [step]);

	let handleLoadMore = async () => {
		setLoading(true);

		if (search) {
			await manageCGWalletHistory(step, {
				limit: Number(
					cgwallet?.[`${step === "credit" ? "purchase" : "usage"}_paginate`]
						?.nextPage *
						cgwallet?.[`${step === "credit" ? "purchase" : "usage"}_paginate`]
							?.limit
				),
				search,
			});
		} else {
			await manageCGWalletHistory(step, {
				limit: Number(
					cgwallet?.[`${step === "credit" ? "purchase" : "usage"}_paginate`]
						?.nextPage *
						cgwallet?.[`${step === "credit" ? "purchase" : "usage"}_paginate`]
							?.limit
				),
			});
		}
		setLoading(false);
	};

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
				paginate={
					search
						? cgwallet?.search_paginate
						: cgwallet?.[`${step === "credit" ? "purchase" : "usage"}_paginate`]
				}
			/>
			<LoadMore
				next={
					search
						? cgwallet?.search_paginate?.next
						: cgwallet?.[`${step === "credit" ? "purchase" : "usage"}_paginate`]
								?.next
				}
				handleLoadMore={handleLoadMore}
				loading={loading}
			/>
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
					<p className="text-capitalize border-bottom d-flex justify-content-between printOnlyNone">
						<span>Id: </span>
						<span
							className="fontInherit Lexend force-d-flex myCursor"
							onClick={
								thisData?.item_id
									? () => {
											navigator.clipboard.writeText(thisData?.item_id).then(
												() => {
													toast.info("Copied", { autoClose: 2000 });
												},
												err => {
													toast.warn(`Could not copy: ${err}`, {
														autoClose: 2000,
													});
												}
											);
									  }
									: null
							}>
							{thisData?.item_id}
							<BiCopy />
						</span>{" "}
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
							{moment(thisData?.createdAt).format("DD/MM/YYYY hh:mm A")}
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
					{thisData?.type === "credit" && (
						<p className="text-capitalize border-bottom d-flex justify-content-between">
							<span>Amount: </span>
							<span className="fontInherit Lexend">
								{nairaSign}{" "}
								{thisData?.price
									? numberWithCommas(Number(thisData?.price).toFixed(2))
									: 0}
							</span>{" "}
						</p>
					)}
					{thisData?.type === "debit" &&
						thisData?.transaction?.properties?.phone && (
							<p className="text-capitalize border-bottom d-flex justify-content-between">
								<span>recipient: </span>
								<span
									className="fontInherit Lexend force-d-flex myCursor"
									onClick={
										thisData?.transaction?.properties
											? () => {
													navigator.clipboard
														.writeText(thisData?.transaction?.properties?.phone)
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
											  }
											: null
									}>
									{thisData?.transaction?.properties?.phone}
									<BiCopy />
								</span>{" "}
							</p>
						)}
					<p className="text-capitalize border-bottom d-flex justify-content-between">
						<span>Volume: </span>
						<span className="fontInherit Lexend">
							{thisData?.amount
								? numberWithCommas(Number(thisData?.amount).toFixed(2))
								: 0}{" "}
							GB
						</span>{" "}
					</p>
					<p className="text-capitalize border-bottom d-flex justify-content-between">
						<span>{thisData?.status ? "Previous " : "Initial "} Balance: </span>
						<span className="fontInherit Lexend">
							{thisData?.prevBalance
								? numberWithCommas(Number(thisData?.prevBalance).toFixed(2))
								: 0}{" "}
							GB
						</span>{" "}
					</p>
					<p className="text-capitalize border-bottom d-flex justify-content-between">
						<span>{thisData?.status ? "Current " : "Expected "}Balance: </span>
						<span className="fontInherit Lexend">
							{thisData?.balance
								? numberWithCommas(Number(thisData?.balance).toFixed(2))
								: 0}{" "}
							GB
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
					<div className="ms-auto d-flex align-items-center">
						<button
							className="btn btn-danger-2 btn-danger2 d-block ms-auto me-2"
							onClick={() => setThisData(false)}>
							Close
						</button>
					</div>
				</div>
			</ModalComponents>
		</>
	);
};

export const HistoryData = ({ state, search, setSearch, setThisData }) => {
	const { numberWithCommas } = useContext(GlobalState);

	let [range, setRange] = useState(10);

	const [itemOffset, setItemOffset] = useState(0);
	if (!state) return;

	const endOffset = itemOffset + range;

	const currentItems = state.slice(itemOffset, endOffset);
	const pageCount = Math.ceil(state.length / range);

	const handlePageClick = event => {
		const newOffset = (event.selected * range) % state.length;
		setItemOffset(newOffset);
	};
	return (
		<>
			<div className="w-50 w50 my-3">
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
			<MainRanger range={range} setRange={setRange} />
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
									// style={{ background: `${colorArr[i % colorArr?.length]}` }}
								>
									<RiShieldStarFill
										size={24}
										// color={`${
										// 	colorArr[i % colorArr?.length] === "#000000"
										// 		? "#fff"
										// 		: "#000"
										// }`}
									/>
								</div>
							</div>
						</div>
						<div className="col my-auto text-capitalize textTrunc textTrunc2 fw-md-bold fontReduce2">
							{it?.description}
						</div>
						<div className="col my-auto fontReduce2 d-flex w-100">
							{/* <span className="fontInherit d-none d-md-flex me-md-1">
								{nairaSign}
							</span>{" "} */}
							{it?.amount ? numberWithCommas(Number(it?.amount).toFixed(2)) : 0}{" "}
							GB
						</div>
						<div className="col my-auto fontReduce2 d-flex w-100">
							{it?.prevBalance
								? numberWithCommas(Number(it?.prevBalance).toFixed(2))
								: 0}{" "}
							GB
						</div>
						<div className="col my-auto fontReduce2 d-flex w-100">
							{it?.balance
								? numberWithCommas(Number(it?.balance).toFixed(2))
								: 0}{" "}
							GB
						</div>
						<div className="col my-auto fontReduce2">
							{moment(it?.createdAt).format("DD/MM/YYYY HH:mm A")}
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
