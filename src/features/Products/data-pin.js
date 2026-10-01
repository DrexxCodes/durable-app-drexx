import React, { useContext, useEffect } from "react";
import { GlobalState } from "@/Data/Context";

const Datapin = () => {
	let { setStateName } = useContext(GlobalState);
	useEffect(() => {
		setStateName("data pin history");
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	return <div>Datapin</div>;
};
 
export default Datapin;
