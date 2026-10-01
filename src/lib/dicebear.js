import { Style, Avatar } from "@dicebear/core";
import notionistsNeutral from "@dicebear/styles/notionists-neutral.json" with { type: "json" };

const style = new Style(notionistsNeutral);
const cache = new Map();

export function getAvatarDataUri(seed = "guest") {
  const key = String(seed);
  if (cache.has(key)) return cache.get(key);

  const uri = new Avatar(style, {
    seed: key,
    borderRadius: 50,
    backgroundColorFill: "linear",  // String, not array
    backgroundColor: ["e0f2fe", "dbeafe", "e0e7ff", "fce7f3", "dcfce7", "fef3c7"],
  }).toDataUri();

  cache.set(key, uri);
  return uri;
}