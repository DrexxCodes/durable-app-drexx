import React, { useContext, useEffect } from "react";
import { GlobalState } from "@/Data/Context";
import Container from "@/components/ui/Container";

export const MainContent = ({ data, title }) => {
	return (
		<Container className="py-5">
			<section className="py-5">
				<MiddleHeader text={title || "Privacy Policy"} />
				{data?.map((item, index) => (
					<li className="my-3 mb-5 list-group-item" key={index}>
						<h6 className="fw-600 text-uppercase tw-text-3xl Lexend">
							{item?.summary}
						</h6>
						<ul>
							<li className="my-1 list-group-item tw-text-xl tw-leading-loose">
								{item?.details}
							</li>
						</ul>
					</li>
				))}
			</section>
		</Container>
	);
};

const Privacy = () => {
	const { faqs, manageFaqs } = useContext(GlobalState);
	useEffect(() => {
		manageFaqs("privacy");
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return <MainContent data={faqs?.privacy} title={"Privacy Policy"} />;
};

export default Privacy;

export const MiddleHeader = ({ text, css, css2 }) => {
	return (
		<div
			className={`d-flex align-items-center mb-3 ${
				css2 ? css2 : "justify-content-center"
			}`}>
			<h1
				className={`text-capitalize textColor2 text-center textDefault Lexend lg:tw-text-6xl ${
					css ? css : ""
				}`}>
				{text}
			</h1>
		</div>
	);
};
