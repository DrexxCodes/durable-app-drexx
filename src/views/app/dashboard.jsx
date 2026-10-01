import React, { useContext, useState, useEffect, Fragment } from "react";
import Dashboard from "@/features/Dashboard";
import { GlobalState } from "@/Data/Context";
import { productArr } from "@/features/Products";
import { ModalComponents } from "@/components/ui/Modal";

const openLink = link => {
	window.open(link, link?.includes(window.location.origin) ? "" : "_blank");
};

const MainDashboard = () => {
	const { wallet, numberWithCommas, nairaSignNeutral, notifications } =
		useContext(GlobalState);

	const money = value =>
		`${nairaSignNeutral}${value ? numberWithCommas(Number(value).toFixed(2)) : 0}`;

	const summary = {
		balance: money(wallet?.balance?.available),
		expenses: money(wallet?.wallet_details?.purchase),
		notifications: notifications?.paginate?.total
			? numberWithCommas(notifications?.paginate?.total)
			: 0,
		products: productArr?.filter(it => it?.show)?.length,
	};

	const [notifyList, setNotifyList] = useState([]),
		[isOpen, setIsOpen] = useState(false),
		[keepOpen, setKeepOpen] = useState(true);

	useEffect(() => {
		if (notifications?.informed?.length > 0) {
			const res = notifications.informed.filter(
				item => item?.priority && item?.status === "play"
			);
			if (res.length > 0) setNotifyList(res);
		}
	}, [notifications?.informed]);

	useEffect(() => {
		let timer;
		if (notifyList?.length > 0 && !isOpen) {
			timer = setTimeout(() => setIsOpen(true), 2000);
		}
		if (notifyList?.length === 0 || !keepOpen) setIsOpen(false);
		return () => clearTimeout(timer);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [notifyList?.length]);

	const close = () => {
		setKeepOpen(false);
		setIsOpen(false);
	};

	return (
		<>
			<Dashboard summary={summary} />

			<ModalComponents isOpen={isOpen} title="Be informed" size="sm" toggle={close}>
				<div className="d-flex flex-column">
					{notifyList?.map((item, i) => (
						<Fragment key={i}>
							{item?.image?._id && (
								// eslint-disable-next-line @next/next/no-img-element
								<img
									onClick={item?.linkURL ? () => openLink(item.linkURL) : undefined}
									src={item?.image?.url}
									alt={item?.image?.name || "notification"}
									className={`img-fluid rounded ${item?.linkURL ? "myCursor" : ""}`}
									style={{ height: "auto", width: "100%" }}
								/>
							)}
							<p
								onClick={item?.linkURL ? () => openLink(item.linkURL) : undefined}
								className={`fw-semibold text-center w-100 my-0 py-3 ${
									item?.linkURL ? "myCursor" : ""
								}`}>
								{notifyList?.length > 1 && <span className="me-2">{i + 1}.</span>}
								{item?.message}
							</p>
						</Fragment>
					))}
					<button onClick={close} className="btn btn-primary1 py-2 px-5 mx-auto my-3">
						Close
					</button>
				</div>
			</ModalComponents>
		</>
	);
};

export default MainDashboard;
