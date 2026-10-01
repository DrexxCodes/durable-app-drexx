import {
	ACTIVATE_USER,
	LOGOUT,
	ADD_EMPLOYEE_FAIL,
	SEARCH_USERS,
	SEARCH_USERS_FAIL,
	SEARCH_USERS_LOADING,
	SEARCH_USERS_RELOAD,
	GET_USERS,
	GET_USERS_FAIL,
	DELETE_ADMIN,
	UPDATE_ADMIN,
	SEARCH_MARKETERS,
	SEARCH_MARKETERS_FAIL,
	SEARCH_MARKETERS_LOADING,
	SEARCH_MARKETERS_RELOAD,
	GET_MARKETERS,
	GET_MARKETERS_FAIL,
	ADD_MARKETERS_FAIL,
	ADD_MARKETERS,
	ADD_ACCOUNTANT_FAIL,
	SEARCH_ACCOUNTANT,
	SEARCH_ACCOUNTANT_FAIL,
	SEARCH_ACCOUNTANT_LOADING,
	SEARCH_ACCOUNTANT_RELOAD,
	GET_ACCOUNTANT,
	GET_ACCOUNTANT_FAIL,
	ADD_ACCOUNTANT,
	SEARCH_DEVELOPERS,
	SEARCH_DEVELOPERS_FAIL,
	SEARCH_DEVELOPERS_LOADING,
	SEARCH_DEVELOPERS_RELOAD,
	GET_DEVELOPERS,
	GET_DEVELOPERS_FAIL,
	ADD_DEVELOPERS,
	ADD_DEVELOPERS_FAIL,
	SEARCH_MANAGERS,
	SEARCH_MANAGERS_FAIL,
	SEARCH_MANAGERS_LOADING,
	SEARCH_MANAGERS_RELOAD,
	GET_MANAGERS,
	GET_MANAGERS_FAIL,
	ADD_MANAGERS,
	ADD_MANAGERS_FAIL,
	SEARCH_SUPERADMIN,
	SEARCH_SUPERADMIN_FAIL,
	SEARCH_SUPERADMIN_LOADING,
	SEARCH_SUPERADMIN_RELOAD,
	GET_SUPERADMIN,
	GET_SUPERADMIN_FAIL,
	ADD_SUPERADMIN,
	ADD_SUPERADMIN_FAIL,
	SEARCH_RESELLERS,
	SEARCH_RESELLERS_FAIL,
	SEARCH_RESELLERS_LOADING,
	SEARCH_RESELLERS_RELOAD,
	GET_RESELLERS,
	GET_RESELLERS_FAIL,
	SEARCH_TOPUSERS,
	SEARCH_TOPUSERS_FAIL,
	SEARCH_TOPUSERS_LOADING,
	SEARCH_TOPUSERS_RELOAD,
	GET_TOPUSERS,
	GET_TOPUSERS_FAIL,
	GET_ALL_USERS_FAIL,
	GET_ALL_USERS,
	SEARCH_ALL_USERS_RELOAD,
	SEARCH_ALL_USERS_LOADING,
	SEARCH_ALL_USERS_FAIL,
	SEARCH_ALL_USERS,
	WALLET_HISTORY_USER_LOADING,
	PURCHASE_HISTORY_USER_LOADING,
	WALLET_HISTORY_USER,
	PURCHASE_HISTORY_USER,
	PURCHASE_HISTORY_USER_FAIL,
	WALLET_HISTORY_USER_FAIL,
} from "@/Data/Actions/ActionTypes";
import { EditData, DeleteData } from "@/Data/Reducer/AuthReducer";

const initialStateManagers = {
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
	wallet: null,
	transactions: null,
};

