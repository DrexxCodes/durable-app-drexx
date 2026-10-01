import { useContext, useMemo } from "react";
import { GlobalState } from "@/Data/Context";
import { useNavigate } from "@/lib/router";
import { productArr } from "@/features/Products";

/** Visible products for the current user (same filtering rules as before). */
export function useVisibleProducts() {
  const { auth } = useContext(GlobalState);
  return useMemo(() => {
    const list = productArr.filter(it => it?.show);
    return ["reseller", "standalone"].includes(auth?.user?.privilege)
      ? list
      : list.filter(item => item?.link !== "/cgwallet");
  }, [auth?.user?.privilege]);
}

export const productHref = item =>
  item?.link?.includes("converter") ? item.link : `/products${item?.link}`;

export default function QuickActions({ limit }) {
  const navigate = useNavigate();
  const products = useVisibleProducts();
  const list = limit ? products.slice(0, limit) : products;
  return (
    <div className="quick-grid">
      {list.map(item => (
        <button key={item.name} type="button" className="quick-item" onClick={() => navigate(productHref(item))}>
          <span className="quick-icon" style={{ "--accent": item.accent }}>
            {item.icon}
          </span>
          <span className="quick-name">{item.name}</span>
        </button>
      ))}
    </div>
  );
}
