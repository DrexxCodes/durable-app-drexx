import { useAvatar } from "@/hooks/useAvatar";

export default function Avatar({ user, size = 40, src, className = "", alt, ...rest }) {
  const url = useAvatar(user, src);
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={url}
      alt={alt || `${user?.firstName || "User"} avatar`}
      width={size}
      height={size}
      className={`ui-avatar ${className}`}
      style={{ width: size, height: size }}
      {...rest}
    />
  );
}
