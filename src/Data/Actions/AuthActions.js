import { runPool } from "@/lib/taskPool";
import {
	LOGIN_USER,
	LOGIN_USER_FAIL,
	LOGOUT,
	TOKEN,
	GET_USER,
	GET_USER_LOADING,
	GET_USER_FAIL,
	GET_ERRORS_TEXT,
	REGISTER_USER,
	UPDATE_USER,
	REGISTER_USER_FAIL,
	UPDATE_USER_FAIL,
	UPDATE_PASSWORD,
	UPDATE_PASSWORD_FAIL,
	SET_SUCCESS,
	LOGIN_USER_2FA,
	TOKEN_2FA,
} from "@/Data/Actions/ActionTypes";
import { SetAuthToken, useURL, useURL4 } from "@/Data/Config";
import axios from "axios";
import { toast } from "react-toastify";
import { clearErrors, returnErrors } from "@/Data/Reducer/ErrorReducer";
import {
	getCablesPackages,
	getCablesTypes,
	getDataToBuy,
	getEducationToBuy,
	getElectricityToBuy,
} from "@/Data/Actions/DataActions";
import { getBiller, getCategory, getNetwork } from "@/Data/Actions/ProviderAction";
import { getSettings } from "@/Data/Reducer/SettingsReducer";
import { getUseCase } from "@/Data/Reducer/UseCaseReducer";
import { getServicesHistory, getWalletBalance } from "@/Data/Actions/GeneralAction";
import { manageFaqs, manageManualBanks, getNotify } from "@/Data/Actions/NotificationAction";

// LOGOUT
export const logoutUser = () => async dispatch => {
	try {
		dispatch({ type: LOGOUT });
		axios.post(
			`/api/v1/user/logout`,
			{},
			{
				baseURL: useURL4 || useURL,
				// baseURL: type === "data" ? useURL2 || useURL : useURL,
			}
		);
	} catch (err) {
		if (err) console.log(err.response?.data?.error, { err });
		if (err?.response?.status === 429) toast.error(err?.response?.data);
		dispatch({ type: GET_USER_FAIL });
	}
	dispatch(clearErrors());
};

// Login used to fire 16 requests at once. Browsers only run ~6 per host, so the
// dashboard's own data queued behind catalogs (plans, banks, FAQs...) the user may
// never open in this session. Same requests, now in priority order:
//  1. what the dashboard shows (balance, settings/switches, notifications, recent activity)
//  2. everything else, three at a time, most-used first
const bootstrapAfterLogin = dispatch => {
	const critical = [
		getWalletBalance(),
		getSettings(),
		getUseCase(),
		getNotify("incoming"),
		getServicesHistory("all"),
	].map(action => dispatch(action));

	const rest = [
		() => getNetwork(),
		() => getDataToBuy(),
		() => getCategory(),
		() => getBiller(),
		() => getServicesHistory("all", { streamline: "month" }),
		() => getServicesHistory("all", { streamline: "day" }),
		() => getCablesTypes(),
		() => getElectricityToBuy(),
		() => getEducationToBuy(),
		() => getCablesPackages(),
		() => manageManualBanks("get"),
		() => manageFaqs("faq"),
	];

	// start the rest once the critical set is done (or after 1.5s, whichever is first)
	Promise.race([
		Promise.allSettled(critical),
		new Promise(resolve => setTimeout(resolve, 1500)),
	]).then(() =>
		runPool(
			rest.map(make => async () => {
				if (!localStorage.getItem(TOKEN)) return; // logged out meanwhile
				await dispatch(make());
			}),
			3
		)
	);
};

// GET USER INFO
export const loadUser = () => async dispatch => {
	let token = localStorage.getItem(TOKEN);
	if (token) SetAuthToken(token);

	dispatch({ type: GET_USER_LOADING });
	dispatch(clearErrors());
	try {
		let res = await axios.get(`/api/v1/user`, {
			baseURL: useURL4 || useURL,
			// baseURL: type === "data" ? useURL2 || useURL : useURL,
		});
		if (res?.data?.data) {
			dispatch({
				type: GET_USER,
				payload: res.data,
			});
			bootstrapAfterLogin(dispatch);
		} else {
			dispatch({ type: GET_USER_FAIL });
		}
	} catch (err) {
		if (err) console.log(err.response?.data?.error, { err });
		if (err?.response?.status === 429) toast.error(err?.response?.data);
		dispatch({ type: GET_USER_FAIL });
		dispatch({
			type: GET_ERRORS_TEXT,
			payload: err?.response?.data?.error
				? err?.response?.data?.error?.[0]?.msg
				: err?.response?.data
				? err?.response?.data
				: err?.message,
		});
	}
};

