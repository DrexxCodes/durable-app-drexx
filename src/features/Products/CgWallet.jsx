import React, { useEffect, useContext, useState } from "react";
import { useNavigate, useParams } from "@/lib/router";
import { GlobalState } from "@/Data/Context";
import Container from "@/components/ui/Container";
import { Buttons } from "@/Utils";
import { NetworkList } from "@/features/Products/airtime";
import { DefaultAuthComponent } from "@/views/public/register";

export let colorArr = [
	"#F1EEEA",
	"#E5DDF2",
	"#E9F5FA",
	"#DBC7DA",
	"#E6EDE8",
	"#C7DBCD",
	"#FAE9EA",
	"#C7DBDB",
	"#EDE6E6",
	"#C7DBDB",
	"#E9EBFA",
	"rgba(186, 255, 174, 0.80)",
];

const CgWallet = () => {
	let {
			auth,
			manageCGWalletHistory,
			manageCGWallets,
			numberWithCommas,
			wallet,
			setStateName,
			cgwallet,
		} = useContext(GlobalState),
		navigate = useNavigate();

	useEffect(() => {
		setStateName("CG Wallet");
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (!["reseller", "topuser", "agent", "standalone"]?.includes(auth?.user?.privilege)) navigate(-1);
		else {
			manageCGWalletHistory("credit");
			manageCGWalletHistory("debit");
			manageCGWallets();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [auth?.user, navigate]);

	let init = {
			network: "",
			cgwallet: "",
		},
		[state, setState] = useState(init),
		[data, setData] = useState(null),
		[loading, setLoading] = useState(false),
		[submit, setSubmit] = useState(false),
		handleSubmit = async e => {
			e?.preventDefault();
			setLoading(true);
			console.log({ state });
			await manageCGWalletHistory("post", state);
			setLoading(false);
			setSubmit(true);
		},
		{ page, id } = useParams();

	useEffect(() => {
		if (state?.network)
			setData(
				cgwallet?.data?.filter(
					item =>
						item?.network?.name?.toUpperCase() === state?.network?.toUpperCase()
				)
			);
	}, [cgwallet?.data, state?.network]);

	useEffect(() => {
		if (submit && cgwallet?.isAdded) {
			setState(init);
			setSubmit(false);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [submit, cgwallet?.isAdded]);

	return (
		<div className="bg-white aboutScreen">
			<Container className="py-5">
				<div className="row mx-0 g-2 g-md-4 mb-4">
					{wallet?.balance?.cgBalance?.map((it, i) => (
						<div className="col-6 col-md-3 p-2 p-md-3" key={i}>
							<div
								className="shadow2 rounded20 p-3 myCursor eachProduct CgWallet"
								style={{
									background: colorArr?.[i % colorArr?.length],
								}}>
								<div className="d-flex align-items-center">
									<img
										src={it?.network?.image?.url}
										alt={it?.category?.categoryId}
										className="me-md-2 mb-1 mb-md-0 rounded-circle object-cover"
										style={{
											height: "4rem",
											width: "4rem",
										}}
									/>
									<h5 className="fontReduceBig Lexend ms-2 ms-md-0">
										{it?.category?.name}
									</h5>
								</div>
								<h4 className="fontReduceBig">
									Balance:{" "}
									<span className="Lexend cgBalance">
										{numberWithCommas(Number(it?.volume || 0).toFixed(2))}
										{""}
										{it?.size}
									</span>
								</h4>
							</div>
						</div>
					))}
				</div>
				<div className="d-flex justify-content-end align-items-center flex-column">
					<Buttons
						title={"View Purchase History"}
						onClick={() => navigate(`/${page}/${id}/credit`)}
						css={
							"d-block ms-auto Lexend btn-primary1 text-capitalize py-3 mb-2"
						}
						width={"auto"}
					/>
					<Buttons
						title={"View Usage History"}
						onClick={() => navigate(`/${page}/${id}/debit`)}
						css={
							"d-block ms-auto Lexend btn-primary1 text-capitalize py-3 mb-2"
						}
						width={"auto"}
					/>
				</div>
				<DefaultAuthComponent nozoom nobg>
					<h2 className="my-3 text-center Lexend">Stock Purchase</h2>
					<form className="w-100" onSubmit={handleSubmit}>
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
							<label htmlFor="CG Wallet">
								{state?.network?.toUpperCase()} CG Wallet
							</label>
							<select
								className="form-control py-3 py-md-4 text-capitalize form-select"
								name="cgwallet"
								placeholder="CG Wallet"
								value={state?.cgwallet}
								onChange={e => setState({ ...state, cgwallet: e.target.value })}
								id="cgwallet">
								<option value="">
									Select {state?.network?.toUpperCase()} CG Wallet
								</option>
								{data?.map((it, i) => (
									<option value={it?._id} key={i}>
										{it?.volume} {it?.size} {it?.category?.name} / NGN{" "}
										{numberWithCommas(
											it?.amount ? Number(it?.amount).toFixed(2) : 0
										)}
									</option>
								))}
							</select>
						</div>
						<Buttons
							title={"purchase"}
							css="btn-primary1 text-capitalize py-3 w-50 my-4 mx-auto"
							width={"w-50"}
							style={{ borderRadius: "30px" }}
							loading={loading}
							onClick={handleSubmit}
						/>
					</form>
				</DefaultAuthComponent>
				{/* <AirtimeHistory /> */}
			</Container>
		</div>
	);
};

export default CgWallet;
