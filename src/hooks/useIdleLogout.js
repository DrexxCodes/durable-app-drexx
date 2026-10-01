import { useIdleTimer } from "react-idle-timer";

/** Auto-logout after 10 minutes of inactivity (same rule as before). */
export function useIdleLogout(onIdle) {
  useIdleTimer({ timeout: 1000 * 60 * 10, onIdle, debounce: 500 });
}
