"use client";

import { useContext, useEffect } from "react";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import axios from "axios";
import Store from "@/Data/Store";
import DataProvider, { GlobalState } from "@/Data/Context";
import { loadUser } from "@/Data/Actions/AuthActions";
import { TOKEN } from "@/Data/Actions/ActionTypes";
import { SetAuthToken, SetDefaultHeaders } from "@/Data/Config";
import AppShell from "@/components/layout/AppShell";
import GlobalModals from "@/components/feedback/GlobalModals";
import InstallBanner from "@/components/pwa/InstallBanner";
import PwaRegister from "@/components/pwa/PwaRegister";
import PullToRefresh from "@/components/pwa/PullToRefresh";
import Snow from "@/components/ui/Snow";
import DevCredit from "@/components/ui/DevCredit";
import "@/lib/pwa"; // starts listening for beforeinstallprompt immediately
import { installHttpLayer } from "@/lib/http";

// Same boot sequence as the old App.js (runs in the browser only).
SetDefaultHeaders();
if (localStorage.getItem(TOKEN)) SetAuthToken(localStorage.getItem(TOKEN));
axios.defaults.withCredentials = false;
installHttpLayer(axios); // de-duplicates identical in-flight GETs + short catalog cache

function Shell({ children }) {
  const { auth } = useContext(GlobalState);

  return (
    <>
      <ToastContainer autoClose={false} position="top-right" />
      <PwaRegister />
      <PullToRefresh />
      <Snow />
      <InstallBanner />
      {auth?.user ? (
        <AppShell>{children}</AppShell>
      ) : (
        <div className="guest-shell">
          <div className="guest-body">{children}</div>
          <DevCredit className="guest-credit" />
        </div>
      )}
      <GlobalModals />
    </>
  );
}

export default function AppRoot({ children }) {
  useEffect(() => {
    Store.dispatch(loadUser());
    const link =
      document.querySelector("link[rel~='icon']") ||
      document.head.appendChild(Object.assign(document.createElement("link"), { rel: "icon" }));
    if (process.env.REACT_APP_IMAGE_URL) link.href = process.env.REACT_APP_IMAGE_URL;
  }, []);

  return (
    <Provider store={Store}>
      <DataProvider>
        <Shell>{children}</Shell>
      </DataProvider>
    </Provider>
  );
}
