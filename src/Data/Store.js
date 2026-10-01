import { legacy_createStore as createStore, applyMiddleware, compose } from "redux";
import { composeWithDevTools } from "@redux-devtools/extension";
import { thunk } from "redux-thunk";
import rootReducer from "./Reducer";

const initialState = {};
const middleware = [thunk];

const enhancer =
	process.env.NODE_ENV === "development"
		? composeWithDevTools(applyMiddleware(...middleware))
		: compose(applyMiddleware(...middleware));

const Store = createStore(rootReducer, initialState, enhancer);

export default Store;
