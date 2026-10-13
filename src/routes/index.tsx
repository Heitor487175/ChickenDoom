import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

declare global {
  interface Window {
    __doomInjecting?: boolean;
  }
}

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  useEffect(() => {
    if (window.__doomInjecting) return;
    window.__doomInjecting = true;
    const host = document.getElementById("doom-host");
    if (!host) return;
    (async () => {
      try {
        const gameUrl = new URL("game.html", window.location.href).toString();
        const html = await fetch(gameUrl).then((r) => {
          if (!r.ok) throw new Error("não foi possível carregar o jogo");
          return r.text();
        });
        const doc = new DOMParser().parseFromString(html, "text/html");
        doc.querySelectorAll("style, link[rel='stylesheet']").forEach((node) => {
          document.head.appendChild(node.cloneNode(true));
        });
        if (doc.body.className) {
          doc.body.className.split(/\s+/).filter(Boolean).forEach((c) => document.body.classList.add(c));
        }
        host.replaceChildren();
        doc.body.childNodes.forEach((node) => {
          if (node.nodeName === "SCRIPT") return;
          host.appendChild(document.importNode(node, true));
        });
        const scripts = [...doc.querySelectorAll("script")];
        for (const s of scripts) {
          await new Promise<void>((resolve, reject) => {
            const el = document.createElement("script");
            if (s.src) {
              el.src = s.src;
              el.onload = () => resolve();
              el.onerror = () => reject(new Error("falha ao carregar " + s.src));
              document.body.appendChild(el);
            } else {
              el.textContent = s.textContent;
              document.body.appendChild(el);
              resolve();
            }
          });
        }
      } catch (err) {
        host.replaceChildren();
        const pre = document.createElement("pre");
        pre.style.cssText = "color:#fecaca;padding:24px;white-space:pre-wrap";
        pre.textContent = err instanceof Error ? err.message : String(err);
        host.appendChild(pre);
      }
    })();
  }, []);
  return (
    <main id="doom-host" className="fixed inset-0 overflow-hidden bg-black text-amber-400">
      <p className="p-6 text-xl">Carregando o galinheiro…</p>
    </main>
  );
}
