import {
	ADD_AIRTIME,
	ADD_BIZ,
	ADD_CABLE,
	ADD_DATA,
	ADD_ELECTRICITY,
	DELETE_MULTIPLE_TRANSACTION,
	DELETE_TRANSACTION,
	DELETE_TRANSACTION_FAIL,
	GET_ALL_TRANSACTIONS,
	GET_DATA_TRANSACTIONS,
	GET_DAY_TRANSACTIONS,
	GET_MONTH_TRANSACTIONS,
	GET_MY_DAY_TRANSACTIONS,
	GET_MY_MONTH_TRANSACTIONS,
	GET_MY_TRANSACTIONS,
	GET_NETWORK,
	GET_NETWORK_FAIL,
	GET_NETWORK_LOADING,
	LOGOUT,
	MANUAL_TRANSACTION,
	MANUAL_TRANSACTION_FAIL,
	PENDING_TRANSACTION,
	SEARCH_MY_TRANSACTION,
	SEARCH_MY_TRANSACTION_FAIL,
	SEARCH_MY_TRANSACTION_LOADING,
	SEARCH_MY_TRANSACTION_RELOAD,
	SEARCH_TRANSACTION,
	SEARCH_TRANSACTION_FAIL,
	SEARCH_TRANSACTION_LOADING,
	SEARCH_TRANSACTION_PENDING,
	SEARCH_TRANSACTION_PENDING_FAIL,
	SEARCH_TRANSACTION_PENDING_LOADING,
	SEARCH_TRANSACTION_RELOAD,
	UPDATE_MULTIPLE_TRANSACTION,
	UPDATE_TRANSACTION,
	UPDATE_TRANSACTION_FAIL,
} from "@/Data/Actions/ActionTypes";
import { DeleteData, EditData } from "@/Data/Reducer/AuthReducer";

const initialState = {
	isLoading: false,
	networks: [],
	transactions: [],
	paginate: null,
	day_transactions: [],
	day_paginate: null,
	month_transactions: [],
	month_paginate: null,
	my_transactions: [],
	my_paginate: null,
	day_my_transactions: [],
	day_my_paginate: null,
	month_my_transactions: [],
	month_my_paginate: null,
	data: [],
	paginate_data: null,
	isFound: null,
	searchLoading: null,
	mainSearch: [],
	search: "",
	search_paginate: null,
	my_isFound: null,
	my_searchLoading: null,
	my_mainSearch: [],
	my_search: "",
	my_search_paginate: null,
	isDeleted: false,
	isManual: false,
	isUpdated: false,
};

