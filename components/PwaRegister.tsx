"use client";

import { useEffect } from "react";

export default function PwaRegister() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;

    const onLoad = () => {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          // Se já existir um SW esperando (nova versão instalada em outra aba),
          // ativa direto na próxima navegação — o SW já chama skipWaiting sozinho.
          registration.addEventListener("updatefound", () => {
            const newWorker = registration.installing;
            if (!newWorker) return;
            newWorker.addEventListener("statechange", () => {
              if (newWorker.state === "activated") {
                // Nova versão pronta; não força reload para não interromper o usuário.
              }
            });
          });
        })
        .catch(() => {
          // registro falhou (ex.: ambiente sem HTTPS em dev) — segue sem PWA
        });
    };

    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, []);

  return null;
}
