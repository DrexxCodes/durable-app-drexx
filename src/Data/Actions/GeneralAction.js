import axios from "axios";
import { toast } from "react-toastify";
import { returnErrors } from "@/Data/Reducer/ErrorReducer";
import {
	ADD_AIRTIME,
	ADD_AIRTIME_CONVERTER,
	ADD_AIRTIME_CONVERTER_FAIL,
	ADD_AIRTIME_FAIL,
	ADD_AIRTIME_PIN,
	ADD_AIRTIME_PIN_FAIL,
	ADD_BIZ,
	ADD_BIZ_FAIL,
	ADD_BULK_SMS,
	ADD_BULK_SMS_FAIL,
	ADD_CABLE,
	ADD_CABLE_FAIL,
	ADD_CONVERTER_NUMBER,
	ADD_CONVERTER_NUMBER_FAIL,
	ADD_DATA,
	ADD_DATA_FAIL,
	ADD_EDUCATION,
	ADD_EDUCATION_FAIL,
	ADD_ELECTRICITY,
	ADD_ELECTRICITY_FAIL,
	ADD_FUND,
	ADD_FUND_FAIL,
	FUND_WALLET,
	FUND_WALLET_FAIL,
	FUND_WALLET_FLUTTERWAVE,
	FUND_WALLET_FLUTTERWAVE_FAIL,
	GENERATE_VIRTUAL,
	GENERATE_VIRTUAL_FAIL,
	GET_AIRTIME,
	GET_AIRTIME_CONVERTER,
	GET_AIRTIME_CONVERTER_FAIL,
	GET_AIRTIME_FAIL,
	GET_AIRTIME_PIN,
	GET_AIRTIME_PIN_FAIL,
	GET_ALL_TRANSACTIONS,
	GET_ALL_TRANSACTIONS_FAIL,
	GET_BANKS,
	GET_BANKS_FAIL,
	GET_BIZ,
	GET_BIZ_FAIL,
	GET_BONUS,
	GET_BULK_SMS,
	GET_BULK_SMS_FAIL,
	GET_CABLE,
	GET_CABLE_FAIL,
	GET_CARDS,
	GET_CARDS_FAIL,
	GET_COMMISSION,
	GET_CONVERTER_NUMBER,
	GET_CONVERTER_NUMBER_FAIL,
	GET_DATA,
	GET_DATA_FAIL,
	GET_DAY_TRANSACTIONS,
	GET_DAY_TRANSACTIONS_FAIL,
	GET_EDUCATION,
	GET_EDUCATION_FAIL,
	GET_ELECTRICITY,
	GET_ELECTRICITY_FAIL,
	GET_GENERAL_COMMISSION,
	GET_GENERAL_REFERRAL,
	GET_MONTH_TRANSACTIONS,
	GET_MONTH_TRANSACTIONS_FAIL,
	GET_REFERRAL,
	GET_WALLET,
	GET_WALLET_BALANCE,
	GET_WALLET_BALANCE_FAIL,
	GET_WALLET_DETAILS,
	GET_WALLET_FAIL,
	GET_WALLET_STAT,
	GIVE_BONUS,
	GIVE_BONUS_FAIL,
	MOVE_BONUS,
	MOVE_BONUS_FAIL,
	MOVE_COMMISSION,
	MOVE_COMMISSION_FAIL,
	MOVE_REFERRAL,
	MOVE_REFERRAL_FAIL,
	SEARCH_AIRTIME,
	SEARCH_AIRTIME_FAIL,
	SEARCH_AIRTIME_LOADING,
	SEARCH_AIRTIME_PIN,
	SEARCH_AIRTIME_PIN_FAIL,
	SEARCH_AIRTIME_PIN_LOADING,
	SEARCH_BIZ,
	SEARCH_BIZ_FAIL,
	SEARCH_BIZ_LOADING,
	SEARCH_BULK_SMS,
	SEARCH_BULK_SMS_FAIL,
	SEARCH_BULK_SMS_LOADING,
	SEARCH_CABLE,
	SEARCH_CABLE_FAIL,
	SEARCH_CABLE_LOADING,
	SEARCH_DATA,
	SEARCH_DATA_FAIL,
	SEARCH_DATA_LOADING,
	SEARCH_EDUCATION,
	SEARCH_EDUCATION_FAIL,
	SEARCH_EDUCATION_LOADING,
	SEARCH_ELECTRICITY,
	SEARCH_ELECTRICITY_FAIL,
	SEARCH_ELECTRICITY_LOADING,
	SEARCH_TRANSACTION,
	SEARCH_TRANSACTION_FAIL,
	SEARCH_TRANSACTION_LOADING,
	SEARCH_WALLET,
	SEARCH_WALLET_FAIL,
	SEARCH_WALLET_LOADING,
	SET_SUCCESS,
	TRANSFER_FUND,
	TRANSFER_FUND_FAIL,
	UPDATE_CONVERTER_DETAIL,
	UPDATE_CONVERTER_DETAIL_FAIL,
	UPDATE_CONVERTER_NUMBER,
	UPDATE_CONVERTER_NUMBER_FAIL,
	UPDATE_WALLET,
	UPDATE_WALLET_FAIL,
	UPDATE_WALLET_FLUTTERWAVE,
	UPDATE_WALLET_FLUTTERWAVE_FAIL,
} from "@/Data/Actions/ActionTypes";
import { useURL, useURL2, useURL3 } from "@/Data/Config";

