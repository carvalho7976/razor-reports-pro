import { useMemo, useState } from "react";
import {
  Calendar,
  Check,
  ChevronRight,
  Command,
  CreditCard,
  Gift,
  Minus,
  Plus,
  Scissors,
  Search,
  Sparkles,
  Wallet,
} from "lucide-react";

type Comanda = {
  id: number;
  nome: string;
  hora: string;
  valor: number;
  ativa?: boolean;
};

type Item = {
  id: number;
  nome: string;
  profissional: string;
  valor: number;
  quantidade: number;
};

type Sugestao = {
  id: number;
  nome: string;
  motivo: string;
  valor: number;
};

type Pagamento = "Dinheiro" | "Cartão" | "Pix" | "Crédito" | "Moedas";

const comandasAbertas: Comanda[] = [
  { id: 1, nome: "Teste da barbearia", hora: "18:45", valor: 75, ativa: true },
  { id: 2, nome: "Frizzar Demonstração", hora: "18:30", valor: 120 },
  { id: 3, nome: "Rogério Carvalho", hora: "18:15", valor: 80 },
  { id: 4, nome: "César", hora: "17:50", valor: 60 },
  { id: 5, nome: "Leandro Carvalho", hora: "17:20", valor: 90 },
];

const sugestoesBase: Sugestao[] = [
  { id: 1, nome: "Hidratação", motivo: "Última vez há 30 dias", valor: 40 },
  { id: 2, nome: "Máscara Facial", motivo: "Boa oferta para hoje", valor: 20 },
  { id: 3, nome: "Produto finalizador", motivo: "Combina com o atendimento", valor: 35 },
];

const servicosRapidos = [
  { nome: "Corte Masculino", valor: 50, profissional: "Claudia" },
  { nome: "Barba", valor: 25, profissional: "Claudia" },
  { nome: "Sobrancelha", valor: 15, profissional: "Claudia" },
  { nome: "Hidratação", valor: 40, profissional: "Claudia" },
];

