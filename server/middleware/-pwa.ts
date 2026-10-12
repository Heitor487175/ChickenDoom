import { defineEventHandler, getRequestURL, setResponseHeader } from "h3";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();

export default defineEventHandler((event) => {
  const url = getRequestURL(event);

  if (url.pathname === "/__/manifest.webmanifest") {
    setResponseHeader(event, "content-type", "application/manifest+json; charset=utf-8");
    return new Response(
      JSON.stringify({
        name: "Chicken Doom",
        short_name: "Chicken Doom",
        start_url: "/",
        display: "standalone",
        background_color: "#140806",
        theme_color: "#140806",
        icons: [{ src: "/__/icon-180.png", sizes: "180x180", type: "image/png" }],
      }),
      { headers: { "content-type": "application/manifest+json; charset=utf-8" } },
    );
  }

  if (url.pathname === "/__/icon-180.png") {
    const iconPath = join(ROOT, "public/__/icon-180.png");
    return new Response(readFileSync(iconPath), {
      headers: { "content-type": "image/png" },
    });
  }

  if (url.searchParams.get("install") === "1" || url.pathname === "/install") {
    const html = readFileSync(join(ROOT, "scripts/install-page.html"), "utf8").replaceAll(
      "{{APP_NAME}}",
      "Chicken Doom",
    );
    return new Response(html, {
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }

  return;
});