export const getServicesHistory = (type, data) => async dispatch => {
	try {
		if (data?.search) {
			dispatch({
				type:
					type === "cables"
						? SEARCH_CABLE_LOADING
						: type === "airtime"
						? SEARCH_AIRTIME_LOADING
						: type === "airtime_pin"
						? SEARCH_AIRTIME_PIN_LOADING
						: type === "data"
						? SEARCH_DATA_LOADING
						: type === "bulk_sms"
						? SEARCH_BULK_SMS_LOADING
						: type === "electricity"
						? SEARCH_ELECTRICITY_LOADING
						: type === "education"
						? SEARCH_EDUCATION_LOADING
						: type === "biz"
						? SEARCH_BIZ_LOADING
						: type === "all"
						? SEARCH_TRANSACTION_LOADING
						: null,
			});
		}
		let res = await axios.get(
			`/api/v1/transactions?type=${type}${
				data?.limit ? `&limit=${data?.limit}` : ""
			}
			${data?.user ? `&user=${data?.user}` : ""}
			${data?.search ? `&search=${data?.search}` : ""}
			${type === "all" && data?.streamline ? `&streamline=${data?.streamline}` : ""}${
				data?.filter ? data?.filter : ""
			}`
		);

		dispatch({
			type:
				type === "cables"
					? data?.search || data?.search
						? SEARCH_CABLE
						: GET_CABLE
					: type === "airtime"
					? data?.search || data?.search
						? SEARCH_AIRTIME
						: GET_AIRTIME
					: type === "airtime_pin"
					? data?.search || data?.search
						? SEARCH_AIRTIME_PIN
						: GET_AIRTIME_PIN
					: type === "data"
					? data?.search || data?.search
						? SEARCH_DATA
						: GET_DATA
					: type === "bulk_sms"
					? data?.search || data?.search
						? SEARCH_BULK_SMS
						: GET_BULK_SMS
					: type === "electricity"
					? data?.search || data?.search
						? SEARCH_ELECTRICITY
						: GET_ELECTRICITY
					: type === "education"
					? data?.search || data?.search
						? SEARCH_EDUCATION
						: GET_EDUCATION
					: type === "biz"
					? data?.search || data?.search
						? SEARCH_BIZ
						: GET_BIZ
					: type === "all"
					? data?.search || data?.search
						? SEARCH_TRANSACTION
						: data?.streamline === "day"
						? GET_DAY_TRANSACTIONS
						: data?.streamline === "month"
						? GET_MONTH_TRANSACTIONS
						: GET_ALL_TRANSACTIONS
					: null,
			payload: res.data,
			search: data?.search ? data?.search : "",
		});
	} catch (err) {
		if (err) console.log({ err });
		if (err) console.log(err?.response ? err?.response?.data : err?.message);
		dispatch({
			type:
				type === "cables"
					? data?.search
						? SEARCH_CABLE_FAIL
						: GET_CABLE_FAIL
					: type === "airtime"
					? data?.search
						? SEARCH_AIRTIME_FAIL
						: GET_AIRTIME_FAIL
					: type === "airtime_pin"
					? data?.search
						? SEARCH_AIRTIME_PIN_FAIL
						: GET_AIRTIME_PIN_FAIL
					: type === "data"
					? data?.search
						? SEARCH_DATA_FAIL
						: GET_DATA_FAIL
					: type === "electricity"
					? data?.search
						? SEARCH_ELECTRICITY_FAIL
						: GET_ELECTRICITY_FAIL
					: type === "bulk_sms"
					? data?.search
						? SEARCH_BULK_SMS_FAIL
						: GET_BULK_SMS_FAIL
					: type === "education"
					? data?.search
						? SEARCH_EDUCATION_FAIL
						: GET_EDUCATION_FAIL
					: type === "biz"
					? data?.search
						? SEARCH_BIZ_FAIL
						: GET_BIZ_FAIL
					: type === "all"
					? data?.search
						? SEARCH_TRANSACTION_FAIL
						: data?.streamline === "day"
						? GET_DAY_TRANSACTIONS_FAIL
						: data?.streamline === "month"
						? GET_MONTH_TRANSACTIONS_FAIL
						: GET_ALL_TRANSACTIONS_FAIL
					: null,
		});
	}
};

