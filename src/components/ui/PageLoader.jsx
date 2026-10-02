import RefreshIndicator from "@/components/ui/RefreshIndicator";

export default function PageLoader({ fullscreen = false }) {
  // Full-page loading (first open, refresh, session check): the app image sits small at the top
  // with the ring sweeping around it - the same chip the pull-to-refresh gesture ends on.
  if (fullscreen) {
    return (
      <div className="page-loader is-fullscreen is-branded" role="status" aria-label="Loading">
        <RefreshIndicator spinning />
      </div>
    );
  }
  return (
    <div className="page-loader" role="status" aria-label="Loading">
      <span className="spinner" />
    </div>
  );
}
