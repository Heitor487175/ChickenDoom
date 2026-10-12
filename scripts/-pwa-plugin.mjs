import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const INSTALL_PAGE = readFileSync(join(ROOT, "scripts/install-page.html"), "utf8");

function renderInstallPage(appName = "Chicken Doom") {
  return INSTALL_PAGE.replaceAll("{{APP_NAME}}", appName).replaceAll(
    "{{APP_URL}}",
    "https://example.com",
  );
}

export function PwaPlugin() {
  return {
    name: "app-builder:pwa",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const raw = req.url ?? "/";
        const url = new URL(raw, "http://127.0.0.1");

        if (url.pathname === "/__/manifest.webmanifest") {
          res.setHeader("Content-Type", "application/manifest+json; charset=utf-8");
          res.end(
            JSON.stringify({
              name: "Chicken Doom",
              short_name: "Chicken Doom",
              start_url: "/",
              display: "standalone",
              background_color: "#140806",
              theme_color: "#140806",
              icons: [{ src: "/__/icon-180.png", sizes: "180x180", type: "image/png" }],
            }),
          );
          return;
        }

        if (url.pathname === "/__/icon-180.png") {
          const file = join(ROOT, "public/__/icon-180.png");
          try {
            res.setHeader("Content-Type", "image/png");
            res.end(readFileSync(file));
            return;
          } catch {
            res.statusCode = 404;
            res.end("Missing icon");
            return;
          }
        }

        if (url.searchParams.get("install") === "1" || url.pathname === "/install") {
          res.setHeader("Content-Type", "text/html; charset=utf-8");
          res.end(renderInstallPage());
          return;
        }

        next();
      });
    },
  };
}

export default PwaPlugin;