export const buyServices = (type, data) => async dispatch => {
	try {
		let res = await axios.post(
			`/api/v1/${type}/${
				type === "biz" ? "verify" : type === "bulk_sms" ? "send" : "buy"
			}`,
			{ ...data },
			{
				baseURL: useURL2 || useURL,
				// baseURL: type === "data" ? useURL2 || useURL : useURL,
			}
		);

		dispatch({
			type:
				type === "data"
					? ADD_DATA
					: type === "cables"
					? ADD_CABLE
					: type === "airtime"
					? ADD_AIRTIME
					: type === "airtime_pin"
					? ADD_AIRTIME_PIN
					: type === "electricity"
					? ADD_ELECTRICITY
					: type === "bulk_sms"
					? ADD_BULK_SMS
					: type === "education"
					? ADD_EDUCATION
					: type === "biz"
					? ADD_BIZ
					: null,
			payload: res.data,
		});
		dispatch(getWalletBalance());
		// dispatch(getWalletHistory("wallet"));
		// dispatch(getWalletHistory("commission"));
		dispatch({ type: SET_SUCCESS, payload: res?.data?.msg });
	} catch (err) {
		if (err) console.log({ err });
		if (err) console.log(err?.response ? err?.response?.data : err?.message);
		let error = err.response?.data?.error;
		if (error) dispatch(returnErrors({ error, status: err?.response?.status }));
		// error.forEach(error =>
		// 	error?.param
		// 		? error?.param !== "suggestion" &&
		// 		  toast.error(error.msg, { autoClose: false })
		// 		: toast.error(error.msg, { autoClose: false })
		// );
		dispatch({
			type:
				type === "data"
					? ADD_DATA_FAIL
					: type === "cables"
					? ADD_CABLE_FAIL
					: type === "airtime"
					? ADD_AIRTIME_FAIL
					: type === "airtime_pin"
					? ADD_AIRTIME_PIN_FAIL
					: type === "electricity"
					? ADD_ELECTRICITY_FAIL
					: type === "bulk_sms"
					? ADD_BULK_SMS_FAIL
					: type === "education"
					? ADD_EDUCATION_FAIL
					: type === "biz"
					? ADD_BIZ_FAIL
					: null,
		});
		if (err?.response?.status === 429 || err?.response?.status === 405)
			toast.error(err?.response?.data ? err?.response?.data : err?.message);
	}
};

