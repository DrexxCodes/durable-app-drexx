import axios from "axios";
import { toast } from "react-toastify";
import {
	ADD_UPGRADE,
	ADD_UPGRADE_FAIL,
	GET_UPGRADE,
	GET_UPGRADE_FAIL,
	GET_USECASE,
	LOGOUT,
	SET_SUCCESS,
	UPDATE_UPGRADE,
	UPDATE_USECASE,
	UPDATE_USECASE_FAIL,
} from "@/Data/Actions/ActionTypes";
import { returnErrors } from "@/Data/Reducer/ErrorReducer";
import { EditData } from "@/Data/Reducer/AuthReducer";

let initialState = {
	usecase: null,
	isUpdated: null,
};

const UseCaseReducer = (state = initialState, action) => {
	let { type, payload } = action;
	switch (type) {
		case GET_USECASE:
			// console.log({ payload });
			return { ...state, usecase: payload };
		case UPDATE_USECASE:
			return { ...state, usecase: payload, isUpdated: true };
		case UPDATE_USECASE_FAIL:
			return { ...state, isUpdated: false };
		case LOGOUT:
			return initialState;
		default:
			return state;
	}
};

export default UseCaseReducer;

export const getUseCase = data => async dispatch => {
	try {
		let res;
		if (!data) res = await axios.get(`/api/v1/usecase`);
		else res = await axios.post(`/api/v1/usecase`, { ...data });
		// console.log({ data: res?.data });
		dispatch({
			type: !data ? GET_USECASE : UPDATE_USECASE,
			payload: res.data.data,
		});
		if (data) dispatch({ type: SET_SUCCESS, payload: res?.data?.msg });
	} catch (err) {
		if (err) console.log(err.response?.data?.error, { err });
		if (err?.response?.status === 429 || err?.response?.status === 405)
			toast.error(err?.response?.data ? err?.response?.data : err?.message);
		let error = err.response?.data?.error;
		if (error) dispatch(returnErrors({ error, status: err?.response?.status }));
		dispatch({ type: UPDATE_USECASE_FAIL });
	}
};

let initialState2 = {
	upgrade: null,
	isUpdated: null,
	isAdded: false,
};

export const UpgradeReducer = (state = initialState2, action) => {
	let { type, payload } = action;
	switch (type) {
		case GET_UPGRADE:
			return { ...state, upgrade: payload };
		case UPDATE_UPGRADE:
			return {
				...state,
				upgrade: EditData(state.upgrade, payload),
				isUpdated: true,
			};
		case ADD_UPGRADE:
			return { ...state, isAdded: true };
		case ADD_UPGRADE_FAIL:
			return { ...state, isUpdated: false, isAdded: false };
		case LOGOUT:
			return initialState;
		default:
			return state;
	}
};

export const manageUpgrade = (data, id) => async dispatch => {
	try {
		let res;
		if (!data) res = await axios.get(`/api/v1/upgrade`);
		else
			res = await axios.post(
				`/api/v1/upgrade${data?._id ? `/${data?._id}` : ""}${
					id ? `/${id}` : ""
				}`,
				{ ...data }
			);

		dispatch({
			type: !data ? GET_UPGRADE : id ? UPDATE_UPGRADE : ADD_UPGRADE,
			payload: res.data.data,
		});
		if (data) dispatch({ type: SET_SUCCESS, payload: res?.data?.msg });
	} catch (err) {
		if (err) console.log(err.response?.data?.error, { err });
		if (err?.response?.status === 429 || err?.response?.status === 405)
			toast.error(err?.response?.data ? err?.response?.data : err?.message);
		let error = err.response?.data?.error;
		if (error) dispatch(returnErrors({ error, status: err?.response?.status }));
		dispatch({ type: data ? UPDATE_USECASE_FAIL : GET_UPGRADE_FAIL });
	}
};
