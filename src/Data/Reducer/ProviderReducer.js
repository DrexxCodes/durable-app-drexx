import {
	ADD_BILLER,
	ADD_BILLER_FAIL,
	ADD_BILLER_FUNDING,
	ADD_BILLER_FUNDING_FAIL,
	ADD_CATEGORY,
	ADD_CATEGORY_FAIL,
	ADD_NETWORK,
	ADD_NETWORK_FAIL,
	ADD_PRODUCTS,
	ADD_PRODUCTS_FAIL,
	DELETE_BILLER,
	DELETE_CATEGORY,
	DELETE_NETWORK,
	DELETE_PRODUCTS,
	GET_BILLER,
	GET_BILLER_CHOOSEN,
	GET_BILLER_FAIL,
	GET_BILLER_FUNDING,
	GET_BILLER_HONOURWORLD,
	GET_BILLER_HUSMO,
	GET_BILLER_OGDAMS,
	GET_BILLER_RINGO,
	GET_BILLER_SMEPLUG,
	GET_BILLER_VTPASS,
	GET_CATEGORY,
	GET_CATEGORY_FAIL,
	GET_CHOSEN_SERVICES,
	GET_HONOURWORLD_DATA,
	GET_HUSMO,
	GET_MCD,
	GET_NETWORK,
	GET_OGDAMS,
	GET_PRODUCTS,
	GET_PRODUCTS_FAIL,
	GET_RINGO_DATA,
	GET_RPI_DATA,
	GET_RPI_DATA_PLAN,
	GET_UZOBEST,
	LOGOUT,
	SEARCH_BILLER,
	SEARCH_BILLER_FAIL,
	SEARCH_BILLER_LOADING,
	SEARCH_BILLER_RELOAD,
	SEARCH_CATEGORY,
	SEARCH_CATEGORY_FAIL,
	SEARCH_CATEGORY_LOADING,
	SEARCH_CATEGORY_RELOAD,
	SEARCH_PRODUCTS,
	SEARCH_PRODUCTS_FAIL,
	SEARCH_PRODUCTS_LOADING,
	SEARCH_PRODUCTS_RELOAD,
	UPDATE_BILLER,
	UPDATE_CATEGORY,
	UPDATE_NETWORK,
	UPDATE_PRODUCTS,
} from "@/Data/Actions/ActionTypes";
import { DeleteData, EditData } from "@/Data/Reducer/AuthReducer";

let initialStateA = {
	data: null,
	isAdded: false,
	isUpdated: false,
	isDeleted: false,
};

