import {
	ADD_CABLE,
	ADD_CABLES_TYPES,
	ADD_CABLES_TYPES_FAIL,
	ADD_CABLE_FAIL,
	DELETE_CABLES_TYPES,
	DELETE_TRANSACTION,
	DELETE_TRANSACTION_FAIL,
	GET_CABLE,
	GET_CABLES_TYPES,
	GET_CABLE_DIRECT_PACKAGE,
	GET_CABLE_FAIL,
	GET_CABLE_LOADING,
	LOGOUT,
	SEARCH_CABLE,
	SEARCH_CABLE_FAIL,
	SEARCH_CABLE_LOADING,
	SEARCH_CABLE_RELOAD,
	UPDATE_CABLES_TYPES,
} from "@/Data/Actions/ActionTypes";
import { DeleteData, EditData } from "@/Data/Reducer/AuthReducer";

const initialState = {
	isLoading: false,
	cable: [],
	cable_direct: [],
	cable_package: null,
	isAdded: false,
	isDeleted: false,
	isFound: null,
	searchLoading: null,
	mainSearch: [],
	search: "",
	search_paginate: null,
};
const CableReducer = (state = initialState, action) => {
	const { type, payload } = action;
	let data = payload?.data ? payload?.data : payload;

	switch (type) {
		case SEARCH_CABLE:
			return {
				...state,
				isFound: true,
				searchLoading: false,
				mainSearch: data,
				search: action.search,
				search_paginate: payload?.paginate,
			};
		case SEARCH_CABLE_FAIL:
			return {
				...state,
				searchLoading: false,
				mainSearch: state.mainSearch,
				search_paginate: state.search_paginate,
			};
		case SEARCH_CABLE_LOADING:
			return {
				...state,
				searchLoading: true,
			};
		case SEARCH_CABLE_RELOAD:
			return {
				...state,
				isFound: false,
				searchLoading: false,
			};
		case ADD_CABLE:
			return {
				...state,
				isAdded: true,
				cable: [data, ...state.cable],
				paginate: {
					...state?.paginate,
					result: state?.paginate?.result + 1,
					total: state?.paginate?.total + 1,
				},
			};
		case ADD_CABLE_FAIL:
			return {
				...state,
				isAdded: false,
				isDeleted: false,
			};
		case GET_CABLE:
			return {
				...state,
				isLoading: false,
				cable: data,
				paginate: payload?.paginate,
			};
		case DELETE_TRANSACTION:
			return {
				...state,
				mainSearch: DeleteData(state.mainSearch, payload),
				cable: DeleteData(state.cable, payload),
				isDeleted: true,
			};
		case DELETE_TRANSACTION_FAIL:
			return {
				...state,
				isDeleted: false,
			};
		case GET_CABLE_DIRECT_PACKAGE:
			return {
				...state,
				cable_package: data,
			};
		case GET_CABLES_TYPES:
			return {
				...state,
				cable_direct: data,
			};
		case ADD_CABLES_TYPES:
			return {
				...state,
				cable_direct: [data, ...state.cable_direct],
			};
		case UPDATE_CABLES_TYPES:
			return {
				...state,
				cable_direct: EditData(state?.cable_direct, data),
			};
		case DELETE_CABLES_TYPES:
			return {
				...state,
				cable_direct: DeleteData(state.cable_direct, data),
			};
		case GET_CABLE_FAIL:
			return {
				...state,
				isLoading: false,
			};
		case GET_CABLE_LOADING:
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

export default CableReducer;

let initialStateA = {
	data: null,
	isAdded: false,
	isUpdated: false,
	isDeleted: false,
};

export const CablesTypesReducer = (state = initialStateA, action) => {
	let { type, payload } = action;
	let data = payload?.data ? payload?.data : payload;

	switch (type) {
		case GET_CABLES_TYPES:
			return {
				data,
			};
		case ADD_CABLES_TYPES:
			return {
				data: [data, ...state.data],
				isAdded: true,
			};
		case UPDATE_CABLES_TYPES:
			return {
				data: EditData(state?.data, data),
				isUpdated: true,
			};
		case DELETE_CABLES_TYPES:
			return {
				data: DeleteData(state.data, data),
				isDeleted: true,
			};
		case ADD_CABLES_TYPES_FAIL:
			return {
				...state,
				isAdded: false,
				isUpdated: false,
				isDeleted: false,
			};
		case LOGOUT:
			return initialStateA;
		default:
			return state;
	}
};
