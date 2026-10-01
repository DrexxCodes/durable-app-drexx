import React, { useState, useContext, useEffect } from "react";
import Container from "@/components/ui/Container";
import { Buttons } from "@/Utils";
import { ModalComponents } from "@/components/ui/Modal";
import { GlobalState } from "@/Data/Context";
import LoadMore, { BottomTab } from "@/features/LoadMore";
import { useValidation } from "@/Data/useFetch";
import { TransactionDetails, NewPaginate } from "@/features/Transactions";
import { TransactionPinBox } from "@/features/Products/AutoBuy";

const Education = () => {
	let [isOpen, setIsOpen] = useState(false),
		toggle = () => {
			setIsOpen(!isOpen);
		};

	let {
			setStateName,
			education,
			buyServices,
			usecase,
			nairaSign,
			numberWithCommas,
			settings,
			wallet,
			auth,
		} = useContext(GlobalState),
		btnTab = ["education history", "education list"],
		[active, setActive] = useState(0),
		[buyActive, setBuyActive] = useState(0);
	let [stateData, setStateData] = useState(null);

	useEffect(() => {
		setStateName(btnTab[active]);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [active]);

	useEffect(() => {
		setStateData(settings?.settings);
	}, [settings?.settings]);

	let init = {
			numberOfPin: "",
			amount: "",
			type: "",
			subType: "",
			jambID: "",
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
		[newState, setNewState] = useState(null),
		{ handleFetch, validateLoading } = useValidation(
			"jambID",
			state,
			setNewState
		),
		handleSubmit = async e => {
			e?.preventDefault();
			setLoading(true);
			await buyServices("education", state);
			setLoading(false);
			setSubmit(true);
		};

	useEffect(() => {
		if (state?.jambID?.length >= 10 && state?.type && state?.subType)
			handleFetch();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [state?.jambID, state?.type, state?.subType]);

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
		if (state?.amount && state?.numberOfPin) {
			let com = stateData?.educationCommission;
			if (auth?.user?.privilege === "reseller") {
				com =
					stateData?.educationResellerCommission ||
					stateData?.educationCommission;
			}
			if (auth?.user?.privilege === "standalone") {
				com =
					stateData?.educationStandaloneCommission ||
					stateData?.educationCommission;
			}
			setState({
				...state,
				commission: Number((com / 100) * (state?.amount * state?.numberOfPin)),
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [state?.amount, state?.numberOfPin]);
	useEffect(() => {
		if (state?.type) {
			let findAmount = education?.educationToBuy?.find(
				item => item?.type?.toUpperCase() === state?.type?.toUpperCase()
			);
			if (findAmount) {
				setState({ ...state, amount: findAmount?.price });
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [state?.type, education?.educationToBuy]);

	useEffect(() => {
		if (education?.isAdded && submit) {
			setIsOpen(false);
			setSubmit(false);
			setState(init);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [education?.isAdded, submit]);

	useEffect(() => {
		if (state?.pin && state?.pin?.length === 4) handleSubmit();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [state?.pin]);

	return (
		<div className="bg-white aboutScreen">
			<Container className="py-5">
				{usecase?.usecase?.education === "enable" && (
					<Buttons
						title={"education"}
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
					<EducationHistory />
				) : (
					<div className="row mx-0">
						{education?.educationToBuy?.map((item, i) => (
							<div
								className="col-4 col-md-3 px-2 p-md-3 text-center dashHeight dashHeight2"
								key={i}>
								<div className="shadow2 p-3 p-md-4 eachProduct rounded20 h-100 d-flex align-items-center justify-content-center fontReduce2 flex-column">
									<img
										src={item?.image?.url}
										alt={item?.type}
										className="img-fluid rounded imgFluid"
										style={{
											height: "auto",
											width: "auto",
										}}
									/>
									<h5 className="pt-3 Lexend fw-bold">{item?.type}</h5>
								</div>
							</div>
						))}
					</div>
				)}
			</Container>
			<ModalComponents title="buy education" isOpen={isOpen} back={toggle}>
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
								<p className="text-capitalize border-bottom d-flex justify-content-between printOnlyNone">
									<span>Number of pin: </span>
									<span className="fontInherit Lexend">
										{state?.numberOfPin}
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
									<span>Cummulative Amount: </span>
									<span className="fontInherit Lexend">
										{nairaSign}{" "}
										{numberWithCommas(
											Number(state?.amount * state?.numberOfPin).toFixed(2)
										)}
									</span>{" "}
								</p>
								<p className="text-capitalize border-bottom d-flex justify-content-between printOnlyNone">
									<span>Commission: </span>
									<span className="fontInherit Lexend">
										{nairaSign}{" "}
										{numberWithCommas(Number(state?.commission).toFixed(2))}
									</span>{" "}
								</p>
								{state?.type?.toUpperCase() === "JAMB" ? (
									<>
										<p className="text-capitalize border-bottom d-flex justify-content-between printOnlyNone">
											<span>JAMB ID: </span>
											<span className="fontInherit Lexend">
												{state?.jambID}
											</span>{" "}
										</p>
										<p className="text-capitalize border-bottom d-flex justify-content-between printOnlyNone">
											<span>JAMB Type: </span>
											<span className="fontInherit Lexend text-uppercase">
												{state?.subType}
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
									</>
								) : null}
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
													if (state?.type?.toUpperCase() === "JAMB")
														if (!state?.user) return;
													setBuyActive(2);
											  }
											: () => {
													if (state?.type?.toUpperCase() === "JAMB")
														if (!state?.user) return;
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
								<label htmlFor="Education">Education type</label>
								<select
									className="form-control py-3 py-md-4 text-capitalize form-select"
									name="type"
									placeholder="Education"
									value={state?.type}
									onChange={textChange("type")}
									id="type">
									<option value="">select type</option>
									{education?.educationToBuy?.map((it, i) => (
										<option value={it?.type} key={i}>
											{it?.type}
										</option>
									))}
								</select>
							</div>
							<div className="mb-4">
								<label htmlFor="value">Amount</label>
								<input
									type={"number"}
									placeholder="500"
									readOnly
									className="form-control py-3"
									value={state?.amount}
									onChange={textChange("amount")}
								/>
							</div>
							<div className="mb-4">
								<label htmlFor="numberOfPin">Number of pins</label>
								<input
									type={"number"}
									placeholder="2"
									className="form-control py-3"
									value={state?.numberOfPin}
									onChange={textChange("numberOfPin")}
								/>
							</div>
							{state?.type?.toUpperCase() === "JAMB" && (
								<>
									<div className="mb-4">
										<label htmlFor="jambID">JAMB ID</label>
										<input
											type={"text"}
											placeholder="2"
											className="form-control py-3"
											value={state?.jambID}
											onChange={textChange("jambID")}
										/>
									</div>
									<div className="mb-4">
										<label htmlFor="Education">JAMB Type</label>
										<select
											className="form-control py-3 py-md-4 text-capitalize form-select"
											name="subType"
											placeholder="UTME"
											value={state?.subType}
											onChange={textChange("subType")}
											id="subType">
											<option value="">select type</option>
											<option value="utme">UTME</option>
											<option value="de">DE</option>
										</select>
									</div>
								</>
							)}
							<Buttons
								title={"proceed"}
								css="btn-primary1 text-capitalize py-3 w-50 my-4 mx-auto"
								width={"w-50"}
								style={{ borderRadius: "30px" }}
								onClick={() => {
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

export default Education;

const EducationHistory = () => {
  const { education, getServicesHistory, getReload } = useContext(GlobalState);
  let [state, setState] = useState(null);

	useEffect(() => {
		getServicesHistory("education");
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
  let [loading, setLoading] = useState(false),
    [search, setSearch] = useState(""),
    [thisData, setThisData] = useState(null);

  useEffect(() => {
    if (search) {
      document.getElementById("Search").addEventListener("search", () => {
        getReload();
      });
      let handleSubmit = async () => {
        if (!search) return;

        await getServicesHistory("education", {
          search,
        });
      };
      handleSubmit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  useEffect(() => {
    if (education.isFound) {
      setState(education.mainSearch);
    } else setState(education.education);
  }, [education.education, education.isFound, education.mainSearch]);

  useEffect(() => {
    getReload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  let handleLoadMore = async () => {
    setLoading(true);

    if (search) {
      await getServicesHistory("education", {
        limit: Number(
          education?.paginate?.nextPage * education?.paginate?.limit
        ),
        search,
      });
    } else {
      await getServicesHistory("education", {
        limit: Number(
          education?.paginate?.nextPage * education?.paginate?.limit
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
      <NewPaginate
        state={state}
        setState={setState}
        setThisData={setThisData}
        type={"education"}
        criteria={
          {
            // id: params?.step,
          }
        }
      />
      <TransactionDetails
        thisData={thisData}
        setThisData={setThisData}
        type={"education"}
        criteria={
          {
            // id: params?.step,
          }
        }
      />
      <BottomTab
        state={state}
        paginate={search ? education?.search_paginate : education?.paginate}
      />
      <LoadMore
        next={
          search ? education?.search_paginate?.next : education?.paginate?.next
        }
        handleLoadMore={handleLoadMore}
        loading={loading}
      />
    </div>
  );
};
