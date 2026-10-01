import {
	ADD_DATA,
	ADD_DATA_BUNDLE,
	ADD_DATA_BUNDLE_FAIL,
	ADD_DATA_FAIL,
	DELETE_DATA_BUNDLE,
	DELETE_TRANSACTION,
	DELETE_TRANSACTION_FAIL,
	GET_DATA,
	GET_DATA_BUNDLE,
	GET_DATA_BUNDLE_FAIL,
	GET_DATA_FAIL,
	GET_DATA_TO_BUY,
	LOGOUT,
	SEARCH_DATA,
	SEARCH_DATA_BUNDLE,
	SEARCH_DATA_BUNDLE_FAIL,
	SEARCH_DATA_BUNDLE_LOADING,
	SEARCH_DATA_BUNDLE_RELOAD,
	SEARCH_DATA_FAIL,
	SEARCH_DATA_LOADING,
	SEARCH_DATA_RELOAD,
	UPDATE_DATA_BUNDLE,
	UPDATE_TRANSACTION,
} from "@/Data/Actions/ActionTypes";
import { DeleteData, EditData } from "@/Data/Reducer/AuthReducer";

const initialState = {
	isLoading: false,
	data: [],
	isAdded: false,
	isUpdated: false,
	paginate: null,
	isDeleted: null,
	isFound: null,
	searchLoading: null,
	mainSearch: [],
	search: "",
	search_paginate: null,
	dataToBuy: null,
};

const DataMainReducer = (state = initialState, action) => {
	const { type, payload } = action;
	let data = payload?.data ? payload?.data : payload;

	switch (type) {
		case GET_DATA_TO_BUY:
			return {
				...state,
				dataToBuy: data ? data : [],
			};
		case SEARCH_DATA:
			return {
				...state,
				isFound: true,
				searchLoading: false,
				mainSearch: data ? data : [],
				search: action.search,
				search_paginate: payload?.paginate,
			};
		case SEARCH_DATA_FAIL:
			return {
				...state,
				searchLoading: false,
				mainSearch: state.mainSearch,
				search_paginate: state.search_paginate,
			};
		case SEARCH_DATA_LOADING:
			return {
				...state,
				searchLoading: true,
			};
		case SEARCH_DATA_RELOAD:
			return {
				...state,
				isFound: false,
				searchLoading: false,
			};
		case GET_DATA:
			return {
				...state,
				isLoading: false,
				data: data ? data : [],
				paginate: payload?.paginate,
			};
		case GET_DATA_FAIL:
			return {
				...state,
				isLoading: false,
			};
		case ADD_DATA:
			return {
				...state,
				isAdded: true,
				data: [data, ...state?.data],
				paginate: {
					...state?.paginate,
					result: state?.paginate?.result + 1,
					total: state?.paginate?.total + 1,
				},
			};
		case DELETE_TRANSACTION:
			return {
				...state,
				mainSearch: DeleteData(state.mainSearch, payload),
				data: DeleteData(state.data, payload),
				isDeleted: true,
				paginate: {
					...state?.paginate,
					result: state?.paginate?.result - 1,
					total: state?.paginate?.total - 1,
				},
			};
		case DELETE_TRANSACTION_FAIL:
			return {
				...state,
				isDeleted: false,
			};
		case ADD_DATA_FAIL:
			return {
				...state,
				isLoading: false,
				isUpdated: false,
				isAdded: false,
				isDeleted: false,
			};
		case UPDATE_TRANSACTION:
			return {
				...state,
				isUpdated: true,
				data: EditData(state?.data, data),
				mainSearch: EditData(state?.mainSearch, data),
			};
		case LOGOUT:
			return initialState3;
		default:
			return state;
	}
};

export default DataMainReducer;

const initialState3 = {
	isLoading: false,
	data: [],
	isAdded: false,
	isUpdated: false,
	paginate: null,
	isDeleted: null,
	isFound: null,
	searchLoading: null,
	mainSearch: [],
	search: "",
	search_paginate: null,
};

export const DataBundleReducer = (state = initialState3, action) => {
	const { type, payload } = action;
	let data = payload?.data ? payload?.data : payload;

	switch (type) {
		case SEARCH_DATA_BUNDLE:
			return {
				...state,
				isFound: true,
				searchLoading: false,
				mainSearch: data ? data : [],
				search: action.search,
				search_paginate: payload?.paginate,
			};
		case SEARCH_DATA_BUNDLE_FAIL:
			return {
				...state,
				searchLoading: false,
				mainSearch: state.mainSearch,
				search_paginate: state.search_paginate,
			};
		case SEARCH_DATA_BUNDLE_LOADING:
			return {
				...state,
				searchLoading: true,
			};
		case SEARCH_DATA_BUNDLE_RELOAD:
			return {
				...state,
				isFound: false,
				searchLoading: false,
			};
		case GET_DATA_BUNDLE:
			return {
				...state,
				isLoading: false,
				data: data ? data : [],
				paginate: payload?.paginate,
			};
		case GET_DATA_BUNDLE_FAIL:
			return {
				...state,
				isLoading: false,
			};
		case ADD_DATA_BUNDLE:
			return {
				...state,
				isAdded: true,
				data: [data, ...state?.data],
				paginate: {
					...state?.paginate,
					result: state?.paginate?.result + 1,
					total: state?.paginate?.total + 1,
				},
			};
		case DELETE_DATA_BUNDLE:
			return {
				...state,
				isDeleted: true,
				data: DeleteData(state?.data, data),
				paginate: {
					...state?.paginate,
					result: state?.paginate?.result - 1,
					total: state?.paginate?.total - 1,
				},
			};
		case ADD_DATA_BUNDLE_FAIL:
			return {
				...state,
				isLoading: false,
				isUpdated: false,
				isAdded: false,
				isDeleted: false,
			};
		case UPDATE_DATA_BUNDLE:
			return {
				...state,
				isUpdated: true,
				data: EditData(state?.data, data),
				mainSearch: EditData(state?.mainSearch, data),
			};
		case LOGOUT:
			return initialState3;
		default:
			return state;
	}
};
