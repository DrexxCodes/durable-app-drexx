import React, { useState, useContext, useEffect } from "react";
import Container from "@/components/ui/Container";
import { Buttons } from "@/Utils";
import { ModalComponents } from "@/components/ui/Modal";
import { GlobalState } from "@/Data/Context";
import LoadMore, { BottomTab } from "@/features/LoadMore";
import { TransactionDetails, NewPaginate } from "@/features/Transactions";
import { TransactionPinBox } from "@/features/Products/AutoBuy";
import { toast } from "react-toastify";

const BulkSMS = () => {
	let [isOpen, setIsOpen] = useState(false),
		toggle = () => {
			setIsOpen(!isOpen);
		};

	let {
		setStateName,
		// network,
		bulk_sms,
		buyServices,
		returnErrors,
		numberWithCommas,
		nairaSign,
		wallet,
		settings,
	} = useContext(GlobalState);
	useEffect(() => {
		setStateName("Bulk SMS history");
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	let init = {
			amount: "",
			network: "",
			name: "",
			quantity: 1,
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
			if (!state?.message)
				return returnErrors({
					error: [
						{
							msg: `Message is required`,
							param: "message",
						},
					],
				});
			if (!state?.recipient)
				return returnErrors({
					error: [
						{
							msg: `Recipient is required`,
							param: "recipient",
						},
					],
				});
			setLoading(true);
			await buyServices("bulk_sms", state);
			setLoading(false);
			setSubmit(true);
		},
		[buyActive, setBuyActive] = useState(0);

	useEffect(() => {
		if (bulk_sms?.isAdded && submit) {
			setIsOpen(false);
			setSubmit(false);
			setState(init);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [bulk_sms?.isAdded, submit]);

	useEffect(() => {
		if (state?.pin && state?.pin?.length === 4) handleSubmit();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [state?.pin]);

	return (
		<div className="bg-white aboutScreen">
			<Container className="py-5">
				<Buttons
					title={"send Bulk SMS"}
					css="btn-primary1 text-capitalize py-3 px-4 px-lg-5"
					width={"w-25 w25"}
					onClick={toggle}
					style={{ borderRadius: "30px" }}
				/>
				<BulkSMSPinHistory />
			</Container>
			<ModalComponents title="Bulk SMS" isOpen={isOpen} back={toggle}>
				<div className="downH2 d-flex">
					{buyActive === 2 ? (
						<TransactionPinBox
							state={state}
							setState={setState}
							handleSubmit={handleSubmit}
							loading={loading}
							title="Send"
						/>
					) : buyActive === 1 ? (
						<>
							<div className="w-100">
								<p className="text-capitalize border-bottom d-flex justify-content-between printOnlyNone">
									<span>Recipient: </span>
									<span className="fontInherit Lexend">
										{state?.recipient}
									</span>{" "}
								</p>
								<p className="text-capitalize border-bottom d-flex justify-content-between printOnlyNone">
									<span>Amount: </span>
									<span className="fontInherit Lexend">
										{nairaSign}{" "}
										{numberWithCommas(
											Number(settings?.settings?.bulkSMSCharge || 4).toFixed(2)
										)}
									</span>{" "}
								</p>
								<p className="text-capitalize border-bottom d-flex justify-content-between printOnlyNone">
									<span>Quantity: </span>
									<span className="fontInherit Lexend">
										{numberWithCommas(
											Number(state?.recipient?.split(",")?.length)
										)}
									</span>{" "}
								</p>
								<p className="text-capitalize border-bottom d-flex justify-content-between printOnlyNone">
									<span>Total Amount: </span>
									<span className="fontInherit Lexend">
										{nairaSign}{" "}
										{numberWithCommas(
											Number(
												(settings?.settings?.bulkSMSCharge || 4) *
													state?.recipient?.split(",")?.length
											).toFixed(2)
										)}
									</span>{" "}
								</p>
								<p className="text-capitalize border-bottom d-flex justify-content-between printOnlyNone">
									<span>Message: </span>
									<span className="fontInherit Lexend">
										{state?.message}
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
									title={"Send"}
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
								<label htmlFor="name">Message</label>
								<textarea
									className="form-control py-3"
									value={state?.message}
									onChange={textChange("message")}
									style={{
										resize: "none",
										height: "10rem",
									}}
								/>
							</div>
							<div className="mb-4">
								<label htmlFor="name">Recipient</label>
								<input
									type={"text"}
									placeholder={`2348030000000,2348050000000`}
									className="form-control py-3"
									value={state?.recipient}
									onChange={textChange("recipient")}
								/>
								<small className="d-block font-bold">
									Multiple numbers should be seperated by commas(,) and all
									numbers must be in international format e.g
									2348030000000,2348050000000
								</small>
							</div>
							<Buttons
								title={"proceed"}
								css="btn-primary1 text-capitalize py-3 w-50 my-4 mx-auto"
								width={"w-50"}
								style={{ borderRadius: "30px" }}
								onClick={() => {
									if (!state?.recipient || !state?.message)
										return toast.info("Please provide a message and recipient");
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

export default BulkSMS;

const BulkSMSPinHistory = () => {
	let { bulk_sms, getServicesHistory, getReload } = useContext(GlobalState);

	let [data, setData] = useState(null),
		[thisData, setThisData] = useState(null);

	let [loading, setLoading] = useState(false),
		[search, setSearch] = useState("");

	useEffect(() => {
		if (search) {
			document.getElementById("Search").addEventListener("search", () => {
				getReload();
			});
			let handleSubmit = async () => {
				if (!search) return;

				await getServicesHistory("bulk_sms", {
					search,
				});
			};
			handleSubmit();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [search]);

	useEffect(() => {
		if (bulk_sms.isFound) {
			setData(bulk_sms.mainSearch);
		} else setData(bulk_sms.bulk);
	}, [bulk_sms.bulk, bulk_sms.isFound, bulk_sms.mainSearch]);

	useEffect(() => {
		getReload();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		getServicesHistory("bulk_sms");
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	let handleLoadMore = async () => {
		setLoading(true);

		await getServicesHistory("bulk_sms", {
			limit: Number(bulk_sms?.paginate?.nextPage * bulk_sms?.paginate?.limit),
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
				type={"bulk_sms"}
				criteria={
					{
						// id: params?.step,
					}
				}
			/>
			<TransactionDetails
				thisData={thisData}
				setThisData={setThisData}
				type={"bulk_sms"}
				criteria={
					{
						// id: params?.step,
					}
				}
			/>
			<BottomTab
				state={data}
				paginate={search ? bulk_sms?.search_paginate : bulk_sms?.paginate}
			/>
			<LoadMore
				next={
					search ? bulk_sms?.search_paginate?.next : bulk_sms?.paginate?.next
				}
				handleLoadMore={handleLoadMore}
				loading={loading}
			/>
		</div>
	);
};
