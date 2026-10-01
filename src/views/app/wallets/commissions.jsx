import React, { useContext, useEffect } from "react";
import { GlobalState } from "@/Data/Context";
import Container from "@/components/ui/Container";
import { BonusCommission } from "@/features/Wallets";

const Commissions = () => {
	let { setStateName } = useContext(GlobalState);
	useEffect(() => {
		setStateName("My Commission history");
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div className="bg-white aboutScreen">
			<Container className="py-3 py-md-5">
				<h5 className="Lexend text-capitalize">My Commission history</h5>

				<BonusCommission />
			</Container>{" "}
		</div>
	);
};

export default Commissions;
