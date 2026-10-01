import {
	ADD_FUND,
	ADD_FUND_FAIL,
	FUND_WALLET,
	FUND_WALLET_FAIL,
	FUND_WALLET_FLUTTERWAVE,
	FUND_WALLET_FLUTTERWAVE_FAIL,
	GENERATE_VIRTUAL,
	GENERATE_VIRTUAL_FAIL,
	GET_ALL_BONUS,
	GET_ALL_MANUAL,
	GET_BONUS,
	GET_CARDS,
	GET_CARDS_FAIL,
	GET_COMMISSION,
	GET_GENERAL_COMMISSION,
	GET_GENERAL_REFERRAL,
	GET_REFERRAL,
	GET_WALLET,
	GET_WALLET_BALANCE,
	GET_WALLET_BALANCE_FAIL,
	GET_WALLET_DETAILS,
	GET_WALLET_FAIL,
	GET_WALLET_STAT,
	GIVE_BONUS,
	GIVE_BONUS_FAIL,
	LOGOUT,
	MANAGE_WALLET_PIN,
	MANUAL_DEBIT,
	MANUAL_DEBIT_FAIL,
	MOVE_BONUS,
	MOVE_BONUS_FAIL,
	MOVE_COMMISSION,
	MOVE_COMMISSION_FAIL,
	MOVE_REFERRAL,
	MOVE_REFERRAL_FAIL,
	SEARCH_WALLET,
	SEARCH_WALLET_FAIL,
	SEARCH_WALLET_LOADING,
	SEARCH_WALLET_RELOAD,
	TRANSFER_FUND,
	TRANSFER_FUND_FAIL,
	UPDATE_WALLET,
	UPDATE_WALLET_FAIL,
	UPDATE_WALLET_FLUTTERWAVE,
	UPDATE_WALLET_FLUTTERWAVE_FAIL,
} from "@/Data/Actions/ActionTypes";

let init = {
	wallet: [],
	isAdded: false,
	isFunded: false,
	paginate: null,
	balance: null,
	wallet_details: null,
	isTransfer: false,
	cards: [],
	isGenerated: null,
	honour_balance: null,
	manual: [],
	paginate_manual: null,
	data: null,
	isUpdated: null,
	isFound: null,
	searchLoading: null,
	mainSearch: [],
	search: "",
	search_paginate: null,
	isManualDebit: false,
	isWalletPin: false,
};

const WalletReducer = (state = init, action) => {
	let { type, payload } = action;
	let data = payload?.data ? payload?.data : payload;

	switch (type) {
		case MANUAL_DEBIT:
			return { ...state, isManualDebit: true };
		case MANUAL_DEBIT_FAIL:
			return { ...state, isManualDebit: false };
		case SEARCH_WALLET:
			return {
				...state,
				isFound: true,
				searchLoading: false,
				mainSearch: data,
				search: action.search,
				search_paginate: payload?.paginate,
			};
		case SEARCH_WALLET_FAIL:
			return {
				...state,
				isFound: false,
				searchLoading: false,
				mainSearch: null,
				search: "",
				search_paginate: null,
			};
		case SEARCH_WALLET_LOADING:
			return {
				...state,
				searchLoading: true,
			};
		case SEARCH_WALLET_RELOAD:
			return {
				...state,
				isFound: false,
				searchLoading: false,
			};
		case GET_ALL_MANUAL:
			return {
				...state,
				manual: data,
				paginate_manual: payload?.paginate,
			};
		case GET_WALLET:
			return { ...state, wallet: data, paginate: payload?.paginate };
		case GET_WALLET_FAIL:
			return { ...state, wallet: state?.wallet, manual: state.manual };
		case FUND_WALLET:
		case FUND_WALLET_FLUTTERWAVE:
			return {
				...state,
				isFunded: true,
				wallet: data?._id ? [data, ...state?.wallet] : state?.wallet,
				paginate: data?._id
					? {
							...state?.paginate,
							result: state?.paginate?.result + 1,
							total: state?.paginate?.total + 1,
					  }
					: state?.paginate,
				data: action?.data,
			};
		case UPDATE_WALLET:
		case UPDATE_WALLET_FLUTTERWAVE:
			return {
				...state,
				isFunded: true,
				isUpdated: data?._id ? true : false,
				wallet: data?._id ? [data, ...state?.wallet] : state?.wallet,
				paginate: data?._id
					? {
							...state?.paginate,
							result: state?.paginate?.result + 1,
							total: state?.paginate?.total + 1,
					  }
					: state?.paginate,
				data: action?.data,
			};
		case FUND_WALLET_FAIL:
		case FUND_WALLET_FLUTTERWAVE_FAIL:
			return { ...state, isFunded: false };
		case UPDATE_WALLET_FAIL:
		case UPDATE_WALLET_FLUTTERWAVE_FAIL:
			return { ...state, isUpdated: false };
		case ADD_FUND:
			return {
				...state,
				isAdded: true,
				manual: [data, ...state?.manual],
				paginate_manual: {
					...state?.paginate_manual,
					result: state?.paginate_manual?.result + 1,
					total: state?.paginate_manual?.total + 1,
				},
			};
		case ADD_FUND_FAIL:
			return { ...state, isAdded: false };
		case GENERATE_VIRTUAL:
			return { ...state, isGenerated: true };
		case GENERATE_VIRTUAL_FAIL:
			return { ...state, isGenerated: false };
		case TRANSFER_FUND:
			return {
				...state,
				isTransfer: true,
				wallet: [data, ...state?.wallet],
				paginate: {
					...state?.paginate,
					result: state?.paginate?.result + 1,
					total: state?.paginate?.total + 1,
				},
			};
		case MANAGE_WALLET_PIN:
			return { ...state, isWalletPin: true };
		case TRANSFER_FUND_FAIL:
			return { ...state, isTransfer: false, isWalletPin: false };
		case GET_WALLET_BALANCE:
			return { ...state, balance: data };
		case GET_WALLET_DETAILS:
			return {
				...state,
				wallet_details: state?.wallet_details
					? { ...state?.wallet_details, ...data }
					: data,
			};
		case GET_WALLET_STAT:
			return {
				...state,
				wallet_details: state?.wallet_details
					? { ...state?.wallet_details, transactions: data }
					: { transactions: data },
			};
		case GET_WALLET_BALANCE_FAIL:
			return { ...state, balance: state?.balance };
		case GET_CARDS:
			return { ...state, cards: data };
		case GET_CARDS_FAIL:
			return { ...state, cards: state?.cards };
		case LOGOUT:
			return init;
		default:
			return state;
	}
};

