import {
	ADD_AIRTIME,
	ADD_BIZ,
	ADD_CABLE,
	ADD_DATA,
	ADD_ELECTRICITY,
	GENERATE_DOC,
	GENERATE_DOC_FAIL,
	GET_DOC,
	LOGOUT,
	SET_SUCCESS,
	SOCKET,
	SOCKET_ONLINE,
} from "@/Data/Actions/ActionTypes";
import axios from "axios";
import { toast } from "react-toastify";
import { returnErrors } from "@/Data/Reducer/ErrorReducer";

const initialState = {
	socket: null,
	user: [],
};

const socketReducer = (state = initialState, { type, payload }) => {
	switch (type) {
		case SOCKET:
			return {
				...state,
				socket: payload,
			};
		case SOCKET_ONLINE:
			return { ...state, user: payload };
		case LOGOUT:
			return initialState;
		default:
			return state;
	}
};

export default socketReducer;

export const socketProfile = socket => async dispatch => {
	dispatch({ type: SOCKET, payload: socket });
};

export const socketOnline = socket => async dispatch => {
	dispatch({ type: SOCKET_ONLINE, payload: socket });
};

export const socketTransaction = socket => async dispatch => {
	dispatch({
		type:
			socket?.type === "electricity"
				? ADD_ELECTRICITY
				: socket?.type === "biz"
				? ADD_BIZ
				: socket?.type === "airtime"
				? ADD_AIRTIME
				: socket?.type === "cables"
				? ADD_CABLE
				: socket?.type === "data"
				? ADD_DATA
				: null,
		payload: socket,
	});
};

const initialDoc = {
	doc: null,
	isGen: false,
};

export const docReducer = (state = initialDoc, { type, payload }) => {
	let data = payload?.data || payload;
	switch (type) {
		case GET_DOC:
			return {
				...state,
				doc: data,
			};
		case GENERATE_DOC:
			return { ...state, doc: data, isGen: true };
		case GENERATE_DOC_FAIL:
			return { ...state, isGen: false };
		case LOGOUT:
			return initialDoc;
		default:
			return state;
	}
};

export const manageDocumentation = data => async dispatch => {
	try {
		let res;
		if (data === "post") res = await axios.post(`/api/v1/keys`, { ...data });
		else res = await axios.get(`/api/v1/keys`, { ...data });
		dispatch({
			type: data === "post" ? GENERATE_DOC : GET_DOC,
			payload: res.data,
		});
		if (data === "post")
			dispatch({ type: SET_SUCCESS, payload: res?.data?.msg });
	} catch (err) {
		if (err) console.log(err.response?.data?.error, { err });
		if (err?.response?.status === 429 || err?.response?.status === 405)
			toast.error(err?.response?.data ? err?.response?.data : err?.message);
		let error = err.response?.data?.error;
		if (error && data === "post")
			dispatch(returnErrors({ error, status: err?.response?.status }));
		dispatch({ type: GENERATE_DOC_FAIL });
	}
};