function moeda(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function Section({
  title,
  subtitle,
  action,
  children,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-card shadow-sm">
      <div className="flex items-start justify-between gap-3 border-b border-border px-4 py-3">
        <div>
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          {subtitle ? <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p> : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

export default function MockupPDVFluxo() {
  const [query, setQuery] = useState("");
  const [pagamento, setPagamento] = useState<Pagamento>("Pix");
  const [itens, setItens] = useState<Item[]>([
    { id: 1, nome: "Corte Masculino", profissional: "Claudia", valor: 50, quantidade: 1 },
    { id: 2, nome: "Barba", profissional: "Claudia", valor: 25, quantidade: 1 },
  ]);

  const total = useMemo(() => itens.reduce((acc, item) => acc + item.valor * item.quantidade, 0), [itens]);

  const sugestoes = useMemo(() => {
    const nomesExistentes = new Set(itens.map((item) => item.nome));
    return sugestoesBase.filter((s) => !nomesExistentes.has(s.nome));
  }, [itens]);

  const aplicarComando = () => {
    const texto = query.trim().toLowerCase();
    if (!texto) return;

    const servicoEncontrado = servicosRapidos.find((s) => texto.includes(s.nome.toLowerCase()));
    if (servicoEncontrado) {
      setItens((prev) => {
        const existente = prev.find((item) => item.nome === servicoEncontrado.nome);
        if (existente) {
          return prev.map((item) =>
            item.nome === servicoEncontrado.nome ? { ...item, quantidade: item.quantidade + 1 } : item,
          );
        }
        return [
          ...prev,
          {
            id: Date.now(),
            nome: servicoEncontrado.nome,
            profissional: servicoEncontrado.profissional,
            valor: servicoEncontrado.valor,
            quantidade: 1,
          },
        ];
      });
      setQuery("");
      return;
    }

    if (texto.includes("pix")) {
      setPagamento("Pix");
      setQuery("");
      return;
    }
    if (texto.includes("cart")) {
      setPagamento("Cartão");
      setQuery("");
      return;
    }
    if (texto.includes("din")) {
      setPagamento("Dinheiro");
      setQuery("");
      return;
    }
    if (texto.includes("cred")) {
      setPagamento("Crédito");
      setQuery("");
      return;
    }
  };

  const adicionarSugestao = (sugestao: Sugestao) => {
    setItens((prev) => [
      ...prev,
      {
        id: Date.now(),
        nome: sugestao.nome,
        profissional: "Claudia",
        valor: sugestao.valor,
        quantidade: 1,
      },
    ]);
  };

  const alterarQuantidade = (id: number, delta: number) => {
    setItens((prev) =>
      prev
        .map((item) => (item.id === id ? { ...item, quantidade: Math.max(0, item.quantidade + delta) } : item))
        .filter((item) => item.quantidade > 0),
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-4 p-4 lg:p-5">
        <div className="sticky top-0 z-20 flex flex-wrap items-center gap-3 rounded-lg border border-border bg-card px-3 py-2.5 shadow-sm">
          <div className="flex items-center divide-x divide-border">
            <div className="pr-4">
              <p className="text-[11px] text-muted-foreground">Modo</p>
              <p className="text-[15px] font-semibold">PDV rápido</p>
            </div>
            <div className="px-4">
              <p className="text-[11px] text-muted-foreground">Cliente</p>
              <p className="text-[15px] font-semibold">Teste da barbearia</p>
            </div>
            <div className="pl-4">
              <p className="text-[11px] text-muted-foreground">Pagamento</p>
              <p className="text-[15px] font-semibold text-emerald-700">{pagamento}</p>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <button className="inline-flex h-8 items-center gap-2 rounded-md border border-border bg-background px-3 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
              <Calendar className="h-4 w-4" />
              22/04/2026
            </button>
            <button className="inline-flex h-8 items-center gap-2 rounded-md bg-primary px-3 text-xs font-semibold text-primary-foreground transition-colors hover:opacity-90">
              <Plus className="h-4 w-4" />
              Nova comanda
            </button>
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-[300px_minmax(0,1fr)_300px]">
          <aside className="flex min-h-[760px] flex-col rounded-xl border border-border bg-card shadow-sm">
            <div className="border-b border-border p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Comandas abertas
                  </p>
                  <p className="mt-1 text-lg font-semibold text-foreground">Troca rápida</p>
                </div>
                <span className="rounded-full bg-muted px-2 py-1 text-[11px] font-semibold text-muted-foreground">
                  {comandasAbertas.length}
                </span>
              </div>
              <div className="relative mt-4">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  className="h-10 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm outline-none transition-colors focus:border-foreground"
                  placeholder="Buscar cliente"
                />
              </div>
            </div>

            <div className="flex-1 space-y-2 overflow-y-auto p-3">
              {comandasAbertas.map((comanda) => (
                <button
                  key={comanda.id}
                  className={`w-full rounded-lg border p-3 text-left transition-all ${
                    comanda.ativa
                      ? "border-primary/40 bg-primary/5 shadow-sm"
                      : "border-border bg-background hover:bg-muted/50"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-foreground">{comanda.nome}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{comanda.hora}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-sm font-semibold text-foreground">{moeda(comanda.valor)}</p>
                      {comanda.ativa ? (
                        <span className="mt-1 inline-flex rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground">
                          Ativa
                        </span>
                      ) : null}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </aside>

          <main className="flex flex-col gap-4">
            <Section
              title="Comanda atual"
              subtitle="Sem etapas. Adicione, ajuste, sugira e finalize no mesmo fluxo."
              action={
                <span className="rounded-full bg-muted px-2 py-1 text-[11px] font-semibold text-muted-foreground">
                  Rápido
                </span>
              }
            >
              <div className="space-y-4">
                <div className="rounded-lg border border-border bg-muted/20 px-4 py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Cliente</p>
                      <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground">Teste da barbearia</h1>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Cliente recorrente · padrão: corte + barba · pagamento preferido: Pix
                      </p>
                    </div>
                    <div className="rounded-lg border border-border bg-background px-3 py-2 text-right">
                      <p className="text-[11px] text-muted-foreground">Data</p>
                      <p className="text-sm font-semibold text-foreground">22/04/2026</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                  <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-background text-primary shadow-sm">
                      <Command className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">Comando rápido</p>
                      <p className="text-xs text-muted-foreground">
                        Digite serviço, profissional ou pagamento. Ex: “barba”, “pix”, “hidratação”.
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-3">
                    <input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") aplicarComando();
                      }}
                      className="h-12 flex-1 rounded-xl border border-primary/20 bg-background px-4 text-sm outline-none transition-colors focus:border-primary"
                      placeholder="Digite um comando rápido..."
                    />
                    <button
                      onClick={aplicarComando}
                      className="inline-flex h-12 items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:opacity-90"
                    >
                      Aplicar
                    </button>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {servicosRapidos.map((servico) => (
                      <button
                        key={servico.nome}
                        onClick={() => setQuery(servico.nome)}
                        className="rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      >
                        {servico.nome}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
                  <div className="rounded-xl border border-border bg-card">
                    <div className="border-b border-border px-4 py-3">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-foreground">Itens da comanda</p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            Itens principais em destaque. Ajuste quantidade sem abrir tela extra.
                          </p>
                        </div>
                        <span className="rounded-full bg-muted px-2 py-1 text-[11px] font-semibold text-muted-foreground">
                          {itens.length} item(ns)
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3 p-4">
                      {itens.map((item) => (
                        <div key={item.id} className="rounded-lg border border-border bg-background px-4 py-4">
                          <div className="flex items-center justify-between gap-3">
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <Scissors className="h-4 w-4 text-primary" />
                                <p className="text-base font-semibold text-foreground">{item.nome}</p>
                              </div>
                              <p className="mt-1 text-sm text-muted-foreground">Profissional: {item.profissional}</p>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="inline-flex items-center rounded-lg border border-border bg-muted/30">
                                <button
                                  onClick={() => alterarQuantidade(item.id, -1)}
                                  className="inline-flex h-9 w-9 items-center justify-center text-muted-foreground hover:text-foreground"
                                >
                                  <Minus className="h-4 w-4" />
                                </button>
                                <span className="min-w-[36px] text-center text-sm font-semibold text-foreground">
                                  {item.quantidade}
                                </span>
                                <button
                                  onClick={() => alterarQuantidade(item.id, 1)}
                                  className="inline-flex h-9 w-9 items-center justify-center text-muted-foreground hover:text-foreground"
                                >
                                  <Plus className="h-4 w-4" />
                                </button>
                              </div>
                              <div className="text-right">
                                <p className="text-xl font-bold text-foreground">
                                  {moeda(item.valor * item.quantidade)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-xl border border-amber-200 bg-amber-50/50">
                    <div className="border-b border-amber-200 px-4 py-3">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-foreground">Sugestões rápidas</p>
                          <p className="mt-1 text-xs text-muted-foreground">Upsell sem poluir o fechamento.</p>
                        </div>
                        <Sparkles className="h-4 w-4 text-amber-500" />
                      </div>
                    </div>
                    <div className="space-y-3 p-4">
                      {sugestoes.map((sugestao) => (
                        <button
                          key={sugestao.id}
                          onClick={() => adicionarSugestao(sugestao)}
                          className="w-full rounded-lg border border-amber-200 bg-background p-4 text-left transition-colors hover:bg-amber-100/50"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-foreground">{sugestao.nome}</p>
                              <p className="mt-1 text-xs text-muted-foreground">{sugestao.motivo}</p>
                              <p className="mt-3 text-base font-bold text-foreground">{moeda(sugestao.valor)}</p>
                            </div>
                            <div className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-amber-300 bg-amber-50 text-amber-700">
                              <Plus className="h-4 w-4" />
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">
                  <div className="rounded-xl border border-border bg-card p-4">
                    <p className="text-sm font-semibold text-foreground">Pagamento</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Escolha rápido e finalize. Sem bloco técnico separado.
                    </p>

                    <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
                      {(["Dinheiro", "Cartão", "Pix", "Crédito", "Moedas"] as Pagamento[]).map((forma) => (
                        <button
                          key={forma}
                          onClick={() => setPagamento(forma)}
                          className={`inline-flex h-11 items-center justify-center rounded-lg border px-3 text-sm font-medium transition-colors ${
                            pagamento === forma
                              ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                              : "border-border bg-background text-foreground hover:bg-muted"
                          }`}
                        >
                          {forma}
                        </button>
                      ))}
                    </div>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-lg border border-border bg-background p-4">
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          Recebimento
                        </p>
                        <p className="mt-2 text-2xl font-bold text-foreground">{moeda(total)}</p>
                      </div>
                      <div className="rounded-lg border border-border bg-background p-4">
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          Cliente costuma pagar
                        </p>
                        <p className="mt-2 text-base font-semibold text-foreground">Pix</p>
                        <p className="mt-1 text-sm text-muted-foreground">Atalho inteligente já selecionado.</p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Fechar agora</p>
                    <div className="mt-4 space-y-3">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-sm text-muted-foreground">Total</span>
                        <span className="text-3xl font-bold text-foreground">{moeda(total)}</span>
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-sm text-muted-foreground">Forma</span>
                        <span className="text-base font-semibold text-foreground">{pagamento}</span>
                      </div>
                    </div>

                    <button className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-4 text-base font-bold text-white transition-colors hover:bg-emerald-700">
                      <Check className="h-5 w-5" />
                      Finalizar comanda
                    </button>
                  </div>
                </div>
              </div>
            </Section>
          </main>

          <aside className="flex flex-col gap-4">
            <Section title="Cliente" subtitle="Somente o que ajuda no fechamento e no retorno.">
              <div className="space-y-4">
                <div>
                  <p className="text-2xl font-bold leading-tight text-foreground">Teste da barbearia</p>
                  <p className="mt-1 text-sm text-muted-foreground">Última visita há 6 dias · alta chance de retorno</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button className="rounded-lg border border-border bg-muted/20 p-3 text-left transition-colors hover:bg-muted/40">
                    <p className="text-xs text-muted-foreground">Packs</p>
                    <p className="mt-1 text-xl font-bold text-foreground">2</p>
                  </button>
                  <button className="rounded-lg border border-border bg-muted/20 p-3 text-left transition-colors hover:bg-muted/40">
                    <p className="text-xs text-muted-foreground">Créditos</p>
                    <p className="mt-1 text-xl font-bold text-foreground">R$ 80</p>
                  </button>
                </div>
              </div>
            </Section>

            <Section title="Ações rápidas" subtitle="Sem card didático. Só o que muda venda ou retenção.">
              <div className="space-y-3">
                <button className="flex w-full items-center justify-between rounded-lg border border-border bg-background p-4 text-left transition-colors hover:bg-muted/50">
                  <div>
                    <p className="text-sm font-semibold text-foreground">Usar pack</p>
                    <p className="mt-1 text-xs text-muted-foreground">Aplicar pacote disponível</p>
                  </div>
                  <Gift className="h-4 w-4 text-primary" />
                </button>

                <button className="flex w-full items-center justify-between rounded-lg border border-border bg-background p-4 text-left transition-colors hover:bg-muted/50">
                  <div>
                    <p className="text-sm font-semibold text-foreground">Usar crédito</p>
                    <p className="mt-1 text-xs text-muted-foreground">Abater do valor total</p>
                  </div>
                  <Wallet className="h-4 w-4 text-primary" />
                </button>

                <button className="flex w-full items-center justify-between rounded-lg border border-primary/30 bg-primary/5 p-4 text-left transition-colors hover:bg-primary/10">
                  <div>
                    <p className="text-sm font-semibold text-foreground">Agendar retorno</p>
                    <p className="mt-1 text-xs text-muted-foreground">Ação pós-fechamento para retenção</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-primary" />
                </button>
              </div>
            </Section>
          </aside>
        </div>
      </div>
    </div>
  );
}
