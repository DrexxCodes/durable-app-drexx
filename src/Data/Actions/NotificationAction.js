import axios from "axios";
import { clearErrors, returnErrors } from "@/Data/Reducer/ErrorReducer";
import {
	SET_SUCCESS,
	UPDATE_NOTIFICATION,
	GET_MY_NOTIFICATONS,
	GET_NOTIFICATONS,
	GET_MY_NOTIFICATONS_FAIL,
	GET_NOTIFICATONS_FAIL,
	DELETE_NOTIFICATONS,
	UPDATE_NOTIFICATONS,
	ADD_NOTIFICATONS,
	ADD_NOTIFICATONS_FAIL,
	GET_MANUAL_BANKS,
	ADD_MANUAL_BANKS_FAIL,
	GET_FAQS,
	ADD_FAQS_FAIL,
	MANAGE_WALLET_PIN,
	TRANSFER_FUND_FAIL,
	GET_TERMS_CONDITIONS,
	GET_PRIVACY_POLICY,
	GET_NOTIFICATONS_INFORMED,
} from "@/Data/Actions/ActionTypes";
import { toast } from "react-toastify";
import { getWalletBalance } from "@/Data/Actions/GeneralAction";
import { useURL, useURL3 } from "@/Data/Config";

export const readNotification = data => async dispatch => {
	try {
		let res = await axios.put(`/api/v1/notification/${data}`);

		dispatch({
			type: UPDATE_NOTIFICATION,
			payload: res.data?.data,
		});
	} catch (err) {
		if (err) console.log({ err });
		if (err) console.log(err?.response ? err?.response?.data : err?.message);
	}
};

export const getNotify = (type, data) => async dispatch => {
	dispatch(clearErrors());
	try {
		let res = await axios.get(
			`/api/v1/notification?type=${type}${
				data?.limit ? `&limit=${data?.limit}` : ""
			}${data?.status ? `&status=${data?.status}` : ""}`
		);
		dispatch({
			type:
				type !== "incoming"
					? GET_MY_NOTIFICATONS
					: data?.status
					? GET_NOTIFICATONS_INFORMED
					: GET_NOTIFICATONS,
			payload: res.data,
		});
	} catch (err) {
		if (err) console.log(err.response?.data?.error, { err });
		if (err?.response?.status === 429 || err?.response?.status === 405)
			toast.error(err?.response?.data ? err?.response?.data : err?.message);
		dispatch({
			type:
				type !== "incoming" ? GET_MY_NOTIFICATONS_FAIL : GET_NOTIFICATONS_FAIL,
		});
	}
};

export const manageNotify = (data, id, prior) => async dispatch => {
	try {
		let res;
		if (!id) res = await axios.post(`/api/v1/notification`, { ...data });
		else if (prior === "delete")
			res = await axios.delete(`/api/v1/notification/${id}`);
		else if (prior) res = await axios.put(`/api/v1/notification/${id}`);
		else res = await axios.post(`/api/v1/notification/${id}`);
		dispatch({
			type: id
				? prior === "delete"
					? DELETE_NOTIFICATONS
					: UPDATE_NOTIFICATONS
				: ADD_NOTIFICATONS,
			payload: prior === "delete" ? data : res.data,
		});
		if (!id || prior === "delete")
			dispatch({ type: SET_SUCCESS, payload: res?.data?.msg });
	} catch (err) {
		if (err) console.log(err.response?.data?.error, { err });
		if (err?.response?.status === 429 || err?.response?.status === 405)
			toast.error(err?.response?.data ? err?.response?.data : err?.message);
		let error = err.response?.data?.error;
		if (error) dispatch(returnErrors({ error, status: err?.response?.status }));
		// error.forEach(error =>
		// 	error?.param
		// 		? error?.param !== "suggestion" &&
		// 		  toast.error(error.msg, { autoClose: false })
		// 		: toast.error(error.msg, { autoClose: false })
		// );
		dispatch({ type: ADD_NOTIFICATONS_FAIL });
	}
};

export const manageManualBanks = () => async dispatch => {
	try {
		let res = await axios.get(`/api/v1/user/manage-manual-bank`);

		dispatch({
			type: GET_MANUAL_BANKS,
			payload: res.data?.data,
		});
	} catch (err) {
		if (err?.response?.status === 429 || err?.response?.status === 405)
			toast.error(err?.response?.data ? err?.response?.data : err?.message);
		console.log({ err });
		let error = err.response?.data?.error;
		if (error) {
			dispatch(returnErrors({ error, status: err?.response?.status }));
		}
		dispatch({ type: ADD_MANUAL_BANKS_FAIL });
	}
};

export const manageFaqs = scene => async dispatch => {
	try {
		let res = await axios.get(`/api/v1/faqs${scene ? `?type=${scene}` : ""}`);

		dispatch({
			type:
				scene === "terms"
					? GET_TERMS_CONDITIONS
					: scene === "privacy"
					? GET_PRIVACY_POLICY
					: GET_FAQS,
			payload: res.data?.data,
		});
	} catch (err) {
		if (err?.response?.status === 429 || err?.response?.status === 405)
			toast.error(err?.response?.data ? err?.response?.data : err?.message);
		console.log({ err });
		let error = err.response?.data?.error;
		if (error) {
			dispatch(returnErrors({ error, status: err?.response?.status }));
		}
		dispatch({ type: ADD_FAQS_FAIL });
	}
};

export const manageWalletPin = (method, data) => async dispatch => {
	try {
		let res;
		if (method === "post")
			res = await axios.post(
				`/api/v1/wallet/manage-wallet-pin`,
				{ ...data },
				{
					baseURL: useURL3 || useURL,
					// baseURL: type === "data" ? useURL2 || useURL : useURL,
				}
			);
		else
			res = await axios.put(
				`/api/v1/wallet/manage-wallet-pin`,
				{ ...data },
				{
					baseURL: useURL3 || useURL,
					// baseURL: type === "data" ? useURL2 || useURL : useURL,
				}
			);
		dispatch({
			type: MANAGE_WALLET_PIN,
			payload: res.data,
		});
		dispatch(getWalletBalance());
		dispatch({ type: SET_SUCCESS, payload: res?.data?.msg });
	} catch (err) {
		if (err) console.log(err.response?.data?.error, { err });
		if (err?.response?.status === 429 || err?.response?.status === 405)
			toast.error(err?.response?.data ? err?.response?.data : err?.message);
		let error = err.response?.data?.error;
		if (error) dispatch(returnErrors({ error, status: err?.response?.status }));
		dispatch({ type: TRANSFER_FUND_FAIL });
	}
};