import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

export const OG_SITE_REL_PATH = "src/lib/og/site.json";

export function readOgSite(root) {
  try {
    const file = join(root, OG_SITE_REL_PATH);
    const text = readFileSync(file, "utf8");
    return JSON.parse(text);
  } catch {
    return {};
  }
}

export function siteHasCustomCard(site) {
  return !!site && typeof site === "object" && site.card === "custom";
}

export function projectHasCustomCard(root) {
  return siteHasCustomCard(readOgSite(root));
}

export function customCardExists(root) {
  return [
    join(root, "public/og.jpg"),
    join(root, "public/og.png"),
  ].some((file) => existsSync(file));
}