export const ManagersReducer = (state = initialStateManagers, action) => {
	const { type, payload } = action;
	let data = payload?.data ? payload?.data : payload;

	switch (type) {
		case SEARCH_MANAGERS:
			return {
				...state,
				isFound: true,
				searchLoading: false,
				mainSearch: data ? data : [],
				search: action.search,
				search_paginate: payload?.paginate,
			};
		case SEARCH_MANAGERS_FAIL:
			return {
				...state,
				searchLoading: false,
				mainSearch: state.mainSearch,
				search_paginate: state.search_paginate,
			};
		case SEARCH_MANAGERS_LOADING:
			return {
				...state,
				searchLoading: true,
			};
		case SEARCH_MANAGERS_RELOAD:
			return {
				...state,
				isFound: false,
				searchLoading: false,
			};
		case GET_MANAGERS:
			return {
				...state,
				isLoading: false,
				data: data ? data : [],
				paginate: payload?.paginate,
				wallet: payload?.wallet,
				transactions: payload?.transactions,
			};
		case GET_MANAGERS_FAIL:
			return {
				...state,
				isLoading: false,
			};
		case ADD_MANAGERS:
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
		case ADD_MANAGERS_FAIL:
			return {
				...state,
				isLoading: false,
				isUpdated: false,
				isAdded: false,
				isDeleted: false,
			};
		case UPDATE_ADMIN:
		case ACTIVATE_USER:
			return {
				...state,
				isUpdated: true,
				data: EditData(state?.data, data),
				mainSearch: EditData(state?.mainSearch, data),
			};
		case DELETE_ADMIN:
			return {
				...state,
				isDeleted: true,
				data: DeleteData(state?.data, data),
				mainSearch: EditData(state?.mainSearch, data),
			};
		case LOGOUT:
			return initialStateManagers;
		default:
			return state;
	}
};

const initialStateSuperadmins = {
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
	wallet: null,
	transactions: null,
};

export const SuperadminsReducer = (state = initialStateSuperadmins, action) => {
	const { type, payload } = action;
	let data = payload?.data ? payload?.data : payload;

	switch (type) {
		case SEARCH_SUPERADMIN:
			return {
				...state,
				isFound: true,
				searchLoading: false,
				mainSearch: data ? data : [],
				search: action.search,
				search_paginate: payload?.paginate,
			};
		case SEARCH_SUPERADMIN_FAIL:
			return {
				...state,
				searchLoading: false,
				mainSearch: state.mainSearch,
				search_paginate: state.search_paginate,
			};
		case SEARCH_SUPERADMIN_LOADING:
			return {
				...state,
				searchLoading: true,
			};
		case SEARCH_SUPERADMIN_RELOAD:
			return {
				...state,
				isFound: false,
				searchLoading: false,
			};
		case GET_SUPERADMIN:
			return {
				...state,
				isLoading: false,
				data: data ? data : [],
				paginate: payload?.paginate,
				wallet: payload?.wallet,
				transactions: payload?.transactions,
			};
		case GET_SUPERADMIN_FAIL:
			return {
				...state,
				isLoading: false,
			};
		case ADD_SUPERADMIN:
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
		case ADD_SUPERADMIN_FAIL:
			return {
				...state,
				isLoading: false,
				isUpdated: false,
				isAdded: false,
				isDeleted: false,
			};
		case UPDATE_ADMIN:
		case ACTIVATE_USER:
			return {
				...state,
				isUpdated: true,
				data: EditData(state?.data, data),
				mainSearch: EditData(state?.mainSearch, data),
			};
		case DELETE_ADMIN:
			return {
				...state,
				isDeleted: true,
				data: DeleteData(state?.data, data),
				mainSearch: EditData(state?.mainSearch, data),
			};
		case LOGOUT:
			return initialStateSuperadmins;
		default:
			return state;
	}
};

const initialStateResellers = {
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
	wallet: null,
	transactions: null,
};

export const ResellersReducer = (state = initialStateResellers, action) => {
	const { type, payload } = action;
	let data = payload?.data ? payload?.data : payload;

	switch (type) {
		case SEARCH_RESELLERS:
			return {
				...state,
				isFound: true,
				searchLoading: false,
				mainSearch: data ? data : [],
				search: action.search,
				search_paginate: payload?.paginate,
			};
		case SEARCH_RESELLERS_FAIL:
			return {
				...state,
				searchLoading: false,
				mainSearch: state.mainSearch,
				search_paginate: state.search_paginate,
			};
		case SEARCH_RESELLERS_LOADING:
			return {
				...state,
				searchLoading: true,
			};
		case SEARCH_RESELLERS_RELOAD:
			return {
				...state,
				isFound: false,
				searchLoading: false,
			};
		case GET_RESELLERS:
			return {
				...state,
				isLoading: false,
				data: data ? data : [],
				paginate: payload?.paginate,
				wallet: payload?.wallet,
				transactions: payload?.transactions,
			};
		case GET_RESELLERS_FAIL:
			return {
				...state,
				isLoading: false,
			};
		case ADD_EMPLOYEE_FAIL:
			return {
				...state,
				isLoading: false,
				isUpdated: false,
				isAdded: false,
				isDeleted: false,
			};
		case UPDATE_ADMIN:
		case ACTIVATE_USER:
			return {
				...state,
				isUpdated: true,
				data: EditData(state?.data, data),
				mainSearch: EditData(state?.mainSearch, data),
			};
		case DELETE_ADMIN:
			return {
				...state,
				isDeleted: true,
				data: DeleteData(state?.data, data),
				mainSearch: EditData(state?.mainSearch, data),
			};
		case LOGOUT:
			return initialStateResellers;
		default:
			return state;
	}
};

