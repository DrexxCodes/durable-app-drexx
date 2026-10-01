// Root reducer to combine all reducers in the app

import AuthReducer from "@/Data/Reducer/AuthReducer";

import { combineReducers } from "redux";
import ErrorReducer, { SuccessReducer } from "@/Data/Reducer/ErrorReducer";
import SettingsReducer, { NotificationReducer } from "@/Data/Reducer/SettingsReducer";
import {
	BillerReducer,
	CategoryReducer,
	NetworkReducer,
	ProductReducer,
} from "@/Data/Reducer/ProviderReducer";
import DataMainReducer from "@/Data/Reducer/DataReducer";
import UseCaseReducer, { UpgradeReducer } from "@/Data/Reducer/UseCaseReducer";
import TransactionsReducer from "@/Data/Reducer/TransactionsReducer";
import WalletReducer, {
	BonusReducer,
	CommissionReducer,
	ReferralReducer,
} from "@/Data/Reducer/WalletReducer";
import AirtimeReducer, {
	AirtimeConverterReducer,
	AirtimePinReducer,
} from "@/Data/Reducer/AirtimeReducer";
import ElectricityReducer from "@/Data/Reducer/ElectricityReducer";
import BizReducer, { ActivityReducer, BulkSMSReducer } from "@/Data/Reducer/BizReducer";
import CableReducer from "@/Data/Reducer/CableReducer";
import EducationReducer from "@/Data/Reducer/EducationReducer";
import { FaqsReducer, ProviderStateReducer } from "@/Data/Reducer/StatReducer";
import { docReducer } from "@/Data/Reducer/SocketReducer";
import { CgWalletHistoryReducer } from "@/Data/Reducer/CgWalletReducer";

export default combineReducers({
	auth: AuthReducer,
	errors: ErrorReducer,
	settings: SettingsReducer,
	notifications: NotificationReducer,
	success: SuccessReducer,
	category: CategoryReducer,
	biller: BillerReducer,
	products: ProductReducer,
	data: DataMainReducer,
	usecase: UseCaseReducer,
	upgrade: UpgradeReducer,
	network: NetworkReducer,
	transactions: TransactionsReducer,
	wallet: WalletReducer,
	bonus: BonusReducer,
	commission: CommissionReducer,
	airtimes: AirtimeReducer,
	airtimes_pin: AirtimePinReducer,
	converter: AirtimeConverterReducer,
	electricity: ElectricityReducer,
	education: EducationReducer,
	biz: BizReducer,
	cables: CableReducer,
	activity: ActivityReducer,
	referral: ReferralReducer,
	stat: ProviderStateReducer,
	faqs: FaqsReducer,
	documentation: docReducer,
	cgwallet: CgWalletHistoryReducer,
	bulk_sms: BulkSMSReducer,
});

