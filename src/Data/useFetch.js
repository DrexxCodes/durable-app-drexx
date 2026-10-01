import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useURL, useURL2 } from "@/Data/Config";

export const useValidation = (type, data, setNewData) => {
	let [validateLoading, setValidateLoading] = useState(false);

	let handleFetch = async e => {
		e?.preventDefault();
		let errArr = [];
		if (type === "banks") {
			if (!data?.bank_code) errArr?.push("Bank required required");
			if (!data?.account_number) errArr?.push("Account number required");
		}
		if (type === "smartCardNo") {
			if (!data?.type) errArr?.push("Smart card type required");
			if (!data?.smartCardNo) errArr?.push("Smart card number required");
		}
			if (type === "SMILE") {
			if (!data?.network) errArr?.push("Network type required");
			if (!data?.phone) errArr?.push("Email required");
		}
		if (type === "meterNo") {
			if (!data?.type) errArr?.push("Smart card type required");
			if (!data?.disco) errArr?.push("Disco type required");
			if (!data?.meterNo) errArr?.push("Meter number required");
		}
		if (type === "jambID") {
			if (!data?.jambID) errArr?.push("JAMB ID required");
			if (!data?.subType) errArr?.push("Exam category required");
			if (!data?.type) errArr?.push("Exam type required");
		}

		if (errArr?.length > 0) return errArr?.forEach(item => toast?.info(item));
		try {
			setValidateLoading(true);
			let res;
			if (type === "banks") {
				res = await axios.post(`/api/v1/airtime/banks`, { ...data });
			}
			if (["smartCardNo", "meterNo", "jambID", "SMILE"]?.includes(type)) {
				res = await axios.post(
					`/api/v1/${
						type === "smartCardNo"
							? "cables"
							: type === "jambID"
							? "education"
							: type === "SMILE"
							? "data"
							: "electricity"
					}/validate`,
					{ ...data },
					{
						baseURL: useURL2 || useURL,
						// baseURL: type === "data" ? useURL2 || useURL : useURL,
					}
				);
			}
			setNewData(res?.data);
			setValidateLoading(false);
		} catch (err) {
			setValidateLoading(false);
			if (err) console.log({ err });
			if (err) console.log(err?.response ? err?.response?.data : err?.message);
			let error = err.response?.data?.error || [
				{ msg: err?.message || "Network error, please try again" },
			];
			error.forEach(error =>
				error?.param
					? error?.param !== "suggestion" &&
					  toast.error(error.msg, { autoClose: false })
					: toast.error(error.msg, { autoClose: false })
			);
		}
		setValidateLoading(false);
	};
	return { validateLoading, handleFetch };
};
