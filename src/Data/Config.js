import axios from "axios";

export const SetAuthToken = token => {
	if (token) {
		axios.defaults.headers.common["Authorization"] = token;
		axios.defaults.headers.common["frontend-source"] = "webuser";
	} else {
		delete axios.defaults.headers.common["Authorization"];
		delete axios.defaults.headers.common["frontend-source"];
	}
};

// export const useURL = process.env.REACT_APP_BASE_URL;
export const useURL =
	process.env.NODE_ENV === "development"
		? "http://localhost:5314"
		: process.env.REACT_APP_BASE_URL;

export const useURL2 =
	process.env.NODE_ENV === "development"
		? "http://localhost:5314"
		: process.env.REACT_APP_SUPPORT_BASE_URL;

export const useURL3 =
	process.env.NODE_ENV === "development"
		? "http://localhost:5314"
		: process.env.REACT_APP_SUPPORT_BASE_URL_TWO;

export const useURL4 =
	process.env.NODE_ENV === "development"
		? "http://localhost:5314"
		: process.env.REACT_APP_SUPPORT_BASE_URL_THREE;

		export const SetDefaultHeaders = () => {
			axios.defaults.baseURL = useURL;
			axios.defaults.headers.common["frontend-source"] = "webuser";
		};
