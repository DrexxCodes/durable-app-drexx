import {
	ADD_FAQS_FAIL,
	DATA_TRANSACTIONS_STAT,
	FIND_TRANSACTIONS_STAT,
	GET_FAQS,
	GET_MANUAL_BANKS,
	GET_PRIVACY_POLICY,
	GET_TERMS_CONDITIONS,
	LOGOUT,
	TRANSACTIONS_STAT,
	WALLET_PROVIDER_STAT,
} from "@/Data/Actions/ActionTypes";

let init2 = {
	data: [],
	transactions: null,
	finder: null,
	findLoad: false,
	dataFinder: null,
	banks: [],
};

export const ProviderStateReducer = (state = init2, action) => {
	let { type, payload } = action;
	let data = payload?.data ? payload?.data : payload;

	switch (type) {
		case WALLET_PROVIDER_STAT:
			return {
				...state,
				data,
			};
		case TRANSACTIONS_STAT:
			return {
				...state,
				transactions: data,
			};
		case DATA_TRANSACTIONS_STAT:
			return {
				...state,
				dataFinder: data,
			};
		case GET_MANUAL_BANKS:
			return {
				...state,
				banks: data,
			};
		case FIND_TRANSACTIONS_STAT:
			return {
				...state,
				finder: data,
				findLoad: true,
			};
		case LOGOUT:
			return init2;
		default:
			return state;
	}
};

let init = {
	data: [],
	isAdded: false,
	isDeleted: false,
	terms: [],
	privacy: [],
};

export const FaqsReducer = (state = init, action) => {
	let { type, payload } = action;
	let data = payload?.data ? payload?.data : payload;

	switch (type) {
		case GET_FAQS:
			return { ...state, data };
		case GET_TERMS_CONDITIONS:
			return { ...state, terms: data };
		case GET_PRIVACY_POLICY:
			return { ...state, privacy: data };
		case ADD_FAQS_FAIL:
			return { ...state, isAdded: false, isDeleted: false };
		case LOGOUT:
			return init;
		default:
			return state;
	}
};
