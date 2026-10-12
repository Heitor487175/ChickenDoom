import { i as __toESM } from "../_runtime.mjs";
import { K as require_react, b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-C5wl_geS.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Home() {
	(0, import_react.useEffect)(() => {
		if (window.__doomInjecting) return;
		window.__doomInjecting = true;
		const host = document.getElementById("doom-host");
		if (!host) return;
		(async () => {
			try {
				const html = await fetch("/game.html").then((r) => {
					if (!r.ok) throw new Error("não foi possível carregar o jogo");
					return r.text();
				});
				const doc = new DOMParser().parseFromString(html, "text/html");
				doc.querySelectorAll("style, link[rel='stylesheet']").forEach((node) => {
					document.head.appendChild(node.cloneNode(true));
				});
				if (doc.body.className) doc.body.className.split(/\s+/).filter(Boolean).forEach((c) => document.body.classList.add(c));
				host.replaceChildren();
				doc.body.childNodes.forEach((node) => {
					if (node.nodeName === "SCRIPT") return;
					host.appendChild(document.importNode(node, true));
				});
				const scripts = [...doc.querySelectorAll("script")];
				for (const s of scripts) await new Promise((resolve, reject) => {
					const el = document.createElement("script");
					if (s.src) {
						el.src = s.src;
						el.onload = () => resolve();
						el.onerror = () => reject(/* @__PURE__ */ new Error("falha ao carregar " + s.src));
						document.body.appendChild(el);
					} else {
						el.textContent = s.textContent;
						document.body.appendChild(el);
						resolve();
					}
				});
			} catch (err) {
				host.replaceChildren();
				const pre = document.createElement("pre");
				pre.style.cssText = "color:#fecaca;padding:24px;white-space:pre-wrap";
				pre.textContent = err instanceof Error ? err.message : String(err);
				host.appendChild(pre);
			}
		})();
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		id: "doom-host",
		className: "fixed inset-0 overflow-hidden bg-black text-amber-400",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "p-6 text-xl",
			children: "Carregando o galinheiro…"
		})
	});
}
//#endregion
export { Home as component };
