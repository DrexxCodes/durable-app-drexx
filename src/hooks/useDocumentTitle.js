import { useEffect } from "react";

const capitalize = text => text.replace(/\b\w/g, m => m.toUpperCase());

export function useDocumentTitle(pathname) {
  useEffect(() => {
    document.title = capitalize(
      `${process.env.REACT_APP_NAME || ""} ${pathname.split("/").join(" ").substring(1)}`
    ).trim();
  }, [pathname]);
}
