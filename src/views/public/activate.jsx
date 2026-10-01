import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "@/lib/router";
import { toast } from "react-toastify";
import { Buttons } from "@/Utils";
import { VerifyMail } from "@/views/public/forget-password";
import { DefaultAuthComponent } from "@/views/public/register";

const Activate = () => {
	let [code, setCode] = useState(""),
		[loading, setLoading] = useState(false),
		[activate, setActivate] = useState(false),
		navigate = useNavigate(),
		handleSubmit = async e => {
			e.preventDefault();
			if (!code) return;
			setLoading(true);
			try {
				var res = await axios.post("/api/v1/user/otp", { otp: code });

				toast.success(res.data.msg);
				setActivate(true);
				setLoading(false);
			} catch (err) {
				console.log({ err });
				let error = err.response?.data?.error;
				if (error) {
					error.forEach(error => toast.error(error.msg));
				}

				if (err?.response?.status === 429) toast.error(err?.response?.data);
				setLoading(false);
			}
			setLoading(false);
		};

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	useEffect(() => {
		if (activate) {
			setActivate(false);
			setCode("");
			return navigate("/login");
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [activate]);

	return (
		<DefaultAuthComponent nozoom>
			<>
				<h3 className="text-capitalize">OTP</h3>
				<form>
					<VerifyMail
						code={code}
						setCode={setCode}
						text="confirm OTP"
						numInputs={5}
					/>
					<Buttons
						onClick={handleSubmit}
						loading={loading}
						css="btn btn-primary1 text-capitalize py-3 w-100 my-4"
						title="confirm OTP"
					/>
				</form>
			</>
		</DefaultAuthComponent>
	);
};

export default Activate;
