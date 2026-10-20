import { useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { ComandaConteudo, type ComandaAgendamento } from "@/components/ComandaSheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DateRangePicker, type DatePreset } from "@/components/DataTable";
import type { DateRange } from "react-day-picker";
import { endOfDay, isWithinInterval, parse, startOfDay } from "date-fns";

type ComandaAberta = ComandaAgendamento & { abertaEm: string };

const R$ = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const hoje = () => new Date().toLocaleDateString("pt-BR");

const comandasIniciais: ComandaAberta[] = [
  { id: 3961388, cliente: "Caio César", servico: "auxiliar", profissional: "Claudia", inicio: "", fim: "", data: "19/10/2026", abertaEm: "19/10", valor: 0 },
  { id: 3961390, cliente: "João Silva", servico: "Corte Masculino", profissional: "Cesar", inicio: "", fim: "", data: "19/10/2026", abertaEm: "19/10", valor: 50, telefone: "(41) 99123-4567" },
  { id: 3961391, cliente: "Maria Santos", servico: "Escova", profissional: "Claudia", inicio: "", fim: "", data: "18/10/2026", abertaEm: "18/10", valor: 60, telefone: "(41) 98765-4321" },
];

const iniciais = (nome: string) =>
  nome
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0])
    .join("")
    .toUpperCase();

export default function FrenteCaixa() {
  const [comandas, setComandas] = useState(comandasIniciais);
  const [selecionadaId, setSelecionadaId] = useState<number | null>(comandasIniciais[0].id);
  const [busca, setBusca] = useState("");
  // Mesmo seletor de período das outras telas: sem período, mostra todas as abertas
  const [datePreset, setDatePreset] = useState<DatePreset>(null);
  const [periodo, setPeriodo] = useState<DateRange | undefined>();

  const lista = useMemo(() => {
    const q = busca.trim().toLowerCase();
    return comandas.filter((c) => {
      if (q && !c.cliente.toLowerCase().includes(q)) return false;
      if (periodo?.from && periodo?.to) {
        const dia = parse(c.data, "dd/MM/yyyy", new Date());
        return isWithinInterval(dia, { start: startOfDay(periodo.from), end: endOfDay(periodo.to) });
      }
      return true;
    });
  }, [comandas, busca, periodo]);

  const selecionada = comandas.find((c) => c.id === selecionadaId) ?? null;

  const novaComanda = () => {
    const nova: ComandaAberta = {
      id: Math.max(...comandas.map((c) => c.id), 3961387) + 1,
      cliente: "Cliente avulso",
      servico: "Venda balcão",
      profissional: "",
      inicio: "",
      fim: "",
      data: hoje(),
      abertaEm: hoje().slice(0, 5),
      valor: 0,
    };
    setComandas((prev) => [nova, ...prev]);
    setSelecionadaId(nova.id);
  };

  // Comanda paga sai da lista de abertas e a próxima fica selecionada
  const fecharSelecionada = () => {
    const resto = comandas.filter((c) => c.id !== selecionadaId);
    setComandas(resto);
    setSelecionadaId(resto[0]?.id ?? null);
  };

  return (
    <AppLayout>
      <div className="flex h-full min-h-0 flex-col gap-4 lg:flex-row">
        <aside className="flex w-full shrink-0 flex-col rounded-xl border border-border bg-card lg:w-[260px]">
          <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-3">
            <h1 className="text-sm font-semibold">Comandas abertas</h1>
            <Button size="sm" variant="outline" className="h-7 gap-1 px-2 text-xs" onClick={novaComanda}>
              <Plus className="h-3.5 w-3.5" /> Nova
            </Button>
          </div>
          <div className="flex items-center gap-2 px-3 pb-2 pt-3">
            <div className="relative min-w-0 flex-1">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Buscar cliente"
                className="h-9 pl-8 text-xs"
              />
            </div>
            <DateRangePicker
              datePreset={datePreset}
              onSelect={setDatePreset}
              dateRange={periodo}
              onRangeChange={setPeriodo}
            />
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-2">
            {lista.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelecionadaId(c.id)}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-left transition-colors",
                  c.id === selecionadaId ? "bg-muted" : "hover:bg-muted/60",
                )}
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-semibold text-primary">
                  {iniciais(c.cliente)}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13px] font-medium">{c.cliente}</span>
                  <span className="block truncate text-[11px] text-muted-foreground">
                    #{c.id} · {c.abertaEm}
                  </span>
                </span>
                <span className="text-xs tabular-nums text-muted-foreground">{R$(c.valor ?? 0)}</span>
              </button>
            ))}
            {lista.length === 0 && (
              <p className="px-2 py-4 text-center text-xs text-muted-foreground">
                {busca ? `Nenhuma comanda para “${busca}”.` : "Nenhuma comanda aberta."}
              </p>
            )}
          </div>
        </aside>

        <section className="flex min-h-[560px] min-w-0 flex-1 flex-col overflow-hidden rounded-xl border border-border bg-card">
          {selecionada ? (
            <ComandaConteudo agendamento={selecionada} variante="caixa" onFechar={fecharSelecionada} />
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
              <p className="text-sm font-semibold">Nenhuma comanda selecionada</p>
              <p className="max-w-xs text-xs text-muted-foreground">
                Escolha uma comanda aberta na lista ou abra uma nova para vender no balcão.
              </p>
              <Button size="sm" className="gap-1" onClick={novaComanda}>
                <Plus className="h-3.5 w-3.5" /> Nova comanda
              </Button>
            </div>
          )}
        </section>
      </div>
    </AppLayout>
  );
}
