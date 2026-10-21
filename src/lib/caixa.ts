import { useSyncExternalStore } from "react";

const KEY = "frizzar:caixa-aberto";
type Listener = () => void;

const listeners = new Set<Listener>();

function read(): boolean {
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw === null ? true : raw === "1";
  } catch {
    return true;
  }
}

let current = typeof window === "undefined" ? true : read();

export function getCaixaAberto() {
  return current;
}

export function setCaixaAberto(valor: boolean) {
  current = valor;
  try {
    window.localStorage.setItem(KEY, valor ? "1" : "0");
  } catch {
    // sem storage, segue só em memória
  }
  listeners.forEach((l) => l());
}

export function toggleCaixa() {
  setCaixaAberto(!current);
}

function subscribe(callback: Listener) {
  listeners.add(callback);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      current = read();
      callback();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", onStorage);
  };
}

/** Estado da gaveta (aberta/fechada), compartilhado entre todas as páginas. */
export function useCaixaAberto() {
  return useSyncExternalStore(subscribe, getCaixaAberto, () => true);
}
