import { useContext } from "react";
import { FiCheck, FiX } from "react-icons/fi";
import { GlobalState } from "@/Data/Context";
import { useNavigate } from "@/lib/router";
import { ModalComponents } from "@/components/ui/Modal";

/** App-wide success / error dialogs (same behaviour as the old Routes.jsx). */
export default function GlobalModals() {
  const { success, restoreMsg, errors, clearErrors, logoutUser } = useContext(GlobalState);
  const navigate = useNavigate();

  const handleCloseError = () => {
    const msg = errors?.error?.error?.[0]?.msg?.toLowerCase() || "";
    clearErrors();
    if (msg.includes("insufficient wallet fund")) navigate("/wallets");
    if (
      msg.includes("session timeout, please login again") ||
      msg.includes("multiple logins detected. re-login to continue.")
    ) {
      logoutUser();
      navigate("/");
    }
  };

  return (
    <>
      <ModalComponents
        isOpen={!!success?.msg}
        title="Success"
        size="sm"
        success="text-success"
        toggle={() => restoreMsg()}>
        <div className="feedback-body">
          <span className="feedback-icon ok">
            <FiCheck size={30} />
          </span>
          <p className="fw-semibold mb-4">{success?.msg}</p>
          <button onClick={() => restoreMsg()} className="btn btn-primary1 px-5 py-2">
            Close
          </button>
        </div>
      </ModalComponents>

      <ModalComponents
        isOpen={errors?.error?.error?.length > 0}
        title="Error"
        size="sm"
        success="text-danger"
        toggle={handleCloseError}>
        <div className="feedback-body">
          <span className="feedback-icon bad">
            <FiX size={30} />
          </span>
          {errors?.error?.error?.map((item, i) => (
            <p key={i} className="fw-semibold mb-2">
              {errors.error.error.length > 1 && <span className="me-1">{i + 1}.</span>}
              {item?.msg}
            </p>
          ))}
          <button onClick={handleCloseError} className="btn btn-primary1 px-5 py-2 mt-3">
            Close
          </button>
        </div>
      </ModalComponents>
    </>
  );
}
