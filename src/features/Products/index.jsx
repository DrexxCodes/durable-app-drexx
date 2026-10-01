import React, { useContext, useEffect, useState } from "react";
import { Link } from "@/lib/router";
import Container from "@/components/ui/Container";
import { useParams } from "@/lib/router";
import { GlobalState } from "@/Data/Context";
import {
	BsPhone,
	BsTelephoneFill,
	BsPlugFill,
	BsWallet2,
	// BsShieldCheck,
} from "react-icons/bs";
import { FaGraduationCap, FaMailBulk } from "react-icons/fa";
import { IoTvSharp } from "react-icons/io5";
import { AiOutlineSwap } from "react-icons/ai";
import { SiCoderwall } from "react-icons/si";
// import { GiRecycle } from "react-icons/gi";

export let productArr = [
	{
		name: "Airtime",
		accent: "#7535dc",
		link: "/airtime",
		color: "linear-gradient(90deg, #DE0DE2 16.14%, #880EC2 101.45%)",
		textColor: "white",
		icon: <BsTelephoneFill className="iconDash text-[#0ea5e9]" />,
		show: true,
	},
	{
		name: "Airtime to Cash",
		accent: "#c026d3",
		link: "/converter",
		color: "linear-gradient(90deg, #DE0DE2 16.14%, #0E102D 101.45%)",
		textColor: "white",
		icon: <AiOutlineSwap className="iconDash text-[#8b5cf6]" />,
		show: !["TEETOP DIGITAL"]?.includes(process.env.REACT_APP_NAME),
	},
	{
		name: "Data",
		accent: "#4f46e5",
		link: "/data",
		color: "linear-gradient(90.18deg, #3199B7 -52.19%, #144468 81.92%)",
		textColor: "white",
		icon: <BsPhone className="iconDash text-[#2563eb]" />,
		show: true,
	},
	{
		name: "Electricity bills",
		accent: "#e11d48",
		link: "/electricity-bills",
		color: "linear-gradient(90deg, #E43369 16.14%, #C20E19 101.45%)",
		textColor: "white",
		icon: <BsPlugFill className="iconDash text-[#e11d48]" />,
		show: true,
	},
	{
		name: "Cable Subscriptions",
		accent: "#0d9488",
		link: "/tv-subscriptions",
		color: "linear-gradient(90.18deg, #6CB731 -52.19%, #0F5A16 81.92%)",
		textColor: "white",
		icon: <IoTvSharp className="iconDash text-[#0ea5e9]" />,
		show: true,
	},
	{
		name: "Recharge Cards",
		accent: "#16a34a",
		link: "/airtime_pin",
		color: "linear-gradient(90deg, #DE0DE2 16.14%, #0E102D 101.45%)",
		textColor: "white",
		icon: <SiCoderwall className="iconDash text-[#22c55e]" />,
		show: true,
	},
	{
		name: "Education",
		accent: "#d4a72c",
		link: "/education",
		color: "linear-gradient(96.86deg, #F2E553 18.88%, #FF9900 125.77%)",
		icon: <FaGraduationCap className="iconDash text-[#ca8a04]" />,
		show: true,
	},
	{
		name: "CG Wallet",
		accent: "#3c0b5b",
		link: "/cgwallet",
		color: "linear-gradient(90.18deg, #3199B7 -52.19%, #144468 81.92%)",
		textColor: "white",
		icon: <BsWallet2 className="iconDash" />,
		show: ["TEETOP DIGITAL", "KEMTECH ENTERPRISES", "Giwa Digital"]?.includes(
			process.env.REACT_APP_NAME
		),
	},
	{
		name: "Bulk SMS",
		accent: "#9333ea",
		link: "/bulk_sms",
		color: "linear-gradient(90deg, #DE0DE2 16.14%, #0E102D 101.45%)",
		textColor: "white",
		icon: <FaMailBulk className="iconDash text-[#8b5cf6]" />,
		show: false,
		// show: ["Teetop Digital", "TEETOP DIGITAL"]?.includes(
		// 	process.env.REACT_APP_NAME
		// ),
	},
	// {
	// 	name: "Auto Buy",
	// 	link: "/auto-buy",
	// 	color: "linear-gradient(90deg, #F45F83 16.14%, #9E1A2A 101.45%)",
	// 	textColor: "white",
	// 	icon: <GiRecycle className="iconDash" />,
	// },
	// {
	// 	name: "Business verification",
	// 	link: "/biz",
	// 	color: "linear-gradient(96.86deg, #53F293 18.88%, #9EFF00 125.77%)",
	// 	textColor: "black",
	// 	icon: <BsShieldCheck className="iconDash" />,
	// },
];

const Products = () => {
	let {
		setStateName,
		auth,
		manageCGWalletHistory,
		manageCGWallets,
	} = useContext(GlobalState);
	useEffect(() => {
		setStateName("all products");
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	let [state, setState] = useState([]);

	useEffect(() => {
		setState(
			!["reseller", "standalone"]?.includes(auth?.user?.privilege)
				? productArr
						?.filter(it => it?.show)
						?.filter(item => item?.link !== "/cgwallet")
				: productArr?.filter(it => it?.show)
		);
		if (
			["TEETOP DIGITAL", "KEMTECH ENTERPRISES"]?.includes(
				process.env.REACT_APP_NAME
			)
		)
			if (["reseller", "standlone"]?.includes(auth?.user?.privilege)) {
				manageCGWalletHistory("credit");
				manageCGWalletHistory("debit");
				manageCGWallets();
			}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [auth?.user]);

	let params = useParams();

	return (
		<div className="page-section">
			<Container>
				<p className="page-lead">Choose a service to get started.</p>
				<div className="product-grid">
					{state?.map((item, i) => (
						<Link
							key={i}
							to={
								item?.link?.includes("converter")
									? item?.link
									: `/${params?.page}${item?.link}`
							}
							className="product-card">
							<span className="quick-icon" style={{ "--accent": item?.accent }}>
								{item?.icon}
							</span>
							<span className="product-name">{item?.name}</span>
						</Link>
					))}
				</div>
			</Container>
		</div>
	);
};

export default Products;