export const manageFundWallet = (data, update) => async dispatch => {
	try {
		let res;
		if (data)
			if (update)
				res = await axios.put(
					`/api/v1/wallet/manage-paystack`,
					{ ...data },
					{
						baseURL: useURL3 || useURL,
						// baseURL: type === "data" ? useURL2 || useURL : useURL,
					}
				);
			else
				res = await axios.post(
					`/api/v1/wallet/manage-paystack`,
					{ ...data },
					{
						baseURL: useURL3 || useURL,
						// baseURL: type === "data" ? useURL2 || useURL : useURL,
					}
				);
		let newType;
		dispatch(getWalletBalance());
		// dispatch(getCards());
		if (update) newType = UPDATE_WALLET;
		else newType = FUND_WALLET;

		let dataNew = res?.data?.data?._id
			? res?.data?.data?.data
			: res?.data?.data;
		// console.log({ balance: res.data, dataNew });
		dispatch({
			type: newType,
			payload: data ? res?.data : res?.data?.data ? res?.data?.data : res?.data,
			data: dataNew,
		});

		if (dataNew?.status === "success")
			dispatch({ type: SET_SUCCESS, payload: res?.data?.msg });
		else toast?.success(res?.data?.msg, { autoClose: 5000 });
	} catch (err) {
		if (err) console.log({ err });
		if (err) console.log(err?.response ? err?.response?.data : err?.message);
		let newType;
		let error = err.response?.data?.error;

		if (error) dispatch(returnErrors({ error, status: err?.response?.status }));
		if (update) newType = UPDATE_WALLET_FAIL;
		else newType = FUND_WALLET_FAIL;

		dispatch({
			type: newType,
		});
		if (err?.response?.status === 429 || err?.response?.status === 405)
			toast.error(err?.response?.data ? err?.response?.data : err?.message);
	}
};

export const getWalletBalance = () => async dispatch => {
	try {
		let res = await axios.get(`/api/v1/wallet/manage-wallet-balance`, {
			baseURL: useURL3 || useURL,
			// baseURL: type === "data" ? useURL2 || useURL : useURL,
		});
		dispatch({
			type: GET_WALLET_BALANCE,
			payload: res?.data,
		});

		let res3 = await axios.get(`/api/v1/wallet/manage-wallet-stat`, {
			baseURL: useURL3 || useURL,
			// baseURL: type === "data" ? useURL2 || useURL : useURL,
		});

		dispatch({
			type: GET_WALLET_STAT,
			payload: res3?.data,
		});

		let res2 = await axios.get(`/api/v1/wallet/manage-wallet`, {
			baseURL: useURL3 || useURL,
			// baseURL: type === "data" ? useURL2 || useURL : useURL,
		});

		dispatch({
			type: GET_WALLET_DETAILS,
			payload: res2?.data,
		});
	} catch (err) {
		if (err) console.log({ err });
		if (err) console.log(err?.response ? err?.response?.data : err?.message);
		dispatch({
			type: GET_WALLET_BALANCE_FAIL,
		});
		if (err?.response?.status === 429 || err?.response?.status === 405)
			toast.error(err?.response?.data ? err?.response?.data : err?.message);
	}
};