export default WalletReducer;

let init1 = {
	bonus: [],
	isAdded: false,
	isMoved: false,
	paginate: null,
	give_bonus: [],
	paginate_bonus: null,
};

export const BonusReducer = (state = init1, action) => {
	let { type, payload } = action;
	let data = payload?.data ? payload?.data : payload;

	switch (type) {
		case GET_BONUS:
			return { ...state, bonus: data, paginate: payload?.paginate };
		case GET_ALL_BONUS:
			return {
				...state,
				give_bonus: data,
				paginate_bonus: payload?.paginate,
			};
		case GET_WALLET_FAIL:
			return { ...state, bonus: state?.bonus, give_bonus: state?.give_bonus };
		case MOVE_BONUS:
			return {
				...state,
				isMoved: true,
				bonus: [data, ...state?.bonus],
				paginate: {
					...state?.paginate,
					result: state?.paginate?.result + 1,
					total: state?.paginate?.total + 1,
				},
			};
		case MOVE_BONUS_FAIL:
			return { ...state, isMoved: false };
		case GIVE_BONUS:
			return {
				...state,
				isAdded: true,
				bonus: [data, ...state?.bonus],
				paginate: {
					...state?.paginate,
					result: state?.paginate?.result + 1,
					total: state?.paginate?.total + 1,
				},
				give_bonus: [data, ...state?.give_bonus],
				paginate_bonus: {
					...state?.paginate_bonus,
					result: state?.paginate_bonus?.result + 1,
					total: state?.paginate_bonus?.total + 1,
				},
			};
		case GIVE_BONUS_FAIL:
			return { ...state, isAdded: false };

		case LOGOUT:
			return init1;
		default:
			return state;
	}
};

let init2 = {
	commission: [],
	isMoved: false,
	paginate: null,
	general_commission: [],
	general_paginate: null,
};

export const CommissionReducer = (state = init2, action) => {
	let { type, payload } = action;
	let data = payload?.data ? payload?.data : payload;

	switch (type) {
		case GET_COMMISSION:
			return {
				...state,
				commission: data,
				paginate: payload?.paginate,
			};
		case GET_GENERAL_COMMISSION:
			return {
				...state,
				general_commission: data,
				general_paginate: payload?.paginate,
			};
		case GET_WALLET_FAIL:
			return {
				...state,
				commission: state?.commission,
				general_commission: state?.general_commission,
			};
		case MOVE_COMMISSION:
			return {
				...state,
				isMoved: true,
				commission: [data, ...state?.commission],
				paginate: {
					...state?.paginate,
					result: state?.paginate?.result + 1,
					total: state?.paginate?.total + 1,
				},
			};
		case MOVE_COMMISSION_FAIL:
			return { ...state, isMoved: false };
		case LOGOUT:
			return init2;
		default:
			return state;
	}
};

let init3 = {
	referral: [],
	isMoved: false,
	paginate: null,
	general_referral: [],
	general_paginate: null,
};

export const ReferralReducer = (state = init3, action) => {
	let { type, payload } = action;
	let data = payload?.data ? payload?.data : payload;

	switch (type) {
		case GET_REFERRAL:
			return {
				...state,
				referral: data,
				paginate: payload?.paginate,
			};
		case GET_GENERAL_REFERRAL:
			return {
				...state,
				general_referral: data,
				general_paginate: payload?.paginate,
			};
		case GET_WALLET_FAIL:
			return {
				...state,
				commission: state?.referral,
				general_referral: state?.general_referral,
			};
		case MOVE_REFERRAL:
			return {
				...state,
				isMoved: true,
				referral: [data, ...state?.referral],
				paginate: {
					...state?.paginate,
					result: state?.paginate?.result + 1,
					total: state?.paginate?.total + 1,
				},
			};
		case MOVE_REFERRAL_FAIL:
			return { ...state, isMoved: false };
		case LOGOUT:
			return init3;
		default:
			return state;
	}
};
