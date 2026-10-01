import { useState } from "react";
import { FiX } from "react-icons/fi";
import { IoShareOutline, IoAddCircleOutline, IoCheckmarkCircleOutline } from "react-icons/io5";
import { ModalComponents } from "@/components/ui/Modal";
import { usePwaInstall } from "@/hooks/usePwaInstall";

const appName = () => process.env.REACT_APP_NAME || "This app";

/** Mobile-only strip: Android -> native install, iOS -> share sheet / steps. */
export default function InstallBanner() {
  const { showBanner, platform, install, dismiss } = usePwaInstall();
  const [help, setHelp] = useState(false);

  if (!showBanner) return null;

  const onInstall = async () => {
    const result = await install();
    if (result === "accepted") dismiss();
    if (result === "instructions") setHelp(true);
  };

  const isIos = platform === "ios";

  return (
    <>
      <div className="install-banner" role="region" aria-label="Install app">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/icons/icon-192.png" alt="" className="install-icon" width={40} height={40} />
        <div className="install-text">
          <strong>{appName()} feels better in a mobile experience.</strong>
          <span>
            {isIos ? (
              <>
                Tap <IoShareOutline aria-label="Share" /> then “Add to Home Screen”.
              </>
            ) : (
              "Install the app for faster access and a full-screen view."
            )}
          </span>
        </div>
        <button type="button" className="btn btn-primary1 install-btn" onClick={onInstall}>
          {isIos ? "Add to Home Screen" : "Install App"}
        </button>
        <button type="button" className="ui-icon-btn install-close" onClick={dismiss} aria-label="Dismiss">
          <FiX />
        </button>
      </div>

      <ModalComponents isOpen={help} toggle={() => setHelp(false)} title="Add to Home Screen" size="sm">
        <ol className="install-steps">
          <li>
            <IoShareOutline size={22} />
            <span>Tap the <b>Share</b> button in Safari’s toolbar.</span>
          </li>
          <li>
            <IoAddCircleOutline size={22} />
            <span>Scroll down and choose <b>Add to Home Screen</b>.</span>
          </li>
          <li>
            <IoCheckmarkCircleOutline size={22} />
            <span>Tap <b>Add</b>. {appName()} now opens like a regular app.</span>
          </li>
        </ol>
        <button className="btn btn-primary1 w-100 mt-3 py-2" onClick={() => setHelp(false)}>
          Got it
        </button>
      </ModalComponents>
    </>
  );
}