const initialStateTopusers = {
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
	wallet: null,
	transactions: null,
};

export const TopusersReducer = (state = initialStateTopusers, action) => {
	const { type, payload } = action;
	let data = payload?.data ? payload?.data : payload;

	switch (type) {
		case SEARCH_TOPUSERS:
			return {
				...state,
				isFound: true,
				searchLoading: false,
				mainSearch: data ? data : [],
				search: action.search,
				search_paginate: payload?.paginate,
			};
		case SEARCH_TOPUSERS_FAIL:
			return {
				...state,
				searchLoading: false,
				mainSearch: state.mainSearch,
				search_paginate: state.search_paginate,
			};
		case SEARCH_TOPUSERS_LOADING:
			return {
				...state,
				searchLoading: true,
			};
		case SEARCH_TOPUSERS_RELOAD:
			return {
				...state,
				isFound: false,
				searchLoading: false,
			};
		case GET_TOPUSERS:
			return {
				...state,
				isLoading: false,
				data: data ? data : [],
				paginate: payload?.paginate,
				wallet: payload?.wallet,
				transactions: payload?.transactions,
			};
		case GET_TOPUSERS_FAIL:
			return {
				...state,
				isLoading: false,
			};
		case ADD_EMPLOYEE_FAIL:
			return {
				...state,
				isLoading: false,
				isUpdated: false,
				isAdded: false,
				isDeleted: false,
			};
		case UPDATE_ADMIN:
		case ACTIVATE_USER:
			return {
				...state,
				isUpdated: true,
				data: EditData(state?.data, data),
				mainSearch: EditData(state?.mainSearch, data),
			};
		case DELETE_ADMIN:
			return {
				...state,
				isDeleted: true,
				data: DeleteData(state?.data, data),
				mainSearch: EditData(state?.mainSearch, data),
			};
		case LOGOUT:
			return initialStateTopusers;
		default:
			return state;
	}
};

const initialStateDevelopers = {
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
	wallet: null,
	transactions: null,
};

export const DevelopersReducer = (state = initialStateDevelopers, action) => {
	const { type, payload } = action;
	let data = payload?.data ? payload?.data : payload;

	switch (type) {
		case SEARCH_DEVELOPERS:
			return {
				...state,
				isFound: true,
				searchLoading: false,
				mainSearch: data ? data : [],
				search: action.search,
				search_paginate: payload?.paginate,
			};
		case SEARCH_DEVELOPERS_FAIL:
			return {
				...state,
				searchLoading: false,
				mainSearch: state.mainSearch,
				search_paginate: state.search_paginate,
			};
		case SEARCH_DEVELOPERS_LOADING:
			return {
				...state,
				searchLoading: true,
			};
		case SEARCH_DEVELOPERS_RELOAD:
			return {
				...state,
				isFound: false,
				searchLoading: false,
			};
		case GET_DEVELOPERS:
			return {
				...state,
				isLoading: false,
				data: data ? data : [],
				paginate: payload?.paginate,
				wallet: payload?.wallet,
				transactions: payload?.transactions,
			};
		case GET_DEVELOPERS_FAIL:
			return {
				...state,
				isLoading: false,
			};
		case ADD_DEVELOPERS:
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
		case ADD_DEVELOPERS_FAIL:
			return {
				...state,
				isLoading: false,
				isUpdated: false,
				isAdded: false,
				isDeleted: false,
			};
		case UPDATE_ADMIN:
		case ACTIVATE_USER:
			return {
				...state,
				isUpdated: true,
				data: EditData(state?.data, data),
				mainSearch: EditData(state?.mainSearch, data),
			};
		case DELETE_ADMIN:
			return {
				...state,
				isDeleted: true,
				data: DeleteData(state?.data, data),
				mainSearch: EditData(state?.mainSearch, data),
			};
		case LOGOUT:
			return initialStateDevelopers;
		default:
			return state;
	}
};

const initialStateAccountants = {
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
	wallet: null,
	transactions: null,
};

