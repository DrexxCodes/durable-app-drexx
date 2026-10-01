import { returnErrors } from "@/Data/Reducer/ErrorReducer";
import axios from "axios";
import { toast } from "react-toastify";
import {
	ACTIVATE_USER,
	ACTIVATE_USER_FAIL,
	ADD_ACCOUNTANT,
	ADD_ACCOUNTANT_FAIL,
	ADD_ADMIN,
	ADD_DEVELOPERS,
	ADD_DEVELOPERS_FAIL,
	ADD_EMPLOYEE_FAIL,
	ADD_MANAGERS,
	ADD_MANAGERS_FAIL,
	ADD_MARKETERS,
	ADD_MARKETERS_FAIL,
	ADD_SUPERADMIN,
	ADD_SUPERADMIN_FAIL,
	DELETE_ADMIN,
	GET_ACCOUNTANT,
	GET_ACCOUNTANT_FAIL,
	GET_ALL_USERS,
	GET_ALL_USERS_FAIL,
	GET_DEVELOPERS,
	GET_DEVELOPERS_FAIL,
	GET_MANAGERS,
	GET_MANAGERS_FAIL,
	GET_MARKETERS,
	GET_MARKETERS_FAIL,
	GET_RESELLERS,
	GET_RESELLERS_FAIL,
	GET_SUPERADMIN,
	GET_SUPERADMIN_FAIL,
	GET_TOPUSERS,
	GET_TOPUSERS_FAIL,
	GET_USERS,
	GET_USERS_FAIL,
	PURCHASE_HISTORY_USER,
	PURCHASE_HISTORY_USER_FAIL,
	PURCHASE_HISTORY_USER_LOADING,
	SEARCH_ACCOUNTANT,
	SEARCH_ACCOUNTANT_FAIL,
	SEARCH_ACCOUNTANT_LOADING,
	SEARCH_ACCOUNTANT_RELOAD,
	SEARCH_AIRTIME_RELOAD,
	SEARCH_ALL_USERS,
	SEARCH_ALL_USERS_FAIL,
	SEARCH_ALL_USERS_LOADING,
	SEARCH_ALL_USERS_RELOAD,
	SEARCH_BILLER_RELOAD,
	SEARCH_BIZ_RELOAD,
	SEARCH_CABLE_RELOAD,
	SEARCH_CATEGORY_RELOAD,
	SEARCH_CONVERTER_RELOAD,
	SEARCH_DATA_BUNDLE_RELOAD,
	SEARCH_DATA_RELOAD,
	SEARCH_DEVELOPERS,
	SEARCH_DEVELOPERS_FAIL,
	SEARCH_DEVELOPERS_LOADING,
	SEARCH_DEVELOPERS_RELOAD,
	SEARCH_EDUCATION_RELOAD,
	SEARCH_ELECTRICITY_RELOAD,
	SEARCH_MANAGERS,
	SEARCH_MANAGERS_FAIL,
	SEARCH_MANAGERS_LOADING,
	SEARCH_MANAGERS_RELOAD,
	SEARCH_MARKETERS,
	SEARCH_MARKETERS_FAIL,
	SEARCH_MARKETERS_LOADING,
	SEARCH_MARKETERS_RELOAD,
	SEARCH_MY_TRANSACTION_RELOAD,
	SEARCH_PENDING_HISTORY_CARD_RELOAD,
	SEARCH_PENDING_HISTORY_RELOAD,
	SEARCH_PENDING_HISTORY_VIRTUAL_RELOAD,
	SEARCH_PRODUCTS_RELOAD,
	SEARCH_RESELLERS,
	SEARCH_RESELLERS_FAIL,
	SEARCH_RESELLERS_LOADING,
	SEARCH_RESELLERS_RELOAD,
	SEARCH_SUPERADMIN,
	SEARCH_SUPERADMIN_FAIL,
	SEARCH_SUPERADMIN_LOADING,
	SEARCH_SUPERADMIN_RELOAD,
	SEARCH_TOPUSERS,
	SEARCH_TOPUSERS_FAIL,
	SEARCH_TOPUSERS_LOADING,
	SEARCH_TOPUSERS_RELOAD,
	SEARCH_TRANSACTION_RELOAD,
	SEARCH_USERS,
	SEARCH_USERS_FAIL,
	SEARCH_USERS_LOADING,
	SEARCH_USERS_RELOAD,
	SEARCH_WALLET_RELOAD,
	SET_SUCCESS,
	UPDATE_ADMIN,
	WALLET_HISTORY_USER,
	WALLET_HISTORY_USER_FAIL,
	WALLET_HISTORY_USER_LOADING,
} from "@/Data/Actions/ActionTypes";

