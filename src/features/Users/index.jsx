import React from "react";
import StatCard from "@/components/dashboard/StatCard";

const Users = () => {
	return <div>Users</div>;
};

export default Users;

/** Row of clickable summary cards (used by the transactions filter). */
export const ThreeBoxBar = ({ list, setSubActive, active }) => (
	<div className="stat-grid stat-grid-3">
		{list?.map((item, index) => (
			<StatCard
				key={index}
				icon={item?.icon}
				label={item?.name}
				value={item?.number}
				active={active === index}
				onClick={setSubActive ? () => setSubActive(index) : undefined}
			/>
		))}
	</div>
);
