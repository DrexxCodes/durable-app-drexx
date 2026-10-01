import axios from "axios";
import { toast } from "react-toastify";
import { returnErrors } from "@/Data/Reducer/ErrorReducer";
import {
	GET_BILLER,
	GET_BILLER_FAIL,
	GET_CATEGORY,
	GET_CATEGORY_FAIL,
	GET_NETWORK,
	GET_PRODUCTS,
	GET_PRODUCTS_FAIL,
	SEARCH_BILLER,
	SEARCH_BILLER_FAIL,
	SEARCH_CATEGORY,
	SEARCH_CATEGORY_FAIL,
	SEARCH_PRODUCTS,
	SEARCH_PRODUCTS_FAIL,
} from "@/Data/Actions/ActionTypes";

export const getCategory = data => async dispatch => {
	try {
		let res = await axios.get(
			`/api/v1/category?type=all
			${!data?.limit ? "" : `&limit=${data.limit}`}
			${!data?.search ? "" : `&search=${data?.search}`}
			`
		);

		dispatch({
			type: data?.search ? SEARCH_CATEGORY : GET_CATEGORY,
			payload: res.data,
			search: data?.search ? data?.search : "",
		});
	} catch (err) {
		if (err) console.log({ err });
		let error = err.response?.data?.error;
		if (data?.search) {
			if (error) {
				dispatch(returnErrors({ error, status: err?.response?.status }));
				// error.forEach(error =>
				// 	error?.param
				// 		? error?.param !== "suggestion" &&
				// 		  toast.error(error.msg, { autoClose: false })
				// 		: toast.error(error.msg, { autoClose: false })
				// );
			}
		}
		dispatch({
			type: data?.search ? SEARCH_CATEGORY_FAIL : GET_CATEGORY_FAIL,
		});
	}
};

export const getBiller = data => async dispatch => {
	try {
		let res = await axios.get(
			`/api/v1/biller?type=all
			${!data?.limit ? "" : `&limit=${data.limit}`}
			${!data?.search ? "" : `&search=${data?.search}`}
			`
		);

		dispatch({
			type: data?.search ? SEARCH_BILLER : GET_BILLER,
			payload: res.data,
			search: data?.search ? data?.search : "",
		});
	} catch (err) {
		if (err) console.log({ err });
		let error = err.response?.data?.error;
		if (data?.search) {
			if (error) {
				dispatch(returnErrors({ error, status: err?.response?.status }));
				// error.forEach(error =>
				// 	error?.param
				// 		? error?.param !== "suggestion" &&
				// 		  toast.error(error.msg, { autoClose: false })
				// 		: toast.error(error.msg, { autoClose: false })
				// );
			}
		}
		dispatch({
			type: data?.search ? SEARCH_BILLER_FAIL : GET_BILLER_FAIL,
		});
	}
};

export const getProducts = data => async dispatch => {
	try {
		let res = await axios.get(
			`/api/v1/product?type=all
			${!data?.limit ? "" : `&limit=${data.limit}`}
			${!data?.search ? "" : `&search=${data?.search}`}
			`
		);

		dispatch({
			type: data?.search ? SEARCH_PRODUCTS : GET_PRODUCTS,
			payload: res.data,
			search: data?.search ? data?.search : "",
		});
	} catch (err) {
		if (err) console.log({ err });
		let error = err.response?.data?.error;
		if (data?.search) {
			if (error) {
				dispatch(returnErrors({ error, status: err?.response?.status }));
				// error.forEach(error =>
				// 	error?.param
				// 		? error?.param !== "suggestion" &&
				// 		  toast.error(error.msg, { autoClose: false })
				// 		: toast.error(error.msg, { autoClose: false })
				// );
			}
		}
		dispatch({
			type: data?.search ? SEARCH_PRODUCTS_FAIL : GET_PRODUCTS_FAIL,
		});
	}
};

export const getNetwork = () => async dispatch => {
	try {
		let res = await axios.get(`/api/v1/network`);

		dispatch({
			type: GET_NETWORK,
			payload: res.data,
		});
	} catch (err) {
		if (err) console.log(err.response?.data?.error, { err });
		if (err?.response?.status === 429 || err?.response?.status === 405)
			toast.error(err?.response?.data ? err?.response?.data : err?.message);
	}
};