const GeneralReducer = (state = initialState, action) => {
	const { type, payload } = action;
	let data = payload?.data ? payload?.data : payload;

	switch (type) {
		case UPDATE_MULTIPLE_TRANSACTION:
			let data1 = [],
				data2 = [],
				data3 = [],
				data4 = [],
				data5 = [],
				data6 = [],
				data7 = [],
				data8 = [];
			for (let j = 0; j < payload.length; j++) {
				data1 = EditData(state?.mainSearch, payload?.[j]);
				data2 = EditData(state?.my_mainSearch, payload?.[j]);
				data3 = EditData(state?.transactions, payload?.[j]);
				data4 = EditData(state?.my_transactions, payload?.[j]);
				data5 = EditData(state?.day_transactions, payload?.[j]);
				data6 = EditData(state?.month_transactions, payload?.[j]);
				data7 = EditData(state?.day_my_transactions, payload?.[j]);
				data8 = EditData(state?.month_my_transactions, payload?.[j]);
			}
			return {
				...state,
				mainSearch: data1,
				my_mainSearch: data2,
				transactions: data3,
				my_transactions: data4,
				isUpdated: true,
				day_transactions: data5,
				month_transactions: data6,
				day_my_transactions: data7,
				month_my_transactions: data8,
			};
		case UPDATE_TRANSACTION:
			return {
				...state,
				mainSearch: EditData(state.mainSearch, payload),
				my_mainSearch: EditData(state.my_mainSearch, payload),
				transactions: EditData(state.transactions, payload),
				my_transactions: EditData(state.my_transactions, payload),
				day_transactions: EditData(state.day_transactions, payload),
				day_my_transactions: EditData(state.day_my_transactions, payload),
				month_transactions: EditData(state.month_transactions, payload),
				month_my_transactions: EditData(state.month_my_transactions, payload),
				isUpdated: true,
			};
		case UPDATE_TRANSACTION_FAIL:
			return {
				...state,
				isUpdated: false,
			};
		case DELETE_MULTIPLE_TRANSACTION:
			let dati1 = [],
				dati2 = [],
				dati3 = [],
				dati4 = [],
				dati5 = [],
				dati6 = [],
				dati7 = [],
				dati8 = [];
			for (let j = 0; j < payload.length; j++) {
				dati1 = DeleteData(state?.mainSearch, payload?.[j]);
				dati2 = DeleteData(state?.my_mainSearch, payload?.[j]);
				dati3 = DeleteData(state?.transactions, payload?.[j]);
				dati4 = DeleteData(state?.my_transactions, payload?.[j]);
				dati5 = DeleteData(state?.day_transactions, payload?.[j]);
				dati6 = DeleteData(state?.month_transactions, payload?.[j]);
				dati7 = DeleteData(state?.day_my_transactions, payload?.[j]);
				dati8 = DeleteData(state?.month_my_transactions, payload?.[j]);
			}
			return {
				...state,
				mainSearch: dati1,
				my_mainSearch: dati2,
				transactions: dati3,
				my_transactions: dati4,
				day_transactions: dati5,
				month_transactions: dati6,
				day_my_transactions: dati7,
				month_my_transactions: dati8,
				isDeleted: true,
			};
		case DELETE_TRANSACTION:
			return {
				...state,
				mainSearch: DeleteData(state.mainSearch, payload),
				my_mainSearch: DeleteData(state.my_mainSearch, payload),
				transactions: DeleteData(state.transactions, payload),
				my_transactions: DeleteData(state.my_transactions, payload),
				day_transactions: DeleteData(state.day_transactions, payload),
				day_my_transactions: DeleteData(state.day_my_transactions, payload),
				month_transactions: DeleteData(state.month_transactions, payload),
				month_my_transactions: DeleteData(state.month_my_transactions, payload),
				isDeleted: true,
			};
		case DELETE_TRANSACTION_FAIL:
			return {
				...state,
				isDeleted: false,
			};
		case SEARCH_MY_TRANSACTION:
			return {
				...state,
				my_isFound: true,
				my_searchLoading: false,
				my_mainSearch: data,
				my_search: action.search,
				my_search_paginate: payload?.paginate,
			};
		case SEARCH_MY_TRANSACTION_FAIL:
			return {
				...state,
				my_isFound: false,
				my_searchLoading: false,
				my_mainSearch: null,
				my_search: "",
				my_search_paginate: null,
			};
		case SEARCH_MY_TRANSACTION_LOADING:
			return {
				...state,
				my_searchLoading: true,
			};
		case SEARCH_MY_TRANSACTION_RELOAD:
			return {
				...state,
				my_isFound: false,
				my_searchLoading: false,
			};
		case SEARCH_TRANSACTION:
			return {
				...state,
				isFound: true,
				searchLoading: false,
				mainSearch: data,
				search: action.search,
				search_paginate: payload?.paginate,
			};
		case SEARCH_TRANSACTION_FAIL:
			return {
				...state,
				isFound: false,
				searchLoading: false,
				mainSearch: null,
				search: "",
				search_paginate: null,
			};
		case SEARCH_TRANSACTION_LOADING:
			return {
				...state,
				searchLoading: true,
			};
		case SEARCH_TRANSACTION_RELOAD:
			return {
				...state,
				isFound: false,
				searchLoading: false,
			};
		case GET_NETWORK:
			return {
				...state,
				isLoading: false,
				networks: data,
			};
		case GET_DATA_TRANSACTIONS:
			return {
				...state,
				data,
				paginate_data: payload?.paginate,
			};
		case GET_ALL_TRANSACTIONS:
			return {
				...state,
				transactions: data,
				paginate: payload?.paginate,
			};
		case GET_DAY_TRANSACTIONS:
			return {
				...state,
				day_transactions: data,
				day_paginate: payload?.paginate,
			};
		case GET_MONTH_TRANSACTIONS:
			return {
				...state,
				month_transactions: data,
				month_paginate: payload?.paginate,
			};
		case GET_MY_TRANSACTIONS:
			return {
				...state,
				my_transactions: data,
				my_paginate: payload?.paginate,
			};
		case GET_MY_DAY_TRANSACTIONS:
			return {
				...state,
				day_my_transactions: data,
				day_my_paginate: payload?.paginate,
			};
		case GET_MY_MONTH_TRANSACTIONS:
			return {
				...state,
				month_my_transactions: data,
				month_my_paginate: payload?.paginate,
			};
		case ADD_AIRTIME:
		case ADD_CABLE:
		case ADD_ELECTRICITY:
		case ADD_BIZ:
			return {
				...state,
				transactions: [data, ...state.transactions],
				paginate: {
					...state?.paginate,
					result: state?.paginate?.result + 1,
					total: state?.paginate?.total + 1,
				},
				day_transactions: [data, ...state.day_transactions],
				day_paginate: {
					...state?.day_paginate,
					result: state?.day_paginate?.result + 1,
					total: state?.day_paginate?.total + 1,
				},
				month_transactions: [data, ...state.month_transactions],
				month_paginate: {
					...state?.month_paginate,
					result: state?.month_paginate?.result + 1,
					total: state?.month_paginate?.total + 1,
				},
				my_transactions: [data, ...state.my_transactions],
				my_paginate: {
					...state?.my_paginate,
					result: state?.my_paginate?.result + 1,
					total: state?.my_paginate?.total + 1,
				},
				day_my_transactions: [data, ...state.day_my_transactions],
				day_my_paginate: {
					...state?.day_my_paginate,
					result: state?.day_my_paginate?.result + 1,
					total: state?.day_my_paginate?.total + 1,
				},
				month_my_transactions: [data, ...state.month_my_transactions],
				month_my_paginate: {
					...state?.month_my_paginate,
					result: state?.month_my_paginate?.result + 1,
					total: state?.month_my_paginate?.total + 1,
				},
			};
		case ADD_DATA:
			return {
				...state,
				data: [data, ...state.data],
				paginate_data: {
					...state?.paginate_data,
					result: state?.paginate_data?.result + 1,
					total: state?.paginate_data?.total + 1,
				},
				transactions: [data, ...state.transactions],
				paginate: {
					...state?.paginate,
					result: state?.paginate?.result + 1,
					total: state?.paginate?.total + 1,
				},
				day_transactions: [data, ...state.day_transactions],
				day_paginate: {
					...state?.day_paginate,
					result: state?.day_paginate?.result + 1,
					total: state?.day_paginate?.total + 1,
				},
				month_transactions: [data, ...state.month_transactions],
				month_paginate: {
					...state?.month_paginate,
					result: state?.month_paginate?.result + 1,
					total: state?.month_paginate?.total + 1,
				},
				my_transactions: [data, ...state.my_transactions],
				my_paginate: {
					...state?.my_paginate,
					result: state?.my_paginate?.result + 1,
					total: state?.my_paginate?.total + 1,
				},
				day_my_transactions: [data, ...state.day_my_transactions],
				day_my_paginate: {
					...state?.day_my_paginate,
					result: state?.day_my_paginate?.result + 1,
					total: state?.day_my_paginate?.total + 1,
				},
				month_my_transactions: [data, ...state.month_my_transactions],
				month_my_paginate: {
					...state?.month_my_paginate,
					result: state?.month_my_paginate?.result + 1,
					total: state?.month_my_paginate?.total + 1,
				},
			};
		case GET_NETWORK_LOADING:
			return {
				...state,
				isLoading: true,
			};
		case GET_NETWORK_FAIL:
			return {
				...state,
				isLoading: false,
			};
		case MANUAL_TRANSACTION:
			return {
				...state,
				isManual: true,
				transactions: [data, ...state.transactions],
				day_transactions: [data, ...state.day_transactions],
				month_transactions: [data, ...state.month_transactions],
			};
		case MANUAL_TRANSACTION_FAIL:
			return {
				...state,
				isManual: false,
			};
		case LOGOUT:
			return initialState;
		default:
			return state;
	}
};