export const getWalletHistory = (type, data) => async dispatch => {
	try {
		if (data?.search) dispatch({ type: SEARCH_WALLET_LOADING });
		let res = await axios.get(
			`/api/v1/wallet?type=${type}
			${data?.limit ? `&limit=${data?.limit}` : ""}
			${data?.user ? `&user=${data?.user}` : ""}
			${data?.general ? `&general=${data?.general}` : ""}
			${data?.search ? `&search=${data?.search}` : ""}
				`,
			{
				baseURL: useURL3 || useURL,
				// baseURL: type === "data" ? useURL2 || useURL : useURL,
			}
		);

		dispatch({
			type:
				type === "wallet"
					? data?.search
						? SEARCH_WALLET
						: GET_WALLET
					: type === "bonus"
					? GET_BONUS
					: type === "referral"
					? GET_REFERRAL
					: type === "commission"
					? data?.general
						? GET_GENERAL_COMMISSION
						: GET_COMMISSION
					: null,
			payload: res.data,
			search: data?.search ? data?.search : "",
		});
	} catch (err) {
		if (err) console.log({ err });
		if (err) console.log(err?.response ? err?.response?.data : err?.message);
		dispatch({
			type: data?.search ? SEARCH_WALLET_FAIL : GET_WALLET_FAIL,
		});
	}
};

export const manageWallet = (type, data, add) => async dispatch => {
	try {
		let res;
		if (add)
			res = await axios.post(
				`/api/v1/wallet/manage-${type}`,
				{ ...data },
				{
					baseURL: useURL3 || useURL,
					// baseURL: type === "data" ? useURL2 || useURL : useURL,
				}
			);
		else
			res = await axios.put(
				`/api/v1/wallet/manage-${type}`,
				{ ...data },
				{
					baseURL: useURL3 || useURL,
					// baseURL: type === "data" ? useURL2 || useURL : useURL,
				}
			);
		let newType;
		if (add) {
			if (type === "bonus") newType = GIVE_BONUS;
			if (type === "wallet") newType = ADD_FUND;
		} else {
			if (type === "bonus") newType = MOVE_BONUS;
			if (type === "wallet") newType = TRANSFER_FUND;
			if (type === "commission") newType = MOVE_COMMISSION;
			if (type === "referral") newType = MOVE_REFERRAL;
		}

		dispatch({
			type: newType,
			payload: res.data,
		});
		dispatch(getWalletHistory("wallet"));
		dispatch(getWalletHistory("bonus"));
		dispatch(getWalletHistory("commission"));
		dispatch(getWalletHistory("referral"));
		dispatch(getWalletBalance());
		// if (add) dispatch(loadAllUser());
		if (type === "wallet") {
			// dispatch(loadAllPending());
		}
		dispatch({ type: SET_SUCCESS, payload: res?.data?.msg });
	} catch (err) {
		if (err) console.log({ err });
		if (err) console.log(err?.response ? err?.response?.data : err?.message);
		let error = err.response?.data?.error;
		if (error) dispatch(returnErrors({ error, status: err?.response?.status }));

		let newType;
		if (add) {
			if (type === "bonus") newType = GIVE_BONUS_FAIL;
			if (type === "wallet") newType = ADD_FUND_FAIL;
		} else {
			if (type === "bonus") newType = MOVE_BONUS_FAIL;
			if (type === "wallet") newType = TRANSFER_FUND_FAIL;
			if (type === "commission") newType = MOVE_COMMISSION_FAIL;
			if (type === "referral") newType = MOVE_REFERRAL_FAIL;
		}
		dispatch({
			type: newType,
		});
		if (err?.response?.status === 429 || err?.response?.status === 405)
			toast.error(err?.response?.data ? err?.response?.data : err?.message);
	}
};

export const manageFundWalletFlutterwave = (data, type) => async dispatch => {
	try {
		let res = await axios.post(
			`/api/v1/wallet/manage-${type}`,
			{
				...data,
			},
			{
				baseURL: useURL3 || useURL,
				// baseURL: type === "data" ? useURL2 || useURL : useURL,
			}
		);

		let newType;

		dispatch(getWalletBalance());
		dispatch(getCards());
		newType = FUND_WALLET_FLUTTERWAVE;

		let dataNew = res?.data?.data?._id
			? res?.data?.data?.data
			: res?.data?.data;

		dispatch({
			type: newType,
			payload: res?.data,
			data: dataNew,
		});

		if (dataNew?.status === "successful")
			dispatch({ type: SET_SUCCESS, payload: res?.data?.msg });
		else toast?.success(res?.data?.msg, { autoClose: 5000 });
	} catch (err) {
		if (err) console.log({ err });
		if (err) console.log(err?.response ? err?.response?.data : err?.message);
		let newType;
		let error = err.response?.data?.error;

		if (error) dispatch(returnErrors({ error, status: err?.response?.status }));
		newType = FUND_WALLET_FLUTTERWAVE_FAIL;

		dispatch({
			type: newType,
		});
		if (err?.response?.status === 429 || err?.response?.status === 405)
			toast.error(err?.response?.data ? err?.response?.data : err?.message);
	}
};