export const AccountantsReducer = (state = initialStateAccountants, action) => {
	const { type, payload } = action;
	let data = payload?.data ? payload?.data : payload;

	switch (type) {
		case SEARCH_ACCOUNTANT:
			return {
				...state,
				isFound: true,
				searchLoading: false,
				mainSearch: data ? data : [],
				search: action.search,
				search_paginate: payload?.paginate,
			};
		case SEARCH_ACCOUNTANT_FAIL:
			return {
				...state,
				searchLoading: false,
				mainSearch: state.mainSearch,
				search_paginate: state.search_paginate,
			};
		case SEARCH_ACCOUNTANT_LOADING:
			return {
				...state,
				searchLoading: true,
			};
		case SEARCH_ACCOUNTANT_RELOAD:
			return {
				...state,
				isFound: false,
				searchLoading: false,
			};
		case GET_ACCOUNTANT:
			return {
				...state,
				isLoading: false,
				data: data ? data : [],
				paginate: payload?.paginate,
				wallet: payload?.wallet,
				transactions: payload?.transactions,
			};
		case GET_ACCOUNTANT_FAIL:
			return {
				...state,
				isLoading: false,
			};
		case ADD_ACCOUNTANT:
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
		case ADD_ACCOUNTANT_FAIL:
			return {
				...state,
				isLoading: false,
				isUpdated: false,
				isAdded: false,
				isDeleted: false,
			};
		case UPDATE_ADMIN:
		case ACTIVATE_USER:
			return {
				...state,
				isUpdated: true,
				data: EditData(state?.data, data),
				mainSearch: EditData(state?.mainSearch, data),
			};
		case DELETE_ADMIN:
			return {
				...state,
				isDeleted: true,
				data: DeleteData(state?.data, data),
				mainSearch: EditData(state?.mainSearch, data),
			};
		case LOGOUT:
			return initialStateAccountants;
		default:
			return state;
	}
};

const initialStateMarketers = {
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
	wallet: null,
	transactions: null,
};

export const MarketersReducer = (state = initialStateMarketers, action) => {
	const { type, payload } = action;
	let data = payload?.data ? payload?.data : payload;

	switch (type) {
		case SEARCH_MARKETERS:
			return {
				...state,
				isFound: true,
				searchLoading: false,
				mainSearch: data ? data : [],
				search: action.search,
				search_paginate: payload?.paginate,
			};
		case SEARCH_MARKETERS_FAIL:
			return {
				...state,
				searchLoading: false,
				mainSearch: state.mainSearch,
				search_paginate: state.search_paginate,
			};
		case SEARCH_MARKETERS_LOADING:
			return {
				...state,
				searchLoading: true,
			};
		case SEARCH_MARKETERS_RELOAD:
			return {
				...state,
				isFound: false,
				searchLoading: false,
			};
		case GET_MARKETERS:
			return {
				...state,
				isLoading: false,
				data: data ? data : [],
				paginate: payload?.paginate,
				wallet: payload?.wallet,
				transactions: payload?.transactions,
			};
		case GET_MARKETERS_FAIL:
			return {
				...state,
				isLoading: false,
			};
		case ADD_MARKETERS:
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
		case ADD_MARKETERS_FAIL:
			return {
				...state,
				isLoading: false,
				isUpdated: false,
				isAdded: false,
				isDeleted: false,
			};
		case UPDATE_ADMIN:
		case ACTIVATE_USER:
			return {
				...state,
				isUpdated: true,
				data: EditData(state?.data, data),
				mainSearch: EditData(state?.mainSearch, data),
			};
		case DELETE_ADMIN:
			return {
				...state,
				isDeleted: true,
				data: DeleteData(state?.data, data),
				mainSearch: EditData(state?.mainSearch, data),
			};
		case LOGOUT:
			return initialStateMarketers;
		default:
			return state;
	}
};

const initialStateUsers = {
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
	wallet: null,
	transactions: null,
};

