import { FiPlus } from "react-icons/fi";
import { useNavigate } from "@/lib/router";

/** Hero card: wallet balance with a single primary action. */
export default function BalanceCard({ balance, expenses }) {
  const navigate = useNavigate();
  return (
    <section className="balance-card">
      <div>
        <span className="balance-label">Wallet balance</span>
        <div className="balance-value">{balance}</div>
        {/* <span className="balance-sub">Total spent: {expenses}</span> */}
      </div>
      <button className="btn btn-light balance-btn" onClick={() => navigate("/wallets")}>
        <FiPlus /> Add Money
      </button>
    </section>
  );
}
