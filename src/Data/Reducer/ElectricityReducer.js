import {
	ADD_ELECTRICITY,
	ADD_ELECTRICITY_BUNDLE,
	ADD_ELECTRICITY_BUNDLE_FAIL,
	ADD_ELECTRICITY_FAIL,
	DELETE_ELECTRICITY_BUNDLE,
	DELETE_TRANSACTION,
	DELETE_TRANSACTION_FAIL,
	GET_ELECTRICITY,
	GET_ELECTRICITY_BUNDLE,
	GET_ELECTRICITY_BUNDLE_FAIL,
	GET_ELECTRICITY_DIRECT,
	GET_ELECTRICITY_FAIL,
	GET_ELECTRICITY_LOADING,
	GET_ELECTRICITY_TO_BUY,
	LOGOUT,
	SEARCH_ELECTRICITY,
	SEARCH_ELECTRICITY_BUNDLE,
	SEARCH_ELECTRICITY_BUNDLE_FAIL,
	SEARCH_ELECTRICITY_BUNDLE_LOADING,
	SEARCH_ELECTRICITY_BUNDLE_RELOAD,
	SEARCH_ELECTRICITY_FAIL,
	SEARCH_ELECTRICITY_LOADING,
	SEARCH_ELECTRICITY_RELOAD,
	UPDATE_ELECTRICITY_BUNDLE,
} from "@/Data/Actions/ActionTypes";
import { DeleteData, EditData } from "@/Data/Reducer/AuthReducer";

const initialState = {
	isLoading: false,
	electricity: [],
	electricity_direct: [],
	isAdded: false,
	isDeleted: false,
	isFound: null,
	searchLoading: null,
	mainSearch: [],
	search: "",
	search_paginate: null,
	electricityToBuy: null,
};
const ElectricityReducer = (state = initialState, action) => {
	const { type, payload } = action;
	let data = payload?.data ? payload?.data : payload;

	switch (type) {
		case GET_ELECTRICITY_TO_BUY:
			return {
				...state,
				electricityToBuy: data ? data : [],
			};
		case SEARCH_ELECTRICITY:
			return {
				...state,
				isFound: true,
				searchLoading: false,
				mainSearch: data,
				search: action.search,
				search_paginate: payload?.paginate,
			};
		case SEARCH_ELECTRICITY_FAIL:
			return {
				...state,
				searchLoading: false,
				mainSearch: state.mainSearch,
				search_paginate: state.search_paginate,
			};
		case SEARCH_ELECTRICITY_LOADING:
			return {
				...state,
				searchLoading: true,
			};
		case SEARCH_ELECTRICITY_RELOAD:
			return {
				...state,
				isFound: false,
				searchLoading: false,
			};
		case ADD_ELECTRICITY:
			return {
				...state,
				isAdded: true,
				electricity: [data, ...state.electricity],
				paginate: {
					...state?.paginate,
					result: state?.paginate?.result + 1,
					total: state?.paginate?.total + 1,
				},
			};
		case ADD_ELECTRICITY_FAIL:
			return {
				...state,
				isAdded: false,
				isDeleted: false,
			};
		case GET_ELECTRICITY:
			return {
				...state,
				isLoading: false,
				electricity: data,
				paginate: payload?.paginate,
			};
		case DELETE_TRANSACTION:
			return {
				...state,
				mainSearch: DeleteData(state.mainSearch, payload),
				electricity: DeleteData(state.electricity, payload),
				isDeleted: true,
			};
		case DELETE_TRANSACTION_FAIL:
			return {
				...state,
				isDeleted: false,
			};
		case GET_ELECTRICITY_DIRECT:
			return {
				...state,
				electricity_direct: data,
			};
		case GET_ELECTRICITY_FAIL:
			return {
				...state,
				isLoading: false,
			};
		case GET_ELECTRICITY_LOADING:
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

export default ElectricityReducer;

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

export const ElectricityBundleReducer = (state = initialState3, action) => {
	const { type, payload } = action;
	let data = payload?.data ? payload?.data : payload;

	switch (type) {
		case SEARCH_ELECTRICITY_BUNDLE:
			return {
				...state,
				isFound: true,
				searchLoading: false,
				mainSearch: data ? data : [],
				search: action.search,
				search_paginate: payload?.paginate,
			};
		case SEARCH_ELECTRICITY_BUNDLE_FAIL:
			return {
				...state,
				searchLoading: false,
				mainSearch: state.mainSearch,
				search_paginate: state.search_paginate,
			};
		case SEARCH_ELECTRICITY_BUNDLE_LOADING:
			return {
				...state,
				searchLoading: true,
			};
		case SEARCH_ELECTRICITY_BUNDLE_RELOAD:
			return {
				...state,
				isFound: false,
				searchLoading: false,
			};
		case GET_ELECTRICITY_BUNDLE:
			return {
				...state,
				isLoading: false,
				data: data ? data : [],
				paginate: payload?.paginate,
			};
		case GET_ELECTRICITY_BUNDLE_FAIL:
			return {
				...state,
				isLoading: false,
			};
		case ADD_ELECTRICITY_BUNDLE:
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
		case DELETE_ELECTRICITY_BUNDLE:
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
		case ADD_ELECTRICITY_BUNDLE_FAIL:
			return {
				...state,
				isLoading: false,
				isUpdated: false,
				isAdded: false,
				isDeleted: false,
			};
		case UPDATE_ELECTRICITY_BUNDLE:
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
