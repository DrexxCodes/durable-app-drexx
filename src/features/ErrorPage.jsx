import React from "react";
import { FiCompass } from "react-icons/fi";
import Container from "@/components/ui/Container";
import { useNavigate } from "@/lib/router";

const ErrorPage = () => {
	const navigate = useNavigate();
	return (
		<section className="error-page">
			<Container>
				<div className="empty-state">
					<div className="empty-state-icon">
						<FiCompass size={28} />
					</div>
					<h5>Page not found</h5>
					<p>Nothing is found here. Check the address or your internet connection.</p>
					<div className="d-flex gap-2 justify-content-center">
						<button onClick={() => navigate(-1)} className="btn btn-outline-primary1 px-4">
							Go back
						</button>
						<button onClick={() => navigate("/")} className="btn btn-primary1 px-4">
							Home
						</button>
					</div>
				</div>
			</Container>
		</section>
	);
};

export default ErrorPage;
