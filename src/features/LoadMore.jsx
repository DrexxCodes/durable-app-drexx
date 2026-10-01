import React, { useContext, useEffect, useState } from "react";
import { GlobalState } from "@/Data/Context";
import { Buttons } from "@/Utils";

const LoadMore = ({ handleLoadMore, next, loading }) => {
	return (
		<>
			{!next ? (
				""
			) : (
				<Buttons
					onClick={handleLoadMore}
					title={loading ? "loading..." : "load more"}
					css={"btn btn-primary1 text-uppercase my-4 mx-auto py-3"}
					width="w-50 w50"
					loading={loading}
				/>
			)}
		</>
	);
};

export default LoadMore;

export const BottomTab = ({ paginate, state }) => {
	return (
		<>
			{state?.length > 0 && (
				<div className="p-3 fontReduce">
					Showing 1 to {state?.length}
					{""}
					{state?.length !== paginate?.result
						? `[${paginate?.result}]`
						: ""} of {paginate?.total} entries
				</div>
			)}
		</>
	);
};

export const SearchComponent = ({ reload, handleSubmit }) => {
	const { getFullReload } = useContext(GlobalState);
	let [search, setSearch] = useState("");

	useEffect(() => {
		if (search) {
			document.getElementById("Search").addEventListener("search", () => {
				if (reload) reload();
				getFullReload();
			});
			let submit = async () => {
				if (!search) return;

				if (handleSubmit) await handleSubmit(null, search);
			};
			submit();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [search]);

	return (
		<div className="w-50 w50 mb-3">
			<input
				type="search"
				name="search"
				id="Search"
				className="form-control w-100 py-3 borderColor2"
				placeholder="type here to search"
				value={search}
				onChange={e => setSearch(e.target.value)}
			/>
		</div>
	);
};
