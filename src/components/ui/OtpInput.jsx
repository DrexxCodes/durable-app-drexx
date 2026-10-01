import { useEffect, useRef } from "react";

/**
 * Small dependency-free OTP input. Same props the legacy OtpComponent passed
 * to react18-otp-input: value, onChange(otp string), numInputs, separator,
 * inputStyle (class), isDisabled, shouldAutoFocus, isInputNum, isInputSecure.
 */
export default function OtpInput({
  value = "",
  onChange,
  numInputs = 6,
  separator,
  inputStyle = "",
  isDisabled,
  shouldAutoFocus,
  isInputNum,
  isInputSecure,
}) {
  const refs = useRef([]);
  const chars = Array.from({ length: numInputs }, (_, i) => (value || "")[i] || "");

  useEffect(() => {
    if (shouldAutoFocus) refs.current[0]?.focus();
  }, [shouldAutoFocus]);

  const commit = next => onChange && onChange(next.join("").slice(0, numInputs));

  const handleChange = (i, e) => {
    let v = e.target.value.slice(-1);
    if (isInputNum && v && !/\d/.test(v)) return;
    const next = [...chars];
    next[i] = v;
    commit(next);
    if (v && i < numInputs - 1) refs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === "Backspace" && !chars[i] && i > 0) refs.current[i - 1]?.focus();
    if (e.key === "ArrowLeft" && i > 0) refs.current[i - 1]?.focus();
    if (e.key === "ArrowRight" && i < numInputs - 1) refs.current[i + 1]?.focus();
  };

  const handlePaste = e => {
    e.preventDefault();
    let text = e.clipboardData.getData("text").trim();
    if (isInputNum) text = text.replace(/\D/g, "");
    if (!text) return;
    commit(text.slice(0, numInputs).split(""));
    refs.current[Math.min(text.length, numInputs - 1)]?.focus();
  };

  return (
    <div className="otp-row">
      {chars.map((c, i) => (
        <span className="otp-cell" key={i}>
          <input
            ref={el => (refs.current[i] = el)}
            className={inputStyle}
            value={c}
            disabled={isDisabled}
            type={isInputSecure ? "password" : "text"}
            inputMode={isInputNum ? "numeric" : "text"}
            autoComplete="one-time-code"
            maxLength={1}
            onChange={e => handleChange(i, e)}
            onKeyDown={e => handleKeyDown(i, e)}
            onPaste={handlePaste}
            onFocus={e => e.target.select()}
          />
          {i < numInputs - 1 && separator}
        </span>
      ))}
    </div>
  );
}
