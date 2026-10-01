import { FiInbox } from "react-icons/fi";

export default function EmptyState({ title = "Nothing here yet", subtitle }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        <FiInbox size={28} />
      </div>
      <h6>{title}</h6>
      <p>{subtitle ? subtitle : "Your collection list is empty"}</p>
    </div>
  );
}
