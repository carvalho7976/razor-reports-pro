import { describe, it, expect, beforeEach } from "vitest";
import { getCaixaAberto, setCaixaAberto, toggleCaixa } from "@/lib/caixa";

describe("estado da gaveta (caixa)", () => {
  beforeEach(() => {
    window.localStorage.clear();
    setCaixaAberto(true);
  });

  it("aberto é verdadeiro e fechado é falso", () => {
    setCaixaAberto(true);
    expect(getCaixaAberto()).toBe(true);
    setCaixaAberto(false);
    expect(getCaixaAberto()).toBe(false);
  });

  it("alternar inverte a situação da gaveta", () => {
    setCaixaAberto(false);
    toggleCaixa();
    expect(getCaixaAberto()).toBe(true);
    toggleCaixa();
    expect(getCaixaAberto()).toBe(false);
  });

  it("guarda a situação para não voltar ao padrão ao trocar de página", () => {
    setCaixaAberto(false);
    expect(window.localStorage.getItem("frizzar:caixa-aberto")).toBe("0");
  });
});
