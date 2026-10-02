import Image from "next/image";

const RADIUS = 21;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/**
 * The app image in a small round chip with a ring around it (theme colour).
 *  - progress: 0..1, how much of the ring is drawn while the user is still pulling
 *  - spinning: ring sweeps around the image (used while refreshing / loading)
 * Shared by the pull-to-refresh gesture and the full-page loader so both look identical.
 */
export default function RefreshIndicator({ progress = 1, spinning = false }) {
  const src = process.env.REACT_APP_IMAGE_URL || "/icons/icon-192.png";
  const clamped = Math.min(1, Math.max(0, progress));
  const arc = spinning ? CIRCUMFERENCE * 0.28 : CIRCUMFERENCE * clamped;

  return (
    <div className={`ptr-chip${spinning ? " is-spinning" : ""}`}>
      <svg
        className="ptr-ring"
        viewBox="0 0 48 48"
        aria-hidden="true"
        style={spinning ? undefined : { transform: `rotate(${-90 + clamped * 270}deg)` }}>
        <circle className="ptr-track" cx="24" cy="24" r={RADIUS} />
        <circle className="ptr-arc" cx="24" cy="24" r={RADIUS} strokeDasharray={`${arc} ${CIRCUMFERENCE}`} />
      </svg>
      <Image className="ptr-logo" src={src} alt="" width={26} height={26} priority />
    </div>
  );
}