// LOGIN ACTION
export const loginUser = userData => async dispatch => {
	try {
		let res = await axios.post(`/api/v1/user/login`, { ...userData });
		dispatch(clearErrors());

			dispatch({
				type:
					res?.data?.is2FAEnabled === "enable" ? LOGIN_USER_2FA : LOGIN_USER,
				is2FAType:
					res?.data?.is2FAEnabled === "enable" ? res?.data?.is2FAType : null,
				payload: res.data,
			});
			if (res?.data?.is2FAEnabled !== "enable") dispatch(loadUser());
			toast.success(res.data.msg, { autoClose: 5000 });
		
	} catch (err) {
		if (err?.response?.status === 429 || err?.response?.status === 405)
			toast.error(err?.response?.data ? err?.response?.data : err?.message);
		console.log({ err });
		let error = err.response?.data?.error;
		if (error) {
			dispatch(returnErrors({ error, status: err?.response?.status }));
		}
		dispatch({ type: LOGIN_USER_FAIL });
	}
};

export const loginUser2FA = userData => async dispatch => {
	try {
		let res = await axios.put(
			`/api/v1/user/is2fa-authenticate`,
			{ ...userData },
			{
				headers: {
					Authorization: localStorage.getItem(TOKEN_2FA),
				},
			}
		);
		dispatch(clearErrors());

			dispatch({
				type:
					res?.data?.is2FAEnabled === "enable" ? LOGIN_USER_2FA : LOGIN_USER,
				payload: res.data,
			});
			if (res?.data?.is2FAEnabled !== "enable") dispatch(loadUser());
			toast.success(res.data.msg, { autoClose: 5000 });
		
	} catch (err) {
		if (err?.response?.status === 429 || err?.response?.status === 405)
			toast.error(err?.response?.data ? err?.response?.data : err?.message);
		console.log({ err });
		let error = err.response?.data?.error;
		if (error) {
			dispatch(returnErrors({ error, status: err?.response?.status }));
		}
		dispatch({ type: LOGIN_USER_FAIL });
	}
};

// REGISTER ACTION
export const registerUser = userData => async dispatch => {
	dispatch(clearErrors());
	console.log({ userData });
	try {
		var res = await axios.post(
			"/api/v1/user",
			{ ...userData },
			{
				baseURL: useURL4 || useURL,
				// baseURL: type === "data" ? useURL2 || useURL : useURL,
			}
		);

		dispatch({
			type: REGISTER_USER,
			payload: res.data,
		});
		toast.success(res.data.msg, { autoClose: 5000 });
	} catch (err) {
		if (err?.response?.status === 429 || err?.response?.status === 405)
			toast.error(err?.response?.data ? err?.response?.data : err?.message);
		console.log({ err });
		let error = err.response?.data?.error;
		if (error) {
			dispatch(returnErrors({ error, status: err?.response?.status }));
		}
		dispatch({ type: REGISTER_USER_FAIL });
	}
};

export const updatePassword = userData => async dispatch => {
	dispatch(clearErrors());

	try {
		var res = await axios.put(
			`/api/v1/user/update-password`,
			{ ...userData },
			{
				baseURL: useURL4 || useURL,
				// baseURL: type === "data" ? useURL2 || useURL : useURL,
			}
		);

		dispatch({
			type: UPDATE_PASSWORD,
			payload: res.data,
		});
		dispatch({ type: SET_SUCCESS, payload: res?.data?.msg });
	} catch (err) {
		if (err?.response?.status === 429 || err?.response?.status === 405)
			toast.error(err?.response?.data ? err?.response?.data : err?.message);
		console.log({ err });
		let error = err.response?.data?.error;
		if (error) {
			dispatch(returnErrors({ error, status: err?.response?.status }));
		}
		dispatch({ type: UPDATE_PASSWORD_FAIL });
	}
};

export const updateUser = (userData, type) => async dispatch => {
	dispatch(clearErrors());

	try {
		var avatar, res;
		if (type === "profile-image") {
			let media = await imageUpload([userData.logo]);
			avatar = media[0];
			// console.log({ avatar, media, userData });
			res = await axios.put(
				`/api/v1/user/update-avatar`,
				{
					...userData,
					avatar,
				},
				{
					baseURL: useURL4 || useURL,
					// baseURL: type === "data" ? useURL2 || useURL : useURL,
				}
			);
		} else {
			res = await axios.put(
				`/api/v1/user`,
				{ ...userData },
				{
					baseURL: useURL4 || useURL,
					// baseURL: type === "data" ? useURL2 || useURL : useURL,
				}
			);
		}

		dispatch({
			type: UPDATE_USER,
			payload: res.data,
		});
		dispatch({ type: SET_SUCCESS, payload: res?.data?.msg });
	} catch (err) {
		if (err?.response?.status === 429 || err?.response?.status === 405)
			toast.error(err?.response?.data ? err?.response?.data : err?.message);
		console.log({ err });
		let error = err.response?.data?.error;
		if (error) {
			dispatch(returnErrors({ error, status: err?.response?.status }));
		}
		dispatch({ type: UPDATE_USER_FAIL });
	}
};

export const imageUpload = async images => {
	let imgArr = [];
	for (const item of images) {
		// console.log({ item });
		let post = new FormData();
		post.append(`file`, item);

		let res = await axios.post(`/api/v1/file`, post, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
		const data = await res.data?.data;

		Array.isArray(data) ? (imgArr = [...imgArr, ...data]) : imgArr.push(data);
	}
	return imgArr;
};
