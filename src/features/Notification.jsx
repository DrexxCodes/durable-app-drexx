import React, { useEffect, useState } from "react";
import { useContext } from "react";
import Container from "@/components/ui/Container";
import { GlobalState } from "@/Data/Context";
import { Buttons, EmptyComponent } from "@/Utils";
import { ModalComponents } from "@/components/ui/Modal";
import moment from "moment";
import LoadMore, { BottomTab } from "@/features/LoadMore";
import { BiTrashAlt } from "react-icons/bi";
import { MainPaginate, MainRanger } from "@/features/Transactions";

const Notification = () => {
	const { notifications, getNotify, setStateName } = useContext(GlobalState);

	useEffect(() => {
		setStateName("Notifications");
		getNotify("incoming");
		getNotify("outgoing");
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	let [active, setActive] = useState(0),
		btnTab = ["incoming", "outgoing"],
		[state, setState] = useState(null),
		[loading, setLoading] = useState(false),
		[isOpen, setIsOpen] = useState(false),
		toggle = () => {
			setIsOpen(!isOpen);
		};

	useEffect(() => {
		if (active === 1) setState(notifications?.outgoing);
		else setState(notifications?.incoming);
	}, [notifications?.incoming, notifications?.outgoing, active]);

	let handleLoadMore = async () => {
		setLoading(true);

		await getNotify(active === 1 ? "outgoing" : "incoming", {
			limit: Number(
				active === 1
					? notifications?.paginate2?.nextPage * notifications?.paginate2?.limit
					: notifications?.paginate?.nextPage * notifications?.paginate?.limit
			),
		});
		setLoading(false);
	};

	if (!state) return <></>;
	return (
		<div className="py-4 bg-white aboutScreen">
			<Container className="py-5">
				<Buttons
					title={"send notification"}
					css="btn-primary1 text-capitalize py-3 px-4 px-lg-5 mb-3"
					width={"w-25 w25"}
					onClick={toggle}
					style={{ borderRadius: "30px" }}
				/>
				<div className="btn-group w-100">
					{btnTab?.map((item, i) => (
						<button
							key={i}
							className={`btn py-3 text-capitalize fw-bold ${
								i === active ? "border-bottom textColor" : ""
							} rounded-0`}
							onClick={() => setActive(i)}>
							{item} notifications
						</button>
					))}
				</div>
				<NotificationList state={state} active={active} />
				{state?.length > 0 && (
					<>
						<BottomTab
							state={state}
							paginate={
								active === 1
									? notifications?.paginate2
									: notifications?.paginate
							}
						/>
						<LoadMore
							loading={loading}
							next={
								active === 1
									? notifications?.paginate2?.next
									: notifications?.paginate?.next
							}
							handleLoadMore={handleLoadMore}
						/>
					</>
				)}
			</Container>
			<AddNotification isOpen={isOpen} back={toggle} general={true} />
		</div>
	);
};

export default Notification;

const NotificationList = ({ state, active }) => {
	let { auth, manageNotify, notifications } = useContext(GlobalState);
	let [isUser, setIsUser] = useState(null),
		[isReply, setIsReply] = useState(""),
		[loading, setLoading] = useState(false),
		[submit, setSubmit] = useState(false),
		[isDelete, setDelete] = useState(false),
		toggleNotify = () => {
			setIsUser(null);
			setIsReply(null);
		},
		handleDelete = async () => {
			setLoading(true);
			await manageNotify(isDelete, isDelete?._id, "delete");
			setLoading(false);
			setSubmit(true);
		};

	useEffect(() => {
		if (submit && notifications?.isDeleted) {
			setDelete(false);
			setSubmit(false);
		}
	}, [submit, notifications?.isDeleted]);

	let [range, setRange] = useState(10);

	const [itemOffset, setItemOffset] = useState(0);
	const endOffset = itemOffset + range;
	if (!state) return;

	const currentItems = state.slice(itemOffset, endOffset);
	const pageCount = Math.ceil(state.length / range);

	const handlePageClick = event => {
		const newOffset = (event.selected * range) % state.length;
		setItemOffset(newOffset);
	};

	return (
		<>
			<MainRanger setRange={setRange} range={range} />
			<div className="row mx-0 g-3 g-md-4 g-lg-5 py-3">
				{currentItems?.length === 0 ? (
					<EmptyComponent
						subtitle={`No ${
							active === 1 ? "outgoing" : "incoming"
						} notification yet`}
					/>
				) : (
					currentItems?.map((item, i) => (
						<div className="col-sm-6 col-md-3 p-2 p-md-3" key={i}>
							<div className="rounded10 shadow2 eachProduct p-2 p-md-3 dashHeight">
								<small className="Lexend fw-bold mb-2 d-md-flex justify-content-md-between">
									<span className="Lexend d-block d-md-inline">
										{item?.title !== "notification"
											? item?.title
											: item?.priority
											? item?.user?.lastName
											: active === 1
											? item?.recipients?.[0]?.lastName
											: item?.user?.lastName}{" "}
										{item?.title !== "notification"
											? ""
											: item?.priority
											? item?.user?.firstName
											: active === 1
											? item?.recipients?.[0]?.firstName
											: item?.user?.firstName}
									</span>
									{auth?.user?.isAdmin && (
										<span className="Lexend d-flex justify-content-end">
											{moment(item?.createdAt).diff(moment(), "years") < 0
												? moment(item?.createdAt).format("DD/MM/YYYY hh:mm A")
												: moment(item?.createdAt).diff(moment(), "months") < 0
												? moment(item?.createdAt).format("DD/MM hh:mm A")
												: moment(item?.createdAt).diff(moment(), "days") < 0
												? moment(item?.createdAt).format("DD/MM hh:mm A")
												: moment(item?.createdAt).format("hh:mm A")}
										</span>
									)}
								</small>
								<p>{item?.message}</p>
								<div className="d-flex align-items-center">
									{item?.user?._id === auth?.user?._id ||
									auth?.user?.isAdmin ? (
										<BiTrashAlt
											size={20}
											onClick={() => {
												setDelete(item);
											}}
											className="text-danger text-danger2 text-capitalize"
										/>
									) : null}
									{active === 0 && item?.title === "notification" && (
										<button
											onClick={() => {
												setIsUser(item?.user?._id);
												setIsReply(item?._id);
											}}
											className="btn btn-light text-capitalize d-block ms-auto">
											notify
										</button>
									)}
								</div>
							</div>
						</div>
					))
				)}
			</div>
			<MainPaginate handlePageClick={handlePageClick} pageCount={pageCount} />
			<AddNotification isOpen={isUser} back={toggleNotify} reply={isReply} />
			<ModalComponents
				isOpen={isDelete ? true : false}
				back={() => {
					setDelete(false);
				}}
				success="text-danger text-danger2"
				title={`Delete Notification`}>
				<div className="downH2 d-flex flex-column">
					<div className="mb-3 text-center">
						Do you want to delete this notification?
					</div>
					<Buttons
						title={"delete"}
						css="btn-danger2 text-capitalize py-3 w-50 my-4 mx-auto"
						width={"w-50"}
						style={{ borderRadius: "30px" }}
						loading={loading}
						onClick={handleDelete}
					/>
				</div>
			</ModalComponents>
		</>
	);
};

export const AddNotification = ({ isOpen, back, reply, general }) => {
	let { manageNotify, notifications } = useContext(GlobalState);

	let init = {
			recipients: isOpen,
			message: "",
			reply,
			multiple: general ? general : "",
		},
		[state, setState] = useState(init),
		[loading, setLoading] = useState(false),
		[submit, setSubmit] = useState(false),
		textChange =
			name =>
			({ target: { value } }) => {
				setState({ ...state, [name]: value });
			},
		handleSubmit = async e => {
			e?.preventDefault();
			setLoading(true);
			if (!state?.message) return;
			await manageNotify({
				...state,
				recipients: isOpen,
				reply: reply || "",
			});
			setLoading(false);
			setSubmit(true);
		};

	useEffect(() => {
		if (notifications?.isAdded && submit) {
			back();
			setSubmit(false);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [notifications?.isAdded, submit]);

	return (
		<>
			<ModalComponents
				isOpen={isOpen}
				back={back}
				title={general ? "General notification" : "Notification"}>
				<div className="mb-3">
					<label htmlFor="value">Message</label>
					<textarea
						className="form-control py-3 rounded10"
						value={state?.message}
						onChange={textChange("message")}
						style={{
							resize: "none",
							height: "10rem",
						}}
					/>
				</div>
				<Buttons
					title={"send"}
					css="btn-primary1 text-capitalize py-3 w-50 my-4 mx-auto"
					width={"w-50"}
					style={{ borderRadius: "30px" }}
					loading={loading}
					onClick={handleSubmit}
				/>
			</ModalComponents>
		</>
	);
};
