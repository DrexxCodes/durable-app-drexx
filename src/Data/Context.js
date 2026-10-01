import React, { createContext, useState } from "react";
import { connect, useSelector, shallowEqual } from "react-redux";
import { BiHomeAlt } from "react-icons/bi";
import { BsCodeSlash } from "react-icons/bs";
import { FaQuestionCircle } from "react-icons/fa";
import { TbActivity } from "react-icons/tb";
import { VscBellDot } from "react-icons/vsc";
import { AiOutlineSwap } from "react-icons/ai";
import { GiChart, GiWallet } from "react-icons/gi";
import { IoCardOutline } from "react-icons/io5";

import {
	loginUser,
	logoutUser,
	updatePassword,
	updateUser,
	registerUser,
	loginUser2FA,
} from "@/Data/Actions/AuthActions";

import { clearErrors, restoreMsg, returnErrors } from "@/Data/Reducer/ErrorReducer";

import { getReload } from "@/Data/Actions/UserActions";

import { getUseCase } from "@/Data/Reducer/UseCaseReducer";
import { manageDocumentation } from "@/Data/Reducer/SocketReducer";
import { getSettings } from "@/Data/Reducer/SettingsReducer";
import { getActivity } from "@/Data/Reducer/BizReducer";

import {
	getNotify,
	manageNotify,
	manageWalletPin,
	manageFaqs,
} from "@/Data/Actions/NotificationAction";
import { manageUpgrade } from "@/Data/Reducer/UseCaseReducer";

import {
	buyServices,
	getServicesHistory,
	manageFundWallet,
	getWalletHistory,
	manageWallet,
	manageFundWalletFlutterwave,
	generateVirtual,
	getCards,
	converterServices,
	manageFundWalletPaystack,
	getReferrals,
} from "@/Data/Actions/GeneralAction";

import { getCategory, getBiller, getProducts } from "@/Data/Actions/ProviderAction";

import {
	manageCGWalletHistory,
	manageCGWallets,
} from "@/Data/Reducer/CgWalletReducer";

// Only the slices exposed through context. Picking them (instead of returning the
// whole store) avoids react-redux's "selector returned the root state" warning;
// shallowEqual keeps re-renders limited to when one of these slices changes.
const SLICES = [
	"auth",
	"errors",
	"settings",
	"notifications",
	"success",
	"category",
	"biller",
	"products",
	"data",
	"usecase",
	"upgrade",
	"network",
	"transactions",
	"wallet",
	"bonus",
	"commission",
	"airtimes",
	"converter",
	"electricity",
	"cables",
	"activity",
	"airtimes_pin",
	"education",
	"referral",
	"stat",
	"faqs",
	"documentation",
	"cgwallet",
	"bulk_sms",
];
const selectSlices = state => {
	const picked = {};
	for (const key of SLICES) picked[key] = state[key];
	return picked;
};

export const GlobalState = createContext();

