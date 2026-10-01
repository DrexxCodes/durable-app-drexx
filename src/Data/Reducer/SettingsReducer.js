import {
	ADD_NOTIFICATONS,
	ADD_NOTIFICATONS_FAIL,
	DELETE_NOTIFICATONS,
	GET_MY_NOTIFICATONS,
	GET_MY_NOTIFICATONS_FAIL,
	GET_NOTIFICATONS,
	GET_NOTIFICATONS_FAIL,
	GET_NOTIFICATONS_INFORMED,
	GET_SETTINGS,
	LOGOUT,
	SET_SUCCESS,
	UPDATE_NOTIFICATONS,
	UPDATE_SETTINGS,
	UPDATE_SETTINGS_FAIL,
} from "@/Data/Actions/ActionTypes";
import { EditData, DeleteData } from "@/Data/Reducer/AuthReducer";

import axios from "axios";
import { toast } from "react-toastify";
import { returnErrors } from "@/Data/Reducer/ErrorReducer";

let initialState = {
	settings: null,
	isUpdated: null,
};

const SettingsReducer = (state = initialState, action) => {
	let { type, payload } = action;
	switch (type) {
		case GET_SETTINGS:
			// console.log({ payload });
			return { ...state, settings: payload };
		case UPDATE_SETTINGS:
			return { ...state, settings: payload, isUpdated: true };
		case UPDATE_SETTINGS_FAIL:
			return { ...state, isUpdated: false };
		case LOGOUT:
			return initialState;
		default:
			return state;
	}
};

export default SettingsReducer;

export const getSettings = data => async dispatch => {
	try {
		let res;
		if (!data) res = await axios.get(`/api/v1/settings`);
		else res = await axios.post(`/api/v1/settings`, { ...data });
		// console.log({ data: res?.data });
		dispatch({
			type: !data ? GET_SETTINGS : UPDATE_SETTINGS,
			payload: res.data.data,
		});
		if (data) dispatch({ type: SET_SUCCESS, payload: res?.data?.msg });
	} catch (err) {
		if (err) console.log(err.response?.data?.error, { err });
		if (err?.response?.status === 429 || err?.response?.status === 405)
			toast.error(err?.response?.data ? err?.response?.data : err?.message);
		let error = err.response?.data?.error;
		if (error) dispatch(returnErrors({ error, status: err?.response?.status }));
		dispatch({ type: UPDATE_SETTINGS_FAIL });
	}
};

const initialState2 = {
	isLoading: false,
	outgoing: [],
	incoming: [],
	informed: [],
	isAdded: false,
	isUpdated: false,
	paginate: null,
	paginate2: null,
	paginate3: null,
	isDeleted: false,
};

export const NotificationReducer = (state = initialState2, action) => {
	const { type, payload } = action;
	let data = payload?.data ? payload?.data : payload;

	switch (type) {
		case GET_NOTIFICATONS:
			return {
				...state,
				isLoading: false,
				incoming: data ? data : [],
				paginate: payload?.paginate,
			};
		case GET_NOTIFICATONS_INFORMED:
			return {
				...state,
				isLoading: false,
				informed: data ? data : [],
				paginate3: payload?.paginate,
			};
		case GET_MY_NOTIFICATONS:
			return {
				...state,
				isLoading: false,
				outgoing: data ? data : [],
				paginate2: payload?.paginate,
			};
		case GET_NOTIFICATONS_FAIL:
		case GET_MY_NOTIFICATONS_FAIL:
			return {
				...state,
				isLoading: false,
			};
		case ADD_NOTIFICATONS:
			return {
				...state,
				isAdded: true,
				outgoing: [data, ...state?.outgoing],
				paginate: {
					...state?.paginate,
					result: state?.paginate?.result + 1,
					total: state?.paginate?.total + 1,
				},
			};
		case ADD_NOTIFICATONS_FAIL:
			return {
				...state,
				isLoading: false,
				isUpdated: false,
				isAdded: false,
				isDeleted: false,
			};
		case UPDATE_NOTIFICATONS:
			return {
				...state,
				isUpdated: true,
				incoming: EditData(state?.incoming, data),
			};
		case DELETE_NOTIFICATONS:
			return {
				...state,
				isDeleted: true,
				incoming: DeleteData(state?.incoming, payload),
				outgoing: DeleteData(state?.outgoing, payload),
			};
		case LOGOUT:
			return initialState;
		default:
			return state;
	}
};