export const getReload = () => async dispatch => {
	dispatch({ type: SEARCH_ALL_USERS_RELOAD });
	dispatch({ type: SEARCH_RESELLERS_RELOAD });
	dispatch({ type: SEARCH_TOPUSERS_RELOAD });
	dispatch({ type: SEARCH_USERS_RELOAD });
	dispatch({ type: SEARCH_MANAGERS_RELOAD });
	dispatch({ type: SEARCH_ACCOUNTANT_RELOAD });
	dispatch({ type: SEARCH_DEVELOPERS_RELOAD });
	dispatch({ type: SEARCH_MARKETERS_RELOAD });
	dispatch({ type: SEARCH_SUPERADMIN_RELOAD });
	dispatch({ type: SEARCH_DATA_BUNDLE_RELOAD });
	dispatch({ type: SEARCH_BILLER_RELOAD });
	dispatch({ type: SEARCH_PRODUCTS_RELOAD });
	dispatch({ type: SEARCH_CATEGORY_RELOAD });
	dispatch({ type: SEARCH_DATA_RELOAD });
	dispatch({ type: SEARCH_AIRTIME_RELOAD });
	dispatch({ type: SEARCH_EDUCATION_RELOAD });
	dispatch({ type: SEARCH_BIZ_RELOAD });
	dispatch({ type: SEARCH_ELECTRICITY_RELOAD });
	dispatch({ type: SEARCH_CABLE_RELOAD });
	dispatch({ type: SEARCH_WALLET_RELOAD });
	dispatch({ type: SEARCH_TRANSACTION_RELOAD });
	dispatch({ type: SEARCH_MY_TRANSACTION_RELOAD });
	dispatch({ type: SEARCH_CONVERTER_RELOAD });
	dispatch({ type: SEARCH_PENDING_HISTORY_RELOAD });
	dispatch({ type: SEARCH_PENDING_HISTORY_VIRTUAL_RELOAD });
	dispatch({ type: SEARCH_PENDING_HISTORY_CARD_RELOAD });
};

// MANAGE USER ACTION
export const manageUserPrivilege =
	(userData, id, privilege, type) => async dispatch => {
		try {
			let res;
			if (!id)
				res = await axios.post(`/api/v1/user/manage-users`, { ...userData });
			else if (type === "delete") {
				res = await axios.delete(`/api/v1/user/manage-users/${id}`);
			} else
				res = await axios.put(`/api/v1/user/manage-users${id}`, {
					...userData,
				});
			// console.log({ data: res.data });

			dispatch({
				type: id
					? type === "delete"
						? DELETE_ADMIN
						: UPDATE_ADMIN
					: privilege === "superadmin"
					? ADD_SUPERADMIN
					: privilege === "manager"
					? ADD_MANAGERS
					: privilege === "marketer"
					? ADD_MARKETERS
					: privilege === "developer"
					? ADD_DEVELOPERS
					: privilege === "accountant"
					? ADD_ACCOUNTANT
					: ADD_ADMIN,
				payload: type === "delete" ? userData : res.data,
			});
			dispatch({ type: SET_SUCCESS, payload: res?.data?.msg });
		} catch (err) {
			if (err) console.log(err.response?.data?.error, { err });
			if (err?.response?.status === 429 || err?.response?.status === 405)
				toast.error(err?.response?.data ? err?.response?.data : err?.message);
			let error = err.response?.data?.error;
			if (error)
				dispatch(returnErrors({ error, status: err?.response?.status }));
			dispatch({ type: ADD_MARKETERS_FAIL });
			dispatch({ type: ADD_SUPERADMIN_FAIL });
			dispatch({ type: ADD_MANAGERS_FAIL });
			dispatch({ type: ADD_ACCOUNTANT_FAIL });
			dispatch({ type: ADD_DEVELOPERS_FAIL });
			dispatch({ type: ADD_EMPLOYEE_FAIL });
		}
	};

