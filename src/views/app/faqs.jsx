import React, { useContext, useEffect, useState } from "react";
import { GlobalState } from "@/Data/Context";
import Container from "@/components/ui/Container";
import { EmptyComponent } from "@/Utils";

const MainFaqs = () => {
	let { setStateName, auth, faqs, manageFaqs } = useContext(GlobalState),
		[state, setState] = useState(null);

	useEffect(() => {
		setState(faqs?.data);
	}, [faqs?.data]);

	useEffect(() => {
		setStateName("FAQs");
		manageFaqs();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<>
			<div className="bg-white aboutScreen">
				<Container className="py-5">
					<div className="py-3">
						{state?.length === 0 ? (
							<EmptyComponent />
						) : (
							state?.map((item, i) => (
								<div className="py-3" key={i}>
									<details className="rounded p-3">
										<summary>{item?.summary}</summary>
										<div className="d-flex flex-column">
											<pre className="noScroll">{item?.details}</pre>
											{auth?.user?.privilege === "agent" && (
												<div className="d-flex align-items-center ms-auto"></div>
											)}
										</div>
									</details>
								</div>
							))
						)}
					</div>
				</Container>
			</div>
		</>
	);
};

export default MainFaqs;
