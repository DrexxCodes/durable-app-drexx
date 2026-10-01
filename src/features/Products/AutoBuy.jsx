import React, { useEffect, useContext, useState } from "react";
import Container from "@/components/ui/Container";
import { GlobalState } from "@/Data/Context";
import { Buttons, OtpComponent } from "@/Utils";
import { ModalComponents } from "@/components/ui/Modal";

export var monthday = [
	1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
	23, 24, 25, 26, 27, 28, 29, 30, 31,
];
export var dayTime = [
	0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
	22, 23,
];

export var weekday = [
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday",
	"Sunday",
];

export var frequencyArr = ["daily", "weekly", "monthly"];

const MainAutoBuy = () => {
	let [isOpen, setIsOpen] = useState(false),
		toggle = () => {
			setIsOpen(!isOpen);
		};

	let { setStateName } = useContext(GlobalState);
	useEffect(() => {
		setStateName("auto buy");
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	return (
		<div className="bg-white aboutScreen">
			<Container className="py-5">
				<Buttons
					title={"set options"}
					css="btn-primary1 text-capitalize py-3 px-4 px-lg-5"
					width={"w-25 w25"}
					onClick={toggle}
					style={{ borderRadius: "30px" }}
				/>
			</Container>
			<AutoBuyModal isOpen={isOpen} toggle={toggle} />
		</div>
	);
};

let AutoBuyModal = ({ isOpen, toggle }) => {
	// let init = {frequency:""}, [state, setState]=useState(init),
	// [active,setActive]=useState(0)
	return (
		<ModalComponents
			title={"Auto Buy Options Settings"}
			isOpen={isOpen}
			toggle={toggle}></ModalComponents>
	);
};

export default MainAutoBuy;

export const TransactionPinBox = ({
	state,
	loading,
	setState,
	handleSubmit,
	title,
}) => {
	return (
		<div className="d-flex flex-column w-100">
			<small className="mb-4 d-block text-center">
				Enter your transaction pin
			</small>
			<div className="d-flex justify-content-center my-5 mx-auto">
				<OtpComponent
					stateData={state?.pin}
					textChange={data => {
						setState({ ...state, pin: data });
					}}
					css="borderColor"
					loading={loading}
					numInputs={4}
					isInputSecure={true}
				/>
			</div>
			<div className="w-100">
				<Buttons
					title={title || "buy"}
					css="btn-primary1 text-capitalize py-3 px-4 px-lg-5 mx-auto"
					loading={loading}
					width={"w-50 w50"}
					onClick={() => {
						if (!state?.pin || state?.pin?.length !== 4) return;
						handleSubmit();
					}}
					style={{ borderRadius: "30px" }}
				/>
			</div>
		</div>
	);
};