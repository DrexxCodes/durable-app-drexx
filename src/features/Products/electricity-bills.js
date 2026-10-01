import React, { useContext, useEffect, useState } from "react";
import Container from "@/components/ui/Container";
import { Buttons } from "@/Utils";
import { ModalComponents } from "@/components/ui/Modal";
import { GlobalState } from "@/Data/Context";
import { useValidation } from "@/Data/useFetch";
import LoadMore, { BottomTab } from "@/features/LoadMore";
import { TransactionDetails, NewPaginate } from "@/features/Transactions";
import { TransactionPinBox } from "@/features/Products/AutoBuy";

const ElectricityBill = () => {
	let {
		setStateName,
		electricity,
		buyServices,
		returnErrors,
		nairaSignNeutral,
		usecase,
		numberWithCommas,
		nairaSign,
		settings,
		wallet,
		auth,
	} = useContext(GlobalState);
	let [isOpen, setIsOpen] = useState(false),
		toggle = () => {
			setIsOpen(!isOpen);
			if (clickedData) setClickedData(null);
		},
		[active, setActive] = useState(0),
		btnTab = ["bill history", "bill list"],
		[buyActive, setBuyActive] = useState(0);
	let [stateData, setStateData] = useState(null);

	useEffect(() => {
		setStateName("bills history");
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		setStateData(settings?.settings);
	}, [settings?.settings]);

	console.log(stateData);
	let init = {
			type: "PREPAID",
			disco: "",
			meterNo: "",
			phoneNumber: "",
			amount: "",
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
			"meterNo",
			state,
			setNewState
		),
		[clickedData, setClickedData] = useState(null);

	useEffect(() => {
		if (state?.meterNo?.length >= 10 && state?.type) handleFetch();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [state?.meterNo, state?.type]);

	useEffect(() => {
		if (clickedData) {
			setState({ ...state, disco: clickedData?.disco });
			setIsOpen(true);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [clickedData]);

	useEffect(() => {
		if (newState) {
			// console.log({ newState });
			setState({
				...state,
				user: newState?.data?.content,
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [newState]);

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
		if (state?.amount) {
			let com = stateData?.electricityCommission;
			if (auth?.user?.privilege === "reseller") {
				com =
					stateData?.electricityResellerCommission ||
					stateData?.electricityCommission;
			}
			if (auth?.user?.privilege === "standalone") {
				com =
					stateData?.electricityStandaloneCommission ||
					stateData?.electricityCommission;
			}
			setState({
				...state,
				commission: Number((com / 100) * state?.amount),
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [state?.amount]);

	let handleSubmit = async e => {
		e?.preventDefault();
		if (!state?.meterNo) return;
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
		console.log({ electricity: state });
		await buyServices("electricity", state);
		setLoading(false);
		setSubmit(true);
	};

	useEffect(() => {
		if (submit && electricity?.isAdded) {
			toggle();
			setState(init);
			setSubmit(false);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [submit, electricity?.isAdded]);

	useEffect(() => {
		if (state?.pin && state?.pin?.length === 4) handleSubmit();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [state?.pin]);

	return (
		<div className="bg-white aboutScreen">
			<Container className="py-5">
				{usecase?.usecase?.electricity === "enable" && (
					<Buttons
						title={"pay bills"}
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
					<ElectricityBillHistory
						setThisData={setThisData}
						thisData={thisData}
					/>
				) : (
					<div className="row mx-0">
						{electricity?.electricityToBuy?.map((item, i) => (
							<div
								onClick={
									usecase?.usecase?.electricity === "enable"
										? () => setClickedData(item)
										: () => {}
								}
								className="col-4 col-md-3 px-2 p-md-3 text-center dashHeight dashHeight2"
								key={i}>
								<div className="shadow2 p-3 p-md-4 eachProduct rounded20 h-100 d-flex align-items-center justify-content-center fontReduce2 flex-column">
									<img
										src={item?.image?.url}
										alt={item?.disco}
										className="img-fluid rounded imgFluid"
										style={{
											height: "auto",
											width: "auto",
										}}
									/>
									<h5 className="pt-3 Lexend fw-bold">{item?.disco}</h5>
								</div>
							</div>
						))}
					</div>
				)}
			</Container>
			<ModalComponents title="pay bills" isOpen={isOpen} back={toggle}>
				<div className="downH2 d-flex">
					{buyActive === 2 ? (
						<TransactionPinBox
							state={state}
							setState={setState}
							handleSubmit={handleSubmit}
							loading={loading}
						/>
					) : buyActive === 1 ? (
						<div className="w-100">
							<p className="text-capitalize border-bottom d-flex justify-content-between printOnlyNone">
								<span>Type: </span>
								<span className="fontInherit Lexend">{state?.type}</span>{" "}
							</p>
							<p className="text-capitalize border-bottom d-flex justify-content-between printOnlyNone">
								<span>Disco: </span>
								<span className="fontInherit Lexend">{state?.disco}</span>{" "}
							</p>
							<p className="text-capitalize border-bottom d-flex justify-content-between printOnlyNone">
								<span>Meter Number: </span>
								<span className="fontInherit Lexend">
									{state?.meterNo}
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
								<span>Customer address: </span>
								<span className="fontInherit Lexend">
									{state?.user?.Address}
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
								loading={loading}
								width={"w-50 w50"}
								onClick={
									wallet?.balance?.wallet_pin
										? () => {
												if (!state?.user) return;
												setBuyActive(2);
										  }
										: () => {
												if (!state?.user) return;
												handleSubmit();
										  }
								}
								style={{ borderRadius: "30px" }}
							/>
						</div>
					) : (
						<form className="w-100">
							<div className="mb-4">
								<label htmlFor="Type">Type</label>
								<select
									name="type"
									id="type"
									value={state?.type}
									onChange={textChange("type")}
									className="form-control form-select py-3 rounded20">
									<option value="">Select bill type</option>
									<option value="PREPAID">PREPAID</option>
									<option value="POSTPAID">POSTPAID</option>
								</select>
							</div>
							<div className="mb-4">
								<label htmlFor="Disco">Platform</label>
								<select
									name="disco"
									id="disco"
									value={state?.disco}
									onChange={textChange("disco")}
									className="form-control form-select py-3 rounded20">
									<option value="">Select bill platform</option>
									{electricity?.electricityToBuy?.map((item, i) => (
										<option value={item?.disco} key={i}>
											{item?.fullname} ({item?.disco})
										</option>
									))}
								</select>
							</div>
							<div className="mb-4">
								<label htmlFor="telephone">Meter number</label>
								<input
									type={"number"}
									placeholder="08012345678"
									value={state?.meterNo}
									onChange={textChange("meterNo")}
									className="form-control py-3"
								/>
							</div>
							<div className="mb-4">
								<label htmlFor="value">Amount</label>
								<input
									type={"number"}
									placeholder="500"
									value={state?.amount}
									onChange={textChange("amount")}
									className="form-control py-3"
									min={0}
								/>
							</div>
							<div className="mb-4">
								<label htmlFor="value">Phone number</label>
								<input
									maxLength={11}
									type={"tel"}
									placeholder="080 000 0000"
									value={state?.phoneNumber}
									onChange={textChange("phoneNumber")}
									className="form-control py-3"
								/>
							</div>
							<Buttons
								title={"proceed"}
								css="btn-primary1 text-capitalize py-3 px-4 px-lg-5 mx-auto"
								width={"w-50 w50"}
								onClick={() => {
									if (!state?.meterNo) return;
									if (Number(state?.amount) <= 0)
										return returnErrors({
											error: [
												{
													msg: `Amount cannot be less than or equal to ${nairaSignNeutral} 0`,
													param: "amount",
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
		</div>
	);
};

export default ElectricityBill;

const ElectricityBillHistory = ({ setThisData, thisData }) => {
  const { electricity, getServicesHistory, getReload } =
    useContext(GlobalState);
  let [state, setState] = useState(null);

	useEffect(() => {
		getServicesHistory("electricity");
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

        await getServicesHistory("electricity", {
          search,
        });
      };
      handleSubmit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  useEffect(() => {
    if (electricity.isFound) {
      setState(electricity.mainSearch);
    } else setState(electricity.electricity);
  }, [electricity.electricity, electricity.isFound, electricity.mainSearch]);

  useEffect(() => {
    getReload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  let handleLoadMore = async () => {
    setLoading(true);

    if (search) {
      await getServicesHistory("electricity", {
        limit: Number(
          electricity?.paginate?.nextPage * electricity?.paginate?.limit
        ),
        search,
      });
    } else {
      await getServicesHistory("electricity", {
        limit: Number(
          electricity?.paginate?.nextPage * electricity?.paginate?.limit
        ),
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
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      {/* <div className="bland row mx-0 p-3 text-capitalize">
				<div className="col textTrunc fontReduce fw-bold Lexend d-none d-md-flex">
					ID
				</div>
				<div className="col textTrunc fontReduce fw-bold Lexend">Disco</div>
				<div className="col textTrunc fontReduce fw-bold Lexend d-none d-md-flex">
					date
				</div>
				<div className="col textTrunc fontReduce fw-bold Lexend">Meter no</div>
				<div className="col textTrunc fontReduce fw-bold Lexend">price</div>
				<div className="col textTrunc fontReduce fw-bold Lexend">status</div>
			</div>
			<div className="bg-white row mx-0">
				{state?.length === 0 ? (
					<EmptyComponent subtitle={"Electricity list is empty"} />
				) : (
					state?.map((item, index) => (
						<div
							onClick={() => setThisData(item)}
							key={index}
							className="row mx-0  py-3 border-bottom myCursor">
							<div className="col my-auto textTrunc fontReduce2">
								{item?.item_id}
							</div>
							<div className="col my-auto textTrunc fontReduce2">
								{item?.properties?.disco}
							</div>
							<div className="col my-auto textTrunc fontReduce2">
								{moment(item?.createdAt).format("L")}
							</div>
							<div className="col my-auto textTrunc fontReduce2">
								{item?.properties?.meterNo}
							</div>
							<div className="col textTrunc my-auto textTrunc fontReduce2">
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
        type={"electricity"}
        criteria={
          {
            // id: params?.step,
          }
        }
      />
      <TransactionDetails
        thisData={thisData}
        setThisData={setThisData}
        type={"electricity"}
        criteria={
          {
            // id: params?.step,
          }
        }
      />
      <BottomTab
        state={state}
        paginate={search ? electricity?.search_paginate : electricity?.paginate}
      />
      <LoadMore
        next={
          search
            ? electricity?.search_paginate?.next
            : electricity?.paginate?.next
        }
        handleLoadMore={handleLoadMore}
        loading={loading}
      />
    </div>
  );
};
