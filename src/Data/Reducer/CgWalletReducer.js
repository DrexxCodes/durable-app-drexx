import {
	ADD_CGWALLET_HISTORY,
	GET_CGWALLET,
	GET_CGWALLET_HISTORY_FAIL,
	GET_CGWALLET_HISTORY_LOADING,
	GET_CGWALLET_HISTORY_PURCHASE,
	GET_CGWALLET_HISTORY_USAGE,
	LOGOUT,
	SEARCH_CGWALLET_HISTORY,
	SEARCH_CGWALLET_HISTORY_FAIL,
	SEARCH_CGWALLET_HISTORY_LOADING,
	SEARCH_RELOAD,
	SET_SUCCESS,
} from "@/Data/Actions/ActionTypes";
import axios from "axios";
import { toast } from "react-toastify";
import { returnErrors } from "@/Data/Reducer/ErrorReducer";
import { getWalletBalance } from "@/Data/Actions/GeneralAction";

let initialStateH = {
	purchase: [],
	purchase_paginate: null,
	usage: [],
	usage_paginate: null,
	isAdded: false,
	isLoading: false,
	data: [],
};

export const CgWalletHistoryReducer = (state = initialStateH, action) => {
	let { type, payload } = action;
	let data = payload?.data ? payload?.data : payload;

	switch (type) {
		case GET_CGWALLET:
			return {
				...state,
				data,
			};
		case GET_CGWALLET_HISTORY_PURCHASE:
			return {
				...state,
				purchase: data,
				purchase_paginate: payload?.paginate,
				isLoading: false,
			};
		case GET_CGWALLET_HISTORY_USAGE:
			return {
				...state,
				usage: data,
				usage_paginate: payload?.paginate,
				isLoading: false,
			};
		case ADD_CGWALLET_HISTORY:
			return {
				...state,
				purchase: [data, ...state.purchase],
				isAdded: true,
			};
		case GET_CGWALLET_HISTORY_LOADING:
			return {
				...state,
				isLoading: true,
			};
		case GET_CGWALLET_HISTORY_FAIL:
			return {
				...state,
				isAdded: false,
				isLoading: false,
			};
		case SEARCH_RELOAD:
			return {
				...state,
				isFound: false,
				searchLoading: false,
			};
		case SEARCH_CGWALLET_HISTORY:
			return {
				...state,
				isFound: true,
				searchLoading: false,
				mainSearch: action?.search === state?.search ? data : state?.mainSearch,
				search_paginate:
					action?.search === state?.search
						? payload?.paginate
						: state?.search_paginate,
			};
		case SEARCH_CGWALLET_HISTORY_FAIL:
			return {
				...state,
				searchLoading: false,
				mainSearch: state.mainSearch,
				search_paginate: state.search_paginate,
			};
		case SEARCH_CGWALLET_HISTORY_LOADING:
			return {
				...state,
				search: action.search,
				searchLoading: true,
			};
		case LOGOUT:
			return initialStateH;
		default:
			return state;
	}
};

export const manageCGWallets = () => async dispatch => {
	try {
		let res = await axios.get(`/api/v1/cgwallet`);

		dispatch({
			type: GET_CGWALLET,
			payload: res.data?.data,
		});
	} catch (err) {
		if (err?.response?.status === 429 || err?.response?.status === 405)
			toast.error(err?.response?.data ? err?.response?.data : err?.message);
		console.log({ err });
	}
};

export const manageCGWalletHistory = (type, data) => async dispatch => {
	if (type !== "post") {
		if (data?.search) {
			dispatch({
				type: SEARCH_CGWALLET_HISTORY_LOADING,
				search: data?.search,
			});
		}
	}
	try {
		let res;
		if (type === "post") {
			res = await axios.post(`/api/v1/cgwallet/buy`, { ...data });
		} else {
			res = await axios.get(
				`/api/v1/cgwallet/history?type=${type || "credit"}
				${data?.limit ? `&limit=${data?.limit}` : ""}
				${data?.search ? `&search=${data?.search}` : ""}
				`
			);
		}

		dispatch({
			type:
				data?.search && type !== "post"
					? SEARCH_CGWALLET_HISTORY
					: type === "credit"
					? GET_CGWALLET_HISTORY_PURCHASE
					: type === "debit"
					? GET_CGWALLET_HISTORY_USAGE
					: type === "post"
					? ADD_CGWALLET_HISTORY
					: null,
			payload: res.data,
			search: data?.search
				? res?.data?.search
					? res?.data?.search
					: data?.search
				: "",
		});
		if (type === "post") {
			dispatch(getWalletBalance());
			dispatch({ type: SET_SUCCESS, payload: res?.data?.msg });
		}
	} catch (err) {
		if (err?.response?.status === 429 || err?.response?.status === 405)
			toast.error(err?.response?.data ? err?.response?.data : err?.message);
		console.log({ err });
		let error = err.response?.data?.error;
		if (error && type === "post") {
			dispatch(returnErrors({ error, status: err?.response?.status }));
		}
		dispatch({
			type: data?.search
				? SEARCH_CGWALLET_HISTORY_FAIL
				: GET_CGWALLET_HISTORY_FAIL,
		});
	}
};
