import axios from "axios";
import {
	ADD_BIZ,
	ADD_BIZ_FAIL,
	ADD_BULK_SMS,
	ADD_BULK_SMS_FAIL,
	DELETE_TRANSACTION,
	DELETE_TRANSACTION_FAIL,
	GET_ACTIVITY,
	GET_ACTIVITY_FAIL,
	GET_BIZ,
	GET_BIZ_FAIL,
	GET_BIZ_LOADING,
	GET_BULK_SMS,
	GET_BULK_SMS_FAIL,
	GET_BULK_SMS_LOADING,
	LOGOUT,
	SEARCH_ACTIVITY,
	SEARCH_ACTIVITY_FAIL,
	SEARCH_ACTIVITY_LOADING,
	SEARCH_ACTIVITY_RELOAD,
	SEARCH_BIZ,
	SEARCH_BIZ_FAIL,
	SEARCH_BIZ_LOADING,
	SEARCH_BIZ_RELOAD,
	SEARCH_BULK_SMS,
	SEARCH_BULK_SMS_FAIL,
	SEARCH_BULK_SMS_LOADING,
	SEARCH_RELOAD,
} from "@/Data/Actions/ActionTypes";
import { DeleteData } from "@/Data/Reducer/AuthReducer";
import { returnErrors } from "@/Data/Reducer/ErrorReducer";

const initialState = {
	isLoading: false,
	biz: [],
	isAdded: false,
	isDeleted: false,
	paginate: null,
	isFound: null,
	searchLoading: null,
	mainSearch: [],
	search: "",
	search_paginate: null,
};

const BizReducer = (state = initialState, action) => {
	const { type, payload } = action;
	let data = payload?.data ? payload?.data : payload;
	switch (type) {
		case SEARCH_BIZ:
			return {
				...state,
				isFound: true,
				searchLoading: false,
				mainSearch: data,
				search: action.search,
				search_paginate: payload?.paginate,
			};
		case SEARCH_BIZ_FAIL:
			return {
				...state,
				searchLoading: false,
				mainSearch: state.mainSearch,
				search_paginate: state.search_paginate,
			};
		case SEARCH_BIZ_LOADING:
			return {
				...state,
				searchLoading: true,
			};
		case SEARCH_BIZ_RELOAD:
			return {
				...state,
				isFound: false,
				searchLoading: false,
			};
		case ADD_BIZ:
			return {
				...state,
				isAdded: true,
				biz: [data, ...state.biz],
				paginate: {
					...state?.paginate,
					result: state?.paginate?.result + 1,
					total: state?.paginate?.total + 1,
				},
			};
		case ADD_BIZ_FAIL:
			return {
				...state,
				isAdded: false,
				isDeleted: false,
			};
		case GET_BIZ:
			return {
				...state,
				isLoading: false,
				biz: payload?.data,
				paginate: payload?.paginate,
			};
		case DELETE_TRANSACTION:
			return {
				...state,
				mainSearch: DeleteData(state.mainSearch, payload),
				biz: DeleteData(state.biz, payload),
				isDeleted: true,
			};
		case DELETE_TRANSACTION_FAIL:
			return {
				...state,
				isDeleted: false,
			};
		case GET_BIZ_FAIL:
			return {
				...state,
				isLoading: false,
			};
		case GET_BIZ_LOADING:
			return {
				...state,
				isLoading: true,
			};
		case LOGOUT:
			return initialState;
		default:
			return state;
	}
};

export default BizReducer;

let initAct = {
	data: [],
	paginate: null,
	isFound: null,
	searchLoading: null,
	mainSearch: [],
	search: "",
	search_paginate: null,
};