export const manageFundWalletPaystack = (data, update) => async dispatch => {
	try {
		let res;

		if (update)
			res = await axios.put(
				`/api/v1/wallet/manage-paystack`,
				{ ...data },
				{
					baseURL: useURL3 || useURL,
					// baseURL: type === "data" ? useURL2 || useURL : useURL,
				}
			);
		else
			res = await axios.post(
				`/api/v1/wallet/manage-paystack`,
				{ ...data },
				{
					baseURL: useURL3 || useURL,
					// baseURL: type === "data" ? useURL2 || useURL : useURL,
				}
			);

		let newType;

		dispatch(getWalletBalance());
		dispatch(getCards());
		if (update) newType = UPDATE_WALLET_FLUTTERWAVE;
		else newType = FUND_WALLET_FLUTTERWAVE;

		let dataNew = res?.data?.data?._id
			? res?.data?.data?.data
			: res?.data?.data;
		console.log({ balance: res.data, dataNew });
		dispatch({
			type: newType,
			payload: res?.data?.data ? res?.data?.data : res?.data,
			data: dataNew,
		});

		if (dataNew?.status === "success")
			dispatch({ type: SET_SUCCESS, payload: res?.data?.msg });
		else toast?.success(res?.data?.msg, { autoClose: 5000 });
	} catch (err) {
		if (err) console.log({ err });
		if (err) console.log(err?.response ? err?.response?.data : err?.message);
		let newType;
		let error = err.response?.data?.error;

		if (error) dispatch(returnErrors({ error, status: err?.response?.status }));
		if (update) newType = UPDATE_WALLET_FLUTTERWAVE_FAIL;
		else newType = FUND_WALLET_FLUTTERWAVE_FAIL;

		dispatch({
			type: newType,
		});
		if (err?.response?.status === 429 || err?.response?.status === 405)
			toast.error(err?.response?.data ? err?.response?.data : err?.message);
	}
};

export const generateVirtual = data => async dispatch => {
	try {
		let res;
		if (data === "manage-budpay")
			res = await axios.put(`/api/v1/wallet/generate-virtual-account`);
		else if (data === "manage-payvessel")
			res = await axios.post(
				`/api/v1/wallet/generate-virtual-account-payvessel`
			);
		else if (data === "manage-paymentpoint")
			res = await axios.post(
				`/api/v1/wallet/generate-virtual-account-paymentpoint`
			);
		else if (data === "manage-billstack")
			res = await axios.post(
				`/api/v1/wallet/generate-virtual-account-billstack`
			);
		else if (data === "manage-palmpay")
			res = await axios.post(`/api/v1/wallet/generate-virtual-account-palmpay`);
		else res = await axios.post(`/api/v1/wallet/generate-virtual-account`);
		dispatch({
			type: GENERATE_VIRTUAL,
			payload: res?.data,
		});
		// toast?.success(res?.data?.msg, { autoClose: 5000 });
		dispatch({ type: SET_SUCCESS, payload: res?.data?.msg });
		dispatch(getWalletBalance());
	} catch (err) {
		if (err) console.log({ err });
		if (err) console.log(err?.response ? err?.response?.data : err?.message);
		let error = err.response?.data?.error;
		if (error) dispatch(returnErrors({ error, status: err?.response?.status }));

		dispatch({
			type: GENERATE_VIRTUAL_FAIL,
		});
		if (err?.response?.status === 429 || err?.response?.status === 405)
			toast.error(err?.response?.data ? err?.response?.data : err?.message);
	}
};

