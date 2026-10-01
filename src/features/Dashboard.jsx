import React, { useContext, useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { FiBell, FiGrid, FiTrendingDown } from "react-icons/fi";
import { GlobalState } from "@/Data/Context";
import Container from "@/components/ui/Container";
import BalanceCard from "@/components/dashboard/BalanceCard";
import StatCard from "@/components/dashboard/StatCard";
import QuickActions from "@/components/dashboard/QuickActions";
import { useNavigate } from "@/lib/router";
import TransactionsFolder from "./Transactions";
import { BecomeAgent } from "./Settings";

const Dashboard = ({ summary }) => {
	const { setStateName, auth, usecase } = useContext(GlobalState);
	const navigate = useNavigate();
	const [isRequest, setIsRequest] = useState("");

	useEffect(() => {
		setStateName("dashboard analysis");
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const user = auth?.user;
	const upgrades = [
		user?.privilege !== "reseller" &&
			usecase?.usecase?.resellerUpgrade === "enable" && {
				key: "reseller",
				label: "Become a reseller",
			},
		user?.privilege !== "topuser" &&
			usecase?.usecase?.topuserUpgrade === "enable" && {
				key: "topuser",
				label: "Become a topuser",
			},
		["Teetop Digitals", "TEETOP DIGITALS"].includes(process.env.REACT_APP_NAME) &&
			user?.privilege !== "standalone" &&
			usecase?.usecase?.standaloneUpgrade === "enable" && {
				key: "standalone",
				label: "Become a standalone",
			},
	].filter(Boolean);

	return (
		<div className="page-section">
			<Container>
				<div className="dash-grid">
					<div className="dash-main">
						<BalanceCard balance={summary.balance} expenses={summary.expenses} />

						<div className="stat-grid stat-grid-2">
							<StatCard
								icon={<FiBell size={20} />}
								label="Notifications"
								value={summary.notifications}
								onClick={() => navigate("/notifications")}
							/>
							<StatCard
								icon={<FiGrid size={20} />}
								label="Products"
								value={summary.products}
								onClick={() => navigate("/products")}
							/>
							<StatCard
								icon={<FiTrendingDown size={20} />}
								label="Total expenses"
								value={summary.expenses}
								onClick={() => navigate("/transactions")}
								tone="rose"
							/>
						</div>

						{!user?.isAdmin && upgrades.length > 0 && (
							<div className="d-flex flex-wrap gap-2">
								{upgrades.map(u => (
									<button
										key={u.key}
										onClick={() => setIsRequest(u.key)}
										className="btn btn-outline-primary1 px-3 py-2">
										{u.label}
									</button>
								))}
							</div>
						)}

						<section>
							<h2 className="section-title">Quick actions</h2>
							<ProductList />
						</section>
					</div>

					<aside className="dash-side d-none d-xl-block">
						<CalenderComponent css="calendar-card" />
					</aside>
				</div>

				<section className="mt-4">
					<h2 className="section-title">Recent transactions</h2>
					<TransactionsFolder />
				</section>

				<BecomeAgent isOpen={isRequest} back={() => setIsRequest("")} />
			</Container>
		</div>
	);
};

export default Dashboard;

export const CalenderComponent = ({ css }) => (
  <div className="d-flex w-100">
    <Calendar className={css} showWeekNumbers={true} calendarType="gregory" />
  </div>
);

export const ProductList = () => <QuickActions />;