export const ActivityReducer = (state = initAct, action) => {
	const { type, payload } = action;
	let data = payload?.data ? payload?.data : payload;
	switch (type) {
		case SEARCH_ACTIVITY:
			return {
				...state,
				isFound: true,
				searchLoading: false,
				mainSearch: data,
				search: action.search,
				search_paginate: payload?.paginate,
			};
		case SEARCH_ACTIVITY_FAIL:
			return {
				...state,
				searchLoading: false,
				mainSearch: state.mainSearch,
				search_paginate: state.search_paginate,
			};
		case SEARCH_ACTIVITY_LOADING:
			return {
				...state,
				searchLoading: true,
			};
		case SEARCH_ACTIVITY_RELOAD:
			return {
				...state,
				isFound: false,
				searchLoading: false,
			};
		case GET_ACTIVITY:
			return {
				...state,
				isLoading: false,
				data: payload?.data,
				paginate: payload?.paginate,
			};
		case GET_ACTIVITY_FAIL:
			return {
				...state,
				isLoading: false,
			};
		case LOGOUT:
			return initAct;
		default:
			return state;
	}
};

export const getActivity = data => async dispatch => {
	try {
		let res = await axios.get(
			`/api/v1/activity?type=all
			${!data?.limit ? "" : `&limit=${data.limit}`}
			${!data?.search ? "" : `&search=${data?.search}`}
			`
		);
		dispatch({
			type: data?.search ? SEARCH_ACTIVITY : GET_ACTIVITY,
			payload: res.data,
			search: data?.search ? data?.search : "",
		});
	} catch (err) {
		if (err) console.log({ err });
		let error = err.response?.data?.error;
		if (data?.search) {
			if (error) {
				dispatch(returnErrors({ error, status: err?.response?.status }));
			}
		}
		dispatch({
			type: data?.search ? SEARCH_ACTIVITY_FAIL : GET_ACTIVITY_FAIL,
		});
	}
};

const initialStatePin = {
	isLoading: false,
	bulk: [],
	isAdded: false,
	isDeleted: false,
	paginate: null,
	isFound: null,
	searchLoading: null,
	mainSearch: [],
	search: "",
	search_paginate: null,
};

export const BulkSMSReducer = (state = initialStatePin, action) => {
	const { type, payload } = action;
	let data = payload?.data ? payload?.data : payload;
	switch (type) {
		case SEARCH_BULK_SMS:
			return {
				...state,
				isFound: true,
				searchLoading: false,
				mainSearch: data,
				search: action.search,
				search_paginate: payload?.paginate,
			};
		case SEARCH_BULK_SMS_FAIL:
			return {
				...state,
				searchLoading: false,
				mainSearch: state.mainSearch,
				search_paginate: state.search_paginate,
			};
		case SEARCH_BULK_SMS_LOADING:
			return {
				...state,
				searchLoading: true,
			};
		case SEARCH_RELOAD:
			return {
				...state,
				isFound: false,
				searchLoading: false,
			};
		case ADD_BULK_SMS:
			return {
				...state,
				isAdded: true,
				bulk: [data, ...state.bulk],
				paginate: {
					...state?.paginate,
					result: state?.paginate?.result + 1,
					total: state?.paginate?.total + 1,
				},
			};
		case ADD_BULK_SMS_FAIL:
			return {
				...state,
				isAdded: false,
				isDeleted: false,
			};
		case GET_BULK_SMS:
			return {
				...state,
				isLoading: false,
				bulk: payload?.data,
				paginate: payload?.paginate,
			};
		case DELETE_TRANSACTION:
			return {
				...state,
				mainSearch: DeleteData(state.mainSearch, payload),
				bulk: DeleteData(state.bulk, payload),
				isDeleted: true,
			};
		case DELETE_TRANSACTION_FAIL:
			return {
				...state,
				isDeleted: false,
			};
		case GET_BULK_SMS_FAIL:
			return {
				...state,
				isLoading: false,
			};
		case GET_BULK_SMS_LOADING:
			return {
				...state,
				isLoading: true,
			};
		case LOGOUT:
			return initialState;
		default:
			return state;
	}
};