export const getCards = () => async dispatch => {
	try {
		let res = await axios.get(`/api/v1/wallet/manage-card`);
		dispatch({
			type: GET_CARDS,
			payload: res?.data,
		});
	} catch (err) {
		if (err) console.log({ err });
		if (err) console.log(err?.response ? err?.response?.data : err?.message);

		dispatch({
			type: GET_CARDS_FAIL,
		});
	}
};
export const getReferrals = data => async dispatch => {
	try {
		let res = await axios.get(
			`/api/v1/user/manage-referral?type=all${
				data?.limit ? `&limit=${data?.limit}` : ""
			}`
		);
		dispatch({
			type: GET_GENERAL_REFERRAL,
			payload: res?.data,
		});
	} catch (err) {
		if (err) console.log({ err });
		if (err) console.log(err?.response ? err?.response?.data : err?.message);

		dispatch({
			type: MOVE_REFERRAL_FAIL,
		});
	}
};

export const converterServices = (method, type, data, id) => async dispatch => {
	try {
		let res;
		// console.log({ data });
		if (method === "put") {
			res = await axios.put(`/api/v1/airtime/${type}${id ? `/${id}` : ""}`, {
				...data,
			});

			dispatch({
				type:
					type === "converter"
						? id
							? UPDATE_CONVERTER_DETAIL
							: ADD_AIRTIME_CONVERTER
						: type === "converter-number"
						? id
							? UPDATE_CONVERTER_NUMBER
							: ADD_CONVERTER_NUMBER
						: null,
				payload: res.data,
			});
		} else if (method === "post") {
			res = await axios.post(`/api/v1/airtime/${type}${id ? `/${id}` : ""}`, {
				...data,
			});

			dispatch({
				type:
					type === "converter"
						? id
							? UPDATE_CONVERTER_DETAIL
							: ADD_AIRTIME_CONVERTER
						: type === "converter-number"
						? id
							? UPDATE_CONVERTER_NUMBER
							: ADD_CONVERTER_NUMBER
						: null,
				payload: res.data,
			});
		} else {
			res = await axios.get(
				`/api/v1/airtime/${type}${data?.limit ? `?limit=${data?.limit}` : ""}`
			);

			dispatch({
				type:
					type === "converter"
						? GET_AIRTIME_CONVERTER
						: type === "banks"
						? GET_BANKS
						: type === "converter-number"
						? GET_CONVERTER_NUMBER
						: null,
				payload: res.data,
			});
		}
		// console.log({ data: res?.data });
		if (method === "post" || method === "put") {
			// toast.success(res?.data?.msg);
			dispatch({ type: SET_SUCCESS, payload: res?.data?.msg });
		}
	} catch (err) {
		if (err) console.log({ err });
		if (err) console.log(err?.response ? err?.response?.data : err?.message);
		let error = err.response?.data?.error;
		if (method === "post" || method === "put") {
			if (error)
				dispatch(returnErrors({ error, status: err?.response?.status }));
		}
		dispatch({
			type:
				method === "post" || method === "put"
					? type === "converter"
						? id
							? UPDATE_CONVERTER_DETAIL_FAIL
							: ADD_AIRTIME_CONVERTER_FAIL
						: type === "converter-number"
						? id
							? UPDATE_CONVERTER_NUMBER_FAIL
							: ADD_CONVERTER_NUMBER_FAIL
						: type === "converter"
						? GET_AIRTIME_CONVERTER_FAIL
						: type === "banks"
						? GET_BANKS_FAIL
						: type === "converter-number"
						? GET_CONVERTER_NUMBER_FAIL
						: null
					: null,
		});
		if (err?.response?.status === 429 || err?.response?.status === 405)
			toast.error(err?.response?.data ? err?.response?.data : err?.message);
	}
};
