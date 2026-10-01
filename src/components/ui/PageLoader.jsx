export default function PageLoader({ fullscreen = false }) {
  return (
    <div className={`page-loader ${fullscreen ? "is-fullscreen" : ""}`} role="status" aria-label="Loading">
      <span className="spinner" />
    </div>
  );
}
