import axios from "axios";
import { toast } from "react-toastify";
import {
	GET_CABLES_TYPES,
	GET_CABLE_DIRECT_PACKAGE,
	GET_CABLE_DIRECT_PACKAGE_FAIL,
	GET_DATA_TO_BUY,
	GET_DATA_TO_BUY_FAIL,
	GET_EDUCATION_TO_BUY,
	GET_EDUCATION_TO_BUY_FAIL,
	GET_ELECTRICITY_TO_BUY,
	GET_ELECTRICITY_TO_BUY_FAIL,
} from "@/Data/Actions/ActionTypes";

export const getDataToBuy = () => async dispatch => {
	try {
		let res = await axios.get(`/api/v1/data`);

		dispatch({
			type: GET_DATA_TO_BUY,
			payload: res.data,
		});
	} catch (err) {
		if (err) console.log({ err });
		let error = err.response?.data?.error;
		console.log({ error });
		dispatch({
			type: GET_DATA_TO_BUY_FAIL,
		});
	}
};

export const getElectricityToBuy = () => async dispatch => {
	try {
		let res = await axios.get(`/api/v1/electricity`);

		dispatch({
			type: GET_ELECTRICITY_TO_BUY,
			payload: res.data,
		});
	} catch (err) {
		if (err) console.log({ err });
		let error = err.response?.data?.error;
		console.log({ error });
		dispatch({
			type: GET_ELECTRICITY_TO_BUY_FAIL,
		});
	}
};

export const getCablesPackages = () => async dispatch => {
	try {
		let res = await axios.get(`/api/v1/cables`);
		dispatch({
			type: GET_CABLE_DIRECT_PACKAGE,
			payload: res.data,
		});
	} catch (err) {
		if (err) console.log({ err });
		let error = err.response?.data?.error;
		if (error) console.log({ error });
		dispatch({
			type: GET_CABLE_DIRECT_PACKAGE_FAIL,
		});
	}
};

export const getCablesTypes = () => async dispatch => {
	try {
		let res = await axios.get(`/api/v1/cables/types`);

		dispatch({
			type: GET_CABLES_TYPES,
			payload: res.data,
		});
	} catch (err) {
		if (err) console.log(err.response?.data?.error, { err });
		if (err?.response?.status === 429 || err?.response?.status === 405)
			toast.error(err?.response?.data ? err?.response?.data : err?.message);
	}
};

export const getEducationToBuy = () => async dispatch => {
	try {
		let res = await axios.get(`/api/v1/education`);

		dispatch({
			type: GET_EDUCATION_TO_BUY,
			payload: res.data,
		});
	} catch (err) {
		if (err) console.log({ err });
		let error = err.response?.data?.error;
		console.log({ error });
		dispatch({
			type: GET_EDUCATION_TO_BUY_FAIL,
		});
	}
};