export default GeneralReducer;

const initialPending = {
	isLoading: false,
	networks: [],
	transactions: [],
	paginate: null,
	isFound: null,
	searchLoading: null,
	mainSearch: [],
	search: "",
	search_paginate: null,
};

export const PendingTransctions = (state = initialPending, action) => {
	const { type, payload } = action;
	let data = payload?.data ? payload?.data : payload;

	switch (type) {
		case UPDATE_MULTIPLE_TRANSACTION:
			let data1 = [],
				data3 = [];
			for (let j = 0; j < payload.length; j++) {
				data1 = EditData(state?.mainSearch, payload?.[j]);
				data3 = EditData(state?.transactions, payload?.[j]);
			}
			return {
				...state,
				mainSearch: data1,
				transactions: data3,
				isUpdated: true,
			};
		case UPDATE_TRANSACTION:
			return {
				...state,
				mainSearch: EditData(state.mainSearch, payload),
				transactions: EditData(state.transactions, payload),
				isUpdated: true,
			};
		case UPDATE_TRANSACTION_FAIL:
			return {
				...state,
				isUpdated: false,
			};
		case DELETE_MULTIPLE_TRANSACTION:
			let dati1 = [],
				dati3 = [];
			for (let j = 0; j < payload.length; j++) {
				dati1 = DeleteData(state?.mainSearch, payload?.[j]);
				dati3 = DeleteData(state?.transactions, payload?.[j]);
			}
			return {
				...state,
				mainSearch: dati1,
				transactions: dati3,
				isDeleted: true,
			};
		case DELETE_TRANSACTION:
			return {
				...state,
				mainSearch: DeleteData(state.mainSearch, payload),
				transactions: DeleteData(state.transactions, payload),
				isDeleted: true,
			};
		case DELETE_TRANSACTION_FAIL:
			return {
				...state,
				isDeleted: false,
			};
		case SEARCH_TRANSACTION_PENDING:
			return {
				...state,
				isFound: true,
				searchLoading: false,
				mainSearch: action?.search === state?.search ? data : state?.mainSearch,
				search_paginate:
					action?.search === state?.search
						? payload?.paginate
						: state?.search_paginate,
			};
		case SEARCH_TRANSACTION_PENDING_FAIL:
			return {
				...state,
				isFound: false,
				searchLoading: false,
				mainSearch: null,
				search: "",
				search_paginate: null,
			};
		case SEARCH_TRANSACTION_PENDING_LOADING:
			return {
				...state,
				search: action.search,
				searchLoading: true,
			};
		case SEARCH_TRANSACTION_RELOAD:
			return {
				...state,
				isFound: false,
				searchLoading: false,
			};
		case PENDING_TRANSACTION:
			return {
				...state,
				transactions: data,
				paginate: payload?.paginate,
			};
		case LOGOUT:
			return initialState;
		default:
			return state;
	}
};