import {
	GET_USER,
	GET_USER_FAIL,
	GET_USER_LOADING,
	LOGIN_USER,
	LOGIN_USER_2FA,
	LOGIN_USER_FAIL,
	LOGOUT,
	REGISTER_USER,
	REGISTER_USER_FAIL,
	TOKEN,
	TOKEN_2FA,
	UPDATE_PASSWORD,
	UPDATE_PASSWORD_FAIL,
	UPDATE_USER,
	UPDATE_USER_FAIL,
} from "@/Data/Actions/ActionTypes";

const initialState = {
	user: null,
	token: localStorage.getItem(TOKEN),
	isAuth: false,
	loading: false,
	checked: false, // true once the stored token has been verified (GET_USER / GET_USER_FAIL)
	isRegistered: false,
	isLoggedIn: false,
	isUpdated: false,
	isPassword: null,
	regCase: "",
};

const AuthReducer = (state = initialState, { type, payload, is2FAType }) => {
	switch (type) {
		case LOGIN_USER:
			localStorage.setItem(TOKEN, payload.token);
			return {
				...state,
				isLoggedIn: true,
				token: payload.token,
				user: payload?.data,
				is2FA: false,
			};
		case LOGIN_USER_2FA:
			localStorage.setItem(TOKEN_2FA, payload.token);
			return {
				...state,
				is2FA: true,
				is2FAType,
			};
		case REGISTER_USER:
			return {
				...state,
				isRegistered: true,
				regCase: payload?.data,
			};
		case LOGIN_USER_FAIL:
		case REGISTER_USER_FAIL:
			return {
				...state,
				isLoggedIn: false,
				isThirdPartyLoading: false,
				isRegistered: false,
			};
		case GET_USER:
			if (payload?.token) {
				localStorage.setItem(TOKEN, payload?.token);
			}
			return {
				...state,
				user: payload?.data ? payload?.data : null,
				isAuth: payload?.data ? true : false,
				loading: false,
				checked: true,
			};
		case GET_USER_FAIL:
			return {
				...state,
				loading: false,
				checked: true,
				isAuth: false,
			};
		case GET_USER_LOADING:
			return {
				...state,
				loading: true,
			};
		case UPDATE_USER:
			return {
				...state,
				isUpdated: true,
				user: payload?.data,
			};
		case UPDATE_USER_FAIL:
			return { ...state, isUpdated: false };
		case UPDATE_PASSWORD:
			return { ...state, isPassword: true };
		case UPDATE_PASSWORD_FAIL:
			return { ...state, isPassword: false };
		case LOGOUT:
			localStorage.removeItem(TOKEN);
			// initialState.token is the value read at page load; after logout there is none
			return { ...initialState, token: null, checked: true };
		default:
			return state;
	}
};

export default AuthReducer;

export const EditData = (data, payload) => {
	let updatateData =
		data?.length > 0
			? data.map(item => (item._id !== payload._id ? item : payload))
			: data;
	return updatateData;
};

export const DeleteData = (data, payload) => {
	let filterItem =
		data?.length > 0 ? [...data.filter(item => item._id !== payload._id)] : [];
	return filterItem;
};
