import React, { useState, useContext, useEffect } from "react";
import Container from "@/components/ui/Container";
import { Buttons, EmptyComponent } from "@/Utils";
import { GlobalState } from "@/Data/Context";
import LoadMore, { BottomTab } from "@/features/LoadMore";
import { TransactionDetails, NewPaginate } from "@/features/Transactions";
import { useNavigate } from "@/lib/router";
import moment from "moment";

const MainBiz = () => {
	let navigate = useNavigate();

	let { setStateName } = useContext(GlobalState);
	useEffect(() => {
		setStateName("biz verification history");
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div className="bg-white aboutScreen">
			<Container className="py-5">
				<Buttons
					title={"find biz"}
					css="btn-primary1 text-capitalize py-3 px-4 px-lg-5"
					width={"w-25 w25"}
					onClick={() => navigate("/products/biz/verify")}
					style={{ borderRadius: "30px" }}
				/>
				<MainBizHistory />
			</Container>
		</div>
	);
};

export default MainBiz;

const MainBizHistory = () => {
	let { biz, getServicesHistory } = useContext(GlobalState);

	let [data, setData] = useState(null),
		[thisData, setThisData] = useState(null);

		useEffect(() => {
			getServicesHistory("biz");
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, []);

	useEffect(() => {
		setData(biz?.biz);
	}, [biz?.biz]);

	let [loading, setLoading] = useState(false);
	let handleLoadMore = async () => {
		setLoading(true);

		await getServicesHistory("biz", {
			limit: Number(biz?.paginate?.nextPage * biz?.paginate?.limit),
		});
		setLoading(false);
	};

	if (!data) return;
	// console.log({ data });

	return (
		<div className="py-5">
			<NewPaginate
				state={data}
				setState={setData}
				setThisData={setThisData}
				type={"biz"}
				criteria={
					{
						// id: params?.step,
					}
				}
			/>
			<TransactionDetails
				thisData={thisData}
				setThisData={setThisData}
				type={"biz"}
				criteria={
					{
						// id: params?.step,
					}
				}
			/>
			<BottomTab state={data} paginate={biz?.paginate} />
			<LoadMore
				next={biz?.paginate?.next}
				handleLoadMore={handleLoadMore}
				loading={loading}
			/>
		</div>
	);
};

export const BizFindPage = () => {
	let { setStateName, biz, buyServices, returnErrors } =
		useContext(GlobalState);
	useEffect(() => {
		setStateName("Verify biz name");
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	let [state, setState] = useState(""),
		[loading, setLoading] = useState(false),
		[submit, setSubmit] = useState(false),
		handleSubmit = async e => {
			e?.preventDefault();
			if (!state)
				return returnErrors({
					error: [{ msg: "Business name is required", param: "name" }],
				});
			setLoading(true);
			await buyServices("biz", { name: state });
			setLoading(false);
			setSubmit(true);
		};

	useEffect(() => {
		if (biz?.isAdded && submit) {
			setSubmit(false);
			setState("");
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [biz?.isAdded, submit]);

	return (
		<div className="bg-white aboutScreen">
			<Container className="py-5">
				<div className="d-flex flex-column justify-content-center">
					<div className="w-50 w50 mx-auto">
						<input
							type="text"
							value={state}
							onChange={e => setState(e.target.value)}
							className="py-3 form-control"
							placeholder="Type business name here"
						/>
						<Buttons
							title={"find biz"}
							css="btn-primary1 text-capitalize py-3 px-4 px-lg-5"
							width={"w-25 w25 mx-auto d-block mt-3"}
							onClick={handleSubmit}
							loading={loading}
							style={{ borderRadius: "30px" }}
						/>
					</div>
				</div>
				<div className="py-3 py-md-5">
					{biz?.isAdded && (
						<>
							<div className="row mx-0 py-3 bland">
								<div className="col textTrunc my-auto text-uppercase fontReduce2 fw-bold Lexend">
									s/n
								</div>
								<div className="col textTrunc my-auto text-uppercase fontReduce2 fw-bold Lexend d-none d-md-flex">
									rcNumber
								</div>
								<div className="col textTrunc my-auto text-uppercase fontReduce2 fw-bold Lexend">
									Approved Name
								</div>
								<div className="col textTrunc my-auto text-uppercase fontReduce2 fw-bold Lexend">
									address
								</div>
								<div className="col textTrunc my-auto text-uppercase fontReduce2 fw-bold Lexend">
									email
								</div>
								<div className="col my-auto text-uppercase fontReduce2 fw-bold Lexend d-none d-md-flex">
									registration Date
								</div>
								<div className="col textTrunc my-auto text-uppercase fontReduce2 fw-bold Lexend">
									company Status
								</div>
								<div className="col textTrunc my-auto text-uppercase fontReduce2 fw-bold Lexend">
									status
								</div>
							</div>
							{biz?.biz?.[0]?.properties?.result?.length === 0 ? (
								<EmptyComponent
									subtitle={"Business vierification result empty"}
								/>
							) : (
								biz?.biz?.[0]?.properties?.result?.map((item, i) => (
									<div className="row mx-0 bland2 border-bottom" key={i}>
										<div className="col my-auto fontReduce2 textTrunc py-3 py-md-4">
											{i + 1}
										</div>
										<div className="col my-auto fontReduce2 textTrunc py-3 py-md-4">
											{item?.rcNumber}
										</div>
										<div className="col my-auto fontReduce2 textTrunc py-3 py-md-4">
											{item?.approvedName}
										</div>
										<div className="col my-auto fontReduce2 textTrunc py-3 py-md-4 textTrunc4">
											{item?.address}
										</div>
										<div className="col my-auto fontReduce2 textTrunc py-3 py-md-4">
											{item?.email}
										</div>
										<div className="col my-auto d-none d-md-flex textTrunc py-3 py-md-4">
											{moment(item?.registrationDate).format("L HH:mm A")}
										</div>
										<div className="col my-auto fontReduce2 textTrunc py-3 py-md-4">
											{item?.companyStatus}
										</div>
										<div className="col my-auto fontReduce2 textTrunc py-3 py-md-4">
											{item?.status}
										</div>
									</div>
								))
							)}
						</>
					)}
				</div>
			</Container>
		</div>
	);
};