const DataProvider = ({
	children,
	clearErrors,
	restoreMsg,
	returnErrors,
	loginUser,
	logoutUser,
	updatePassword,
	updateUser,
	registerUser,
	getCategory,
	getBiller,
	getProducts,
	getReload,
	buyServices,
	converterServices,
	getUseCase,
	getSettings,
	getNotify,
	manageNotify,
	getServicesHistory,
	manageFundWallet,
	getWalletHistory,
	manageWallet,
	manageFundWalletFlutterwave,
	generateVirtual,
	getCards,
	manageFundWalletPaystack,
	manageUpgrade,
	getReferrals,
	manageWalletPin,
	manageDocumentation,
	getActivity,
	manageFaqs,
	manageCGWalletHistory,
	manageCGWallets,
	loginUser2FA,
}) => {
	const {
		auth,
		errors,
		settings,
		notifications,
		success,
		category,
		biller,
		products,
		data,
		usecase,
		upgrade,
		network,
		transactions,
		wallet,
		bonus,
		commission,
		airtimes,
		converter,
		electricity,
		cables,
		activity,
		airtimes_pin,
		education,
		referral,
		stat,
		faqs,
		documentation,
		cgwallet,
		bulk_sms,
	} = useSelector(selectSlices, shallowEqual);

	let [stateName, setStateName] = useState("");

	let numberWithCommas = (x, a) => {
		if (!x) return;
		return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, a ? a : ",");
	};

	let nairaSign = <span className="fontInherit">&#8358;</span>;
	let nairaSignNeutral = "₦";

	let sidebarList = [
		{
			name: "Dashboard",
			url: "/dashboard",
			icon: <BiHomeAlt className="icon" size={24} />,
			show: true,
		},
		{
			name: "Transactions",
			url: "/transactions",
			icon: <GiChart className="icon" size={24} />,
			show: true,
		},
		{
			name: "Products",
			url: "/products",
			icon: <IoCardOutline className="icon" size={24} />,
			show: true,
		},
		{
			name: "Converter",
			url: "/converter",
			icon: <AiOutlineSwap className="icon" size={24} />,
			show: !["TEETOP DIGITAL"]?.includes(process.env.REACT_APP_NAME),
		},
		{
			name: "Notification",
			url: "/notifications",
			icon: <VscBellDot className="icon" size={24} />,
			show: true,
		},
		{
			name: "Wallet",
			url: "/wallets",
			icon: <GiWallet className="icon" size={24} />,
			show: true,
		},
		{
			name: "Faqs",
			url: "/faqs",
			icon: <FaQuestionCircle className="icon" size={24} />,
			show: true,
		},
		{
			name: "Activity",
			url: "/activities",
			icon: <TbActivity className="icon" size={24} />,
			show: true,
		},
		{
			name: "Api Documentation",
			url: "/documentation",
			icon: <BsCodeSlash className="icon" size={24} />,
			show: true,
		},
	];

	const state = {
		numberWithCommas,
		sidebarList,
		stateName,
		setStateName,
		nairaSign,
		nairaSignNeutral,
		auth,
		loginUser,
		logoutUser,
		errors,
		clearErrors,
		settings,
		updateUser,
		registerUser,
		notifications,
		success,
		restoreMsg,
		returnErrors,
		updatePassword,
		category,
		getCategory,
		biller,
		getBiller,
		products,
		getProducts,
		data,
		usecase,
		upgrade,
		network,
		transactions,
		wallet,
		getReload,
		buyServices,
		bonus,
		commission,
		airtimes,
		converter,
		electricity,
		converterServices,
		cables,
		getUseCase,
		getSettings,
		activity,
		getNotify,
		manageNotify,
		getServicesHistory,
		manageFundWallet,
		getWalletHistory,
		manageWallet,
		manageFundWalletFlutterwave,
		generateVirtual,
		getCards,
		manageFundWalletPaystack,
		airtimes_pin,
		education,
		manageUpgrade,
		referral,
		getReferrals,
		stat,
		faqs,
		manageWalletPin,
		documentation,
		manageDocumentation,
		getActivity,
		manageFaqs,
		manageCGWalletHistory,
		manageCGWallets,
		cgwallet,
		bulk_sms,
		loginUser2FA,
	};

	return <GlobalState.Provider value={state}>{children}</GlobalState.Provider>;
};

export default connect(null, {
	loginUser,
	clearErrors,
	logoutUser,
	updateUser,
	registerUser,
	restoreMsg,
	returnErrors,
	updatePassword,
	getCategory,
	getBiller,
	getProducts,
	getReload,
	buyServices,
	converterServices,
	getUseCase,
	getSettings,
	getNotify,
	manageNotify,
	getServicesHistory,
	manageFundWallet,
	getWalletHistory,
	manageWallet,
	manageFundWalletFlutterwave,
	generateVirtual,
	getCards,
	manageFundWalletPaystack,
	manageUpgrade,
	getReferrals,
	manageWalletPin,
	manageDocumentation,
	getActivity,
	manageFaqs,
	manageCGWalletHistory,
	manageCGWallets,
	loginUser2FA,
})(DataProvider);
