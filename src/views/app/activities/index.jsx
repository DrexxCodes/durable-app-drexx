import React, { useContext, useEffect, useState } from "react";
import Container from "@/components/ui/Container";
import LoadMore, { BottomTab } from "@/features/LoadMore";
import { GlobalState } from "@/Data/Context";
import { EmptyComponent } from "@/Utils";
import moment from "moment";

const Activities = () => {
	let { setStateName, activity, getReload, getActivity } =
		useContext(GlobalState);
	useEffect(() => {
		setStateName("Activity");
		getActivity()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	let [loading, setLoading] = useState(false),
		[search, setSearch] = useState(""),
		[state, setState] = useState(null);

	useEffect(() => {
		if (search) {
			document.getElementById("Search").addEventListener("search", () => {
				getReload();
			});
			let handleSubmit = async () => {
				if (!search) return;

				await getActivity({
					search,
				});
			};
			handleSubmit();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [search]);

	useEffect(() => {
		if (activity.isFound) {
			setState(activity.mainSearch);
		} else setState(activity.data);
	}, [activity.data, activity.isFound, activity.mainSearch]);

	useEffect(() => {
		getReload();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	let handleLoadMore = async () => {
		setLoading(true);

		if (search) {
			await getActivity({
				limit: Number(activity?.paginate?.nextPage * activity?.paginate?.limit),
				search,
			});
		} else {
			await getActivity({
				limit: Number(activity?.paginate?.nextPage * activity?.paginate?.limit),
			});
		}
		setLoading(false);
	};

	if (!state) return <></>;

	return (
		<div className="bg-white aboutScreen">
			<Container className="py-5">
				<h4 className="Lexend">All activities</h4>
				<div className="w-50 w50 mb-3">
					<input
						type="search"
						name="search"
						id="Search"
						className="form-control w-100 py-3 borderColor2"
						placeholder="Type here to search"
						value={search}
						onChange={e => setSearch(e.target.value)}
					/>
				</div>
				<div className="py-3 py-md-5">
					<div className="bland row mx-0 py-3 px-0 text-capitalize Lexend fw-bold">
						<div className="col textTrunc Lexend">S/N</div>
						<div className="col textTrunc Lexend">User</div>
						<div className="col textTrunc Lexend">Action</div>
						<div className="col textTrunc Lexend">Date</div>
					</div>
					{state?.length === 0 ? (
						<EmptyComponent subtitle={"Activity is empty"} />
					) : (
						state?.map((it, i) => (
							<div key={i} className="row mx-0 py-3 border-bottom myCursor">
								<div className="col my-auto text-capitalize fontReduce2 textTrunc py-3 py-md-4">
									{i + 1}
								</div>
								<div className="col my-auto text-capitalize fontReduce2 textTrunc py-3 py-md-4 textTrunc2">
									{it?.user?.firstName} {it?.user?.lastName}
								</div>
								<div className="col my-auto fontReduce2 textTrunc py-3 py-md-4 textTrunc4 textTrunc5">
									{it?.message}
								</div>
								<div className="col my-auto fontReduce2 textTrunc py-3 py-md-4 textTrunc4">
									{moment(it?.createdAt).format("DD/MM/YYYY hh:mm:ss A")}
								</div>
							</div>
						))
					)}
					<BottomTab state={state} paginate={activity?.paginate} />
					<LoadMore
						next={activity?.paginate?.next}
						handleLoadMore={handleLoadMore}
						loading={loading}
					/>
				</div>
			</Container>
		</div>
	);
};

export default Activities;