export const getUserPrivileges = (type, data) => async dispatch => {
	try {
		if (data?.search) {
			dispatch({
				type:
					type === "superadmin"
						? SEARCH_SUPERADMIN_LOADING
						: type === "manager"
						? SEARCH_MANAGERS_LOADING
						: type === "accountant"
						? SEARCH_ACCOUNTANT_LOADING
						: type === "developer"
						? SEARCH_DEVELOPERS_LOADING
						: type === "marketer"
						? SEARCH_MARKETERS_LOADING
						: type === "topuser"
						? SEARCH_TOPUSERS_LOADING
						: type === "reseller"
						? SEARCH_RESELLERS_LOADING
						: type === "user"
						? SEARCH_USERS_LOADING
						: null,
			});
		}
		let res = await axios.get(
			`/api/v1/user/manage-users?type=${type}${
				data?.limit ? `&limit=${data?.limit}` : ""
			}
			${data?.search ? `&search=${data?.search}` : ""}
			`
		);

		dispatch({
			type:
				type === "superadmin"
					? data?.search
						? SEARCH_SUPERADMIN
						: GET_SUPERADMIN
					: type === "manager"
					? data?.search
						? SEARCH_MANAGERS
						: GET_MANAGERS
					: type === "accountant"
					? data?.search
						? SEARCH_ACCOUNTANT
						: GET_ACCOUNTANT
					: type === "developer"
					? data?.search
						? SEARCH_DEVELOPERS
						: GET_DEVELOPERS
					: type === "marketer"
					? data?.search
						? SEARCH_MARKETERS
						: GET_MARKETERS
					: type === "topuser"
					? data?.search
						? SEARCH_TOPUSERS
						: GET_TOPUSERS
					: type === "reseller"
					? data?.search
						? SEARCH_RESELLERS
						: GET_RESELLERS
					: type === "user"
					? data?.search
						? SEARCH_USERS
						: GET_USERS
					: null,
			payload: res.data,
			search: data?.search ? data?.search : "",
		});
	} catch (err) {
		if (err) console.log({ err });
		if (err) console.log(err?.response ? err?.response?.data : err?.message);
		dispatch({
			type:
				type === "superadmin"
					? data?.search
						? SEARCH_SUPERADMIN_FAIL
						: GET_SUPERADMIN_FAIL
					: type === "manager"
					? data?.search
						? SEARCH_MANAGERS_FAIL
						: GET_MANAGERS_FAIL
					: type === "accountant"
					? data?.search
						? SEARCH_ACCOUNTANT_FAIL
						: GET_ACCOUNTANT_FAIL
					: type === "developer"
					? data?.search
						? SEARCH_DEVELOPERS_FAIL
						: GET_DEVELOPERS_FAIL
					: type === "marketer"
					? data?.search
						? SEARCH_MARKETERS_FAIL
						: GET_MARKETERS_FAIL
					: type === "topuser"
					? data?.search
						? SEARCH_TOPUSERS_FAIL
						: GET_TOPUSERS_FAIL
					: type === "reseller"
					? data?.search
						? SEARCH_RESELLERS_FAIL
						: GET_RESELLERS_FAIL
					: type === "user"
					? data?.search
						? SEARCH_USERS_FAIL
						: GET_USERS_FAIL
					: null,
		});
	}
};

export const getAllUserPrivileges = data => async dispatch => {
	try {
		if (data?.search) {
			dispatch({
				type: SEARCH_ALL_USERS_LOADING,
			});
		}
		let res = await axios.get(
			`/api/v1/user/manage-users/all-users?type=all${
				data?.limit ? `&limit=${data?.limit}` : ""
			}
			${data?.search ? `&search=${data?.search}` : ""}
			`
		);

		dispatch({
			type: data?.search ? SEARCH_ALL_USERS : GET_ALL_USERS,
			payload: res.data,
			search: data?.search ? data?.search : "",
		});
	} catch (err) {
		if (err) console.log({ err });
		if (err) console.log(err?.response ? err?.response?.data : err?.message);
		dispatch({
			type: data?.search ? SEARCH_ALL_USERS_FAIL : GET_ALL_USERS_FAIL,
		});
	}
};

export const manageUserActiveness =
	(id, action, change, get) => async dispatch => {
		try {
			if (get) {
				if (action === "wallet")
					dispatch({ type: WALLET_HISTORY_USER_LOADING });
				if (action === "purchase")
					dispatch({ type: PURCHASE_HISTORY_USER_LOADING });
			}
			let res;
			if (get)
				res = await axios.get(`/api/v1/user/manage-users/${id}?type=${action}`);
			else if (!change)
				res = await axios.post(
					`/api/v1/user/manage-users/${id}?type=${action}`
				);
			else
				res = await axios.put(`/api/v1/user/manage-users/${id}?type=${action}`);
			dispatch({
				type: get
					? action === "wallet"
						? WALLET_HISTORY_USER
						: PURCHASE_HISTORY_USER
					: ACTIVATE_USER,
				payload: res.data,
			});
			if (!get) dispatch({ type: SET_SUCCESS, payload: res?.data?.msg });
		} catch (err) {
			if (err) console.log(err.response?.data?.error, { err });
			if (err?.response?.status === 429 || err?.response?.status === 405)
				toast.error(err?.response?.data ? err?.response?.data : err?.message);
			if (!get) {
				let error = err.response?.data?.error;
				if (error)
					dispatch(returnErrors({ error, status: err?.response?.status }));
			}
			dispatch({
				type: get
					? action === "wallet"
						? WALLET_HISTORY_USER_FAIL
						: PURCHASE_HISTORY_USER_FAIL
					: ACTIVATE_USER_FAIL,
			});
		}
	};