export const NetworkReducer = (state = initialStateA, action) => {
	let { type, payload } = action;
	let data = payload?.data ? payload?.data : payload;

	switch (type) {
		case GET_NETWORK:
			return {
				data,
			};
		case ADD_NETWORK:
			return {
				data: [data, ...state.data],
				isAdded: true,
			};
		case UPDATE_NETWORK:
			return {
				data: EditData(state?.data, data),
				isUpdated: true,
			};
		case DELETE_NETWORK:
			return {
				data: DeleteData(state.data, data),
				isDeleted: true,
			};
		case ADD_NETWORK_FAIL:
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

let initialState = {
	data: null,
};

export const ChoosenReducer = (state = initialState, action) => {
	let { type, payload } = action;
	let data = payload?.data ? payload?.data : payload;

	switch (type) {
		case GET_CHOSEN_SERVICES:
			return {
				data,
			};
		case LOGOUT:
			return initialState;
		default:
			return state;
	}
};

let initialStateH = {
	data: null,
};

export const HusmoReducer = (state = initialStateH, action) => {
	let { type, payload } = action;
	let data = payload?.data ? payload?.data : payload;

	switch (type) {
		case GET_HUSMO:
			return {
				data,
			};
		case LOGOUT:
			return initialStateH;
		default:
			return state;
	}
};

let initialStateR = {
	data: null,
};

export const RingoReducer = (state = initialStateR, action) => {
	let { type, payload } = action;
	let data = payload?.data ? payload?.data : payload;

	switch (type) {
		case GET_RINGO_DATA:
			return {
				data: data?.wallet?.wallet,
			};
		case LOGOUT:
			return initialStateR;
		default:
			return state;
	}
};

let initialStateMCD = {
	data: null,
};

export const MCDReducer = (state = initialStateMCD, action) => {
	let { type, payload } = action;
	let data = payload?.data ? payload?.data : payload;

	switch (type) {
		case GET_MCD:
			return {
				...state,
				data,
			};
		case LOGOUT:
			return initialStateMCD;
		default:
			return state;
	}
};

let initialState2 = {
	data: null,
};

export const OgdamsReducer = (state = initialState2, action) => {
	let { type, payload } = action;
	let data = payload?.data ? payload?.data : payload;

	switch (type) {
		case GET_OGDAMS:
			return {
				data: data?.msg,
			};
		case LOGOUT:
			return initialState;
		default:
			return state;
	}
};

let initialState3 = {
	data: null,
};

export const RPIDataReducer = (state = initialState3, action) => {
	let { type, payload } = action;
	let data = payload?.data ? payload?.data : payload;

	switch (type) {
		case GET_RPI_DATA:
			return {
				data,
			};
		case LOGOUT:
			return initialState;
		default:
			return state;
	}
};

let initialStateHon = {
	data: null,
};

export const HonourworldReducer = (state = initialStateHon, action) => {
	let { type, payload } = action;
	let data = payload?.data ? payload?.data : payload;

	switch (type) {
		case GET_HONOURWORLD_DATA:
			return {
				data,
			};
		case LOGOUT:
			return initialStateHon;
		default:
			return state;
	}
};

const initialState4 = {
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
	ogdams: null,
	ringo: null,
	smeplug: null,
	chosen: null,
	husmo: null,
	uzobest: null,
	honourworld: null,
	vtpass: null,
	rpi: null,
	funding: [],
	isFunded: false,
};

export const BillerReducer = (state = initialState4, action) => {
	const { type, payload } = action;
	let data = payload?.data ? payload?.data : payload;

	switch (type) {
		case SEARCH_BILLER:
			return {
				...state,
				isFound: true,
				searchLoading: false,
				mainSearch: data ? data : [],
				search: action.search,
				search_paginate: payload?.paginate,
			};
		case SEARCH_BILLER_FAIL:
			return {
				...state,
				searchLoading: false,
				mainSearch: state.mainSearch,
				search_paginate: state.search_paginate,
			};
		case SEARCH_BILLER_LOADING:
			return {
				...state,
				searchLoading: true,
			};
		case SEARCH_BILLER_RELOAD:
			return {
				...state,
				isFound: false,
				searchLoading: false,
			};
		case GET_BILLER:
			return {
				...state,
				isLoading: false,
				data: data ? data : [],
				paginate: payload?.paginate,
			};
		case GET_BILLER_FAIL:
			return {
				...state,
				isLoading: false,
			};
		case ADD_BILLER:
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
		case DELETE_BILLER:
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
		case ADD_BILLER_FAIL:
			return {
				...state,
				isLoading: false,
				isUpdated: false,
				isAdded: false,
				isDeleted: false,
			};
		case UPDATE_BILLER:
			return {
				...state,
				isUpdated: true,
				data: EditData(state?.data, data),
				mainSearch: EditData(state?.mainSearch, data),
			};
		case GET_BILLER_RINGO:
			return {
				...state,
				isLoading: false,
				ringo: data ? data : null,
			};
		case GET_BILLER_HUSMO:
			return {
				...state,
				isLoading: false,
				husmo: data ? data : null,
			};
		case GET_UZOBEST:
			return {
				...state,
				isLoading: false,
				uzobest: data ? data : null,
			};
		case GET_RPI_DATA_PLAN:
			return {
				...state,
				isLoading: false,
				rpi: data ? data : null,
			};
		case GET_BILLER_HONOURWORLD:
			return {
				...state,
				isLoading: false,
				honourworld: data ? data : null,
			};
		case GET_BILLER_VTPASS:
			return {
				...state,
				isLoading: false,
				vtpass: data ? data : null,
			};
		case GET_BILLER_OGDAMS:
			return {
				...state,
				isLoading: false,
				ogdams: data ? data : null,
			};
		case GET_BILLER_SMEPLUG:
			return {
				...state,
				isLoading: false,
				smeplug: data ? data : null,
			};
		case GET_BILLER_CHOOSEN:
			return {
				...state,
				isLoading: false,
				chosen: data ? data : null,
			};
		case GET_BILLER_FUNDING:
			return { ...state, funding: data };
		case ADD_BILLER_FUNDING:
			return { ...state, funding: [data, ...state.funding], isFunded: true };
		case ADD_BILLER_FUNDING_FAIL:
			return { ...state, isFunded: false };
		case LOGOUT:
			return initialState4;
		default:
			return state;
	}
};

const initialState5 = {
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

export const CategoryReducer = (state = initialState5, action) => {
	const { type, payload } = action;
	let data = payload?.data ? payload?.data : payload;

	switch (type) {
		case SEARCH_CATEGORY:
			return {
				...state,
				isFound: true,
				searchLoading: false,
				mainSearch: data ? data : [],
				search: action.search,
				search_paginate: payload?.paginate,
			};
		case SEARCH_CATEGORY_FAIL:
			return {
				...state,
				searchLoading: false,
				mainSearch: state.mainSearch,
				search_paginate: state.search_paginate,
			};
		case SEARCH_CATEGORY_LOADING:
			return {
				...state,
				searchLoading: true,
			};
		case SEARCH_CATEGORY_RELOAD:
			return {
				...state,
				isFound: false,
				searchLoading: false,
			};
		case GET_CATEGORY:
			return {
				...state,
				isLoading: false,
				data: data ? data : [],
				paginate: payload?.paginate,
			};
		case GET_CATEGORY_FAIL:
			return {
				...state,
				isLoading: false,
			};
		case ADD_CATEGORY:
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
		case DELETE_CATEGORY:
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
		case ADD_CATEGORY_FAIL:
			return {
				...state,
				isLoading: false,
				isUpdated: false,
				isAdded: false,
				isDeleted: false,
			};
		case UPDATE_CATEGORY:
			return {
				...state,
				isUpdated: true,
				data: EditData(state?.data, data),
				mainSearch: EditData(state?.mainSearch, data),
			};
		case LOGOUT:
			return initialState5;
		default:
			return state;
	}
};

const initialState6 = {
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

export const ProductReducer = (state = initialState6, action) => {
	const { type, payload } = action;
	let data = payload?.data ? payload?.data : payload;

	switch (type) {
		case SEARCH_PRODUCTS:
			return {
				...state,
				isFound: true,
				searchLoading: false,
				mainSearch: data ? data : [],
				search: action.search,
				search_paginate: payload?.paginate,
			};
		case SEARCH_PRODUCTS_FAIL:
			return {
				...state,
				searchLoading: false,
				mainSearch: state.mainSearch,
				search_paginate: state.search_paginate,
			};
		case SEARCH_PRODUCTS_LOADING:
			return {
				...state,
				searchLoading: true,
			};
		case SEARCH_PRODUCTS_RELOAD:
			return {
				...state,
				isFound: false,
				searchLoading: false,
			};
		case GET_PRODUCTS:
			return {
				...state,
				isLoading: false,
				data: data ? data : [],
				paginate: payload?.paginate,
			};
		case GET_PRODUCTS_FAIL:
			return {
				...state,
				isLoading: false,
			};
		case ADD_PRODUCTS:
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
		case DELETE_PRODUCTS:
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
		case ADD_PRODUCTS_FAIL:
			return {
				...state,
				isLoading: false,
				isUpdated: false,
				isAdded: false,
				isDeleted: false,
			};
		case UPDATE_PRODUCTS:
			return {
				...state,
				isUpdated: true,
				data: EditData(state?.data, data),
				mainSearch: EditData(state?.mainSearch, data),
			};
		case LOGOUT:
			return initialState6;
		default:
			return state;
	}
};
