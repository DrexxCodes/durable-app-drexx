import { useMemo } from "react";
import { getAvatarDataUri } from "@/lib/dicebear";

/** Uploaded avatar wins; otherwise a unique dicebear SVG seeded per user. */
export function getAvatarSeed(user) {
  return user?._id || user?.id || user?.email || user?.username || user?.phone || user?.firstName || "guest";
}

export function useAvatar(user, override) {
  return useMemo(() => {
    if (override) return override;
    if (user?.avatar?.url) return user.avatar.url;
    return getAvatarDataUri(getAvatarSeed(user));
  }, [user, override]);
}