export const UsersReducer = (state = initialStateUsers, action) => {
	const { type, payload } = action;
	let data = payload?.data ? payload?.data : payload;

	switch (type) {
		case SEARCH_USERS:
			return {
				...state,
				isFound: true,
				searchLoading: false,
				mainSearch: data ? data : [],
				search: action.search,
				search_paginate: payload?.paginate,
			};
		case SEARCH_USERS_FAIL:
			return {
				...state,
				searchLoading: false,
				mainSearch: state.mainSearch,
				search_paginate: state.search_paginate,
			};
		case SEARCH_USERS_LOADING:
			return {
				...state,
				searchLoading: true,
			};
		case SEARCH_USERS_RELOAD:
			return {
				...state,
				isFound: false,
				searchLoading: false,
			};
		case GET_USERS:
			return {
				...state,
				isLoading: false,
				data: data ? data : [],
				paginate: payload?.paginate,
				wallet: payload?.wallet,
				transactions: payload?.transactions,
			};
		case GET_USERS_FAIL:
			return {
				...state,
				isLoading: false,
			};
		case ADD_EMPLOYEE_FAIL:
			return {
				...state,
				isLoading: false,
				isUpdated: false,
				isAdded: false,
				isDeleted: false,
			};
		case UPDATE_ADMIN:
		case ACTIVATE_USER:
			return {
				...state,
				isUpdated: true,
				data: EditData(state?.data, data),
				mainSearch: EditData(state?.mainSearch, data),
			};
		case DELETE_ADMIN:
			return {
				...state,
				isDeleted: true,
				data: DeleteData(state?.data, data),
				mainSearch: EditData(state?.mainSearch, data),
			};
		case LOGOUT:
			return initialStateUsers;
		default:
			return state;
	}
};

export default UsersReducer;

const initialStateAllUsers = {
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
	isFoundWalletLoading: null,
	isFoundPurchaseLoading: null,
	walletHistory: null,
	isFoundWallet: null,
	purchaseHistory: null,
	isFoundPurchase: null,
	wallet: null,
	transactions: null,
};

export const AllUsersReducer = (state = initialStateAllUsers, action) => {
	const { type, payload } = action;
	let data = payload?.data ? payload?.data : payload;

	switch (type) {
		case WALLET_HISTORY_USER_LOADING:
			return {
				...state,
				isFoundWalletLoading: true,
			};
		case PURCHASE_HISTORY_USER_LOADING:
			return {
				...state,
				isFoundPurchaseLoading: true,
			};
		case WALLET_HISTORY_USER:
			return {
				...state,
				walletHistory: data,
				isFoundWallet: true,
				isFoundWalletLoading: false,
			};
		case PURCHASE_HISTORY_USER:
			return {
				...state,
				purchaseHistory: data,
				isFoundPurchase: true,
				isFoundPurchaseLoading: false,
			};
		case PURCHASE_HISTORY_USER_FAIL:
		case WALLET_HISTORY_USER_FAIL:
			return {
				...state,
				isFoundPurchase: false,
				isFoundWallet: false,
				walletHistory: [],
				purchaseHistory: [],
				isFoundPurchaseLoading: false,
				isFoundWalletLoading: false,
			};
		case SEARCH_ALL_USERS:
			return {
				...state,
				isFound: true,
				searchLoading: false,
				mainSearch: data ? data : [],
				search: action.search,
				search_paginate: payload?.paginate,
			};
		case SEARCH_ALL_USERS_FAIL:
			return {
				...state,
				searchLoading: false,
				mainSearch: state.mainSearch,
				search_paginate: state.search_paginate,
			};
		case SEARCH_ALL_USERS_LOADING:
			return {
				...state,
				searchLoading: true,
			};
		case SEARCH_ALL_USERS_RELOAD:
			return {
				...state,
				isFound: false,
				searchLoading: false,
			};
		case GET_ALL_USERS:
			return {
				...state,
				isLoading: false,
				data: data ? data : [],
				paginate: payload?.paginate,
				wallet: payload?.wallet,
				transactions: payload?.transactions,
			};
		case GET_ALL_USERS_FAIL:
			return {
				...state,
				isLoading: false,
			};
		case ADD_MARKETERS:
		case ADD_MANAGERS:
		case ADD_SUPERADMIN:
		case ADD_DEVELOPERS:
		case ADD_ACCOUNTANT:
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
		case ADD_MARKETERS_FAIL:
		case ADD_DEVELOPERS_FAIL:
		case ADD_MANAGERS_FAIL:
		case ADD_SUPERADMIN_FAIL:
		case ADD_ACCOUNTANT_FAIL:
		case ADD_EMPLOYEE_FAIL:
			return {
				...state,
				isLoading: false,
				isUpdated: false,
				isAdded: false,
				isDeleted: false,
			};
		case UPDATE_ADMIN:
		case ACTIVATE_USER:
			return {
				...state,
				isUpdated: true,
				data: EditData(state?.data, data),
				mainSearch: EditData(state?.mainSearch, data),
			};
		case DELETE_ADMIN:
			return {
				...state,
				isDeleted: true,
				data: DeleteData(state?.data, data),
				mainSearch: EditData(state?.mainSearch, data),
			};
		case LOGOUT:
			return initialStateAllUsers;
		default:
			return state;
	}
};
