import { FiDownload } from "react-icons/fi";
import { usePwaInstall } from "@/hooks/usePwaInstall";

/** Desktop "install as app" icon for the top bar (hidden everywhere else). */
export default function InstallButton() {
  const { showDesktopButton, install } = usePwaInstall();
  if (!showDesktopButton) return null;
  const name = process.env.REACT_APP_NAME || "app";
  return (
    <button
      type="button"
      className="ui-icon-btn install-desktop"
      onClick={install}
      title={`Install ${name} as an app`}
      aria-label={`Install ${name} as an app`}>
      <FiDownload size={20} />
    </button>
  );
}
