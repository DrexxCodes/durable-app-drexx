import React, { useContext, useEffect, useState } from "react";
import { GlobalState } from "@/Data/Context";
import Container from "@/components/ui/Container";
import { Buttons } from "@/Utils";
import { ProductList } from "@/features/Dashboard";

const Documentation = () => {
	let { setStateName, documentation, manageDocumentation } =
			useContext(GlobalState),
		[loading, setLoading] = useState(false);

	useEffect(() => {
		setStateName("API Documentation");
		manageDocumentation();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<>
			<div className="bg-white aboutScreen">
				<Container className="py-5">
					<div className="py-3">
						<a
							target={"_blank"}
							rel="noreferrer"
							className="btn-primary1 text-capitalize p-3 px-md-5 text-decoration-none"
							style={{ borderRadius: "30px" }}
							href={process.env.REACT_APP_API_DOC || "#"}>
							<span className="text nav-text text-capitalize">
								API Documentation Page
							</span>
						</a>
						<div className="py-5">
							{documentation?.doc ? (
								<>
									<div className="list-group-item-light py-3 row mx-0 text2p mb-3 fw-bold">
										<p className="col-md-6 my-0" style={{ fontSize: "1.2rem" }}>
											Authorization
										</p>
										<p className="col-md-6 my-0" style={{ fontSize: "1.3rem" }}>
											Bearer {documentation?.doc?.live_key}
										</p>
									</div>
								</>
							) : (
								<p>
									You have not genetated an API KEY yet, Generate api key below
								</p>
							)}
							<Buttons
								title={
									documentation?.doc
										? "Generate new API key"
										: "Generate API Key"
								}
								css="btn-primary1 text-capitalize p-3 px-md-5"
								width={"w-auto ms-auto"}
								onClick={async () => {
									setLoading(true);
									await manageDocumentation("post");
									setLoading(false);
								}}
								style={{ borderRadius: "30px" }}
								loading={loading}
							/>
						</div>
					</div>
					<ProductList />
				</Container>
			</div>
		</>
	);
};

export default Documentation;
