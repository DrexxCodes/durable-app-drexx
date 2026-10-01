import { useContext, useMemo } from "react";
import { GlobalState } from "@/Data/Context";

/** "MTN_WEEKLY" -> "WEEKLY", "AIRTEL__NOT_FOR_LOAN_SME" -> "NOT FOR LOAN SME" */
const labelOf = id => (id.includes("_") ? id.slice(id.indexOf("_") + 1) : id).replace(/_+/g, " ").trim();

/**
 * Network / data-category picker used by the "buy data" modal.
 * Same props as before (state, setState, filterBy); now a responsive grid of
 * selectable cards instead of fixed 3.5rem tiles with overflowing labels.
 */
export default function DataNetworkList({ state, setState, filterBy }) {
  const { data, network } = useContext(GlobalState);

  const options = useMemo(() => {
    const ids = [...new Set(data?.dataToBuy?.map(item => item?.category?.categoryId).filter(Boolean))];
    return ids
      .filter(id => !filterBy || id.includes(filterBy))
      .sort()
      .reverse()
      .map(id => ({
        id,
        logo: network?.data?.find(n => {
          const key = n?.name?.split(" ")?.[0]?.toLowerCase();
          return key && id.toLowerCase().includes(key);
        }),
      }))
      .filter(option => option.logo); // no matching network logo: skipped, as before
  }, [data?.dataToBuy, network?.data, filterBy]);

  return (
    <div className="network-grid" role="radiogroup" aria-label="Network">
      {options.map(({ id, logo }) => {
        const active = state === id;
        return (
          <button
            key={id}
            type="button"
            role="radio"
            aria-checked={active}
            className={`network-option${active ? " active" : ""}`}
            onClick={() => setState(id)}>
            <span className="network-logo">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={logo?.image?.url} alt="" loading="lazy" decoding="async" />
            </span>
            <span className="network-label">{labelOf(id)}</span>
          </button>
        );
      })}
    </div>
  );
}
