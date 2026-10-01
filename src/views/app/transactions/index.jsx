import React, { useState } from "react";
import Container from "@/components/ui/Container";
import TransactionsFolder, { TopFolder } from "@/features/Transactions";

const MainTransactions = () => {
	let [subActive, setSubActive] = useState(0);
	return (
		<div className="bg-white">
			<Container>
				<TopFolder setSubActive={setSubActive} subActive={subActive} />
				<TransactionsFolder subActive={subActive} />
			</Container>
		</div>
	);
};

export default MainTransactions;
