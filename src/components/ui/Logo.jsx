import Image from "next/image";
import { Link } from "@/lib/router";

export default function Logo({ href = "/", size = 36, withName = false, light = false }) {
  const name = process.env.REACT_APP_NAME || "App";
  const src = (light && process.env.REACT_APP_IMAGE_URL_LIGHT) || process.env.REACT_APP_IMAGE_URL;
  return (
    <Link to={href} className="brand-logo" aria-label={name}>
      {src ? (
        <Image
          src={src}
          alt={`${name} logo`}
          width={size * 3}
          height={size}
          priority
          style={{ height: size, width: "auto", maxWidth: size * 3 }}
        />
      ) : null}
      {withName && <span className="brand-name">{name}</span>}
    </Link>
  );
}
