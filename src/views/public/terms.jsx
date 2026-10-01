import { useContext, useEffect } from "react";
import { GlobalState } from "@/Data/Context";
import { MainContent } from "@/views/public/privacy";

const TermsCondition = () => {
	const { faqs, manageFaqs } = useContext(GlobalState);
	useEffect(() => {
		manageFaqs("terms");
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return <MainContent data={faqs?.terms} title="Terms and Conditions" />;
};

export default TermsCondition;
