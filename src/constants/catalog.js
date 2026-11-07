import { getBiller, getCategory, getNetwork } from "@/Data/Actions/ProviderAction";
import {
  getCablesPackages,
  getCablesTypes,
  getDataToBuy,
  getEducationToBuy,
  getElectricityToBuy,
} from "@/Data/Actions/DataActions";

/**
 * What each product page needs to be current, keyed by the first URL segment.
 * Catalogs used to be fetched once at login, so an open session never saw admin edits
 * (category rename / enable-disable, plans, discos...) until the user logged in again.
 */
export const CATALOG_BY_ROUTE = {
  airtime: [getNetwork, getCategory],
  airtime_pin: [getNetwork, getCategory],
  data: [getNetwork, getCategory, getDataToBuy],
  "electricity-bills": [getCategory, getElectricityToBuy],
  "tv-subscriptions": [getCategory, getCablesTypes, getCablesPackages],
  education: [getCategory, getEducationToBuy],
  cgwallet: [getNetwork, getCategory],
  converter: [getNetwork, getBiller],
};

export const catalogsForPath = pathname => CATALOG_BY_ROUTE[String(pathname || "").split("/")[1]] || [];
