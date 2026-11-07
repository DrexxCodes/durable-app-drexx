import { useContext, useMemo } from "react";
import { GlobalState } from "@/Data/Context";

/**
 * Tile label. `id` is the permanent categoryId ("MTN_WEEKLY"), `name` the admin-renamable display name.
 * "MTN_WEEKLY" / "MTN WEEKLY" -> "WEEKLY", "AIRTEL NOT FOR LOAN SME" -> "NOT FOR LOAN SME".
 * The leading network word is dropped only when it matches the categoryId's own network prefix.
 */
const labelOf = (id, name) => {
  const base = String(name || id).replace(/_+/g, " ").trim();
  if (!id.includes("_")) return base;
  const prefix = id.slice(0, id.indexOf("_")).toUpperCase();
  return base.toUpperCase().startsWith(`${prefix} `) ? base.slice(prefix.length + 1).trim() : base;
};

/**
 * Network / data-category picker used by the "buy data" modal.
 * Same props as before (state, setState, filterBy); now a responsive grid of
 * selectable cards instead of fixed 3.5rem tiles with overflowing labels.
 */
export default function DataNetworkList({ state, setState, filterBy }) {
  const { data, network } = useContext(GlobalState);

  const options = useMemo(() => {
    const names = {};
    data?.dataToBuy?.forEach(item => {
      const cat = item?.category;
      if (cat?.categoryId && !names[cat.categoryId]) names[cat.categoryId] = cat.name;
    });
    const ids = Object.keys(names);
    return ids
      .filter(id => !filterBy || id.includes(filterBy))
      .sort()
      .reverse()
      .map(id => ({
        id,
        name: names[id],
        logo: network?.data?.find(n => {
          const key = n?.name?.split(" ")?.[0]?.toLowerCase();
          return key && id.toLowerCase().includes(key);
        }),
      }))
      .filter(option => option.logo); // no matching network logo: skipped, as before
  }, [data?.dataToBuy, network?.data, filterBy]);

  return (
    <div className="network-grid" role="radiogroup" aria-label="Network">
      {options.map(({ id, name, logo }) => {
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
            <span className="network-label">{labelOf(id, name)}</span>
          </button>
        );
      })}
    </div>
  );
}
