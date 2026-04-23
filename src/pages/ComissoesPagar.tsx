import { Calendar, ChevronRight, CreditCard, Gift, Plus, Search, Sparkles, Ticket, Wallet } from "lucide-react";

const comandas = [
  { id: 1, nome: "Teste da barbearia", hora: "18:45", valor: "R$ 50,00", ativa: true, itens: 1 },
  { id: 2, nome: "Frizzar Demonstração", hora: "18:30", valor: "R$ 120,00", itens: 3 },
  { id: 3, nome: "Rogério Carvalho", hora: "18:15", valor: "R$ 80,00", itens: 2 },
  { id: 4, nome: "César", hora: "17:50", valor: "R$ 60,00", itens: 2 },
  { id: 5, nome: "Leandro Carvalho", hora: "17:20", valor: "R$ 90,00", itens: 4 },
];

const itensComanda = [{ id: 1, nome: "Corte Masculino", profissional: "Claudia", valor: "R$ 50,00" }];

const sugestoes = [
  { id: 1, nome: "Barba", motivo: "Costuma fazer junto com corte", valor: "R$ 25,00" },
  { id: 2, nome: "Hidratação", motivo: "Última vez há 30 dias", valor: "R$ 40,00" },
  { id: 3, nome: "Máscara Facial", motivo: "Boa oferta para hoje", valor: "R$ 20,00" },
];

const pagamentos = [
  { id: 1, nome: "Dinheiro" },
  { id: 2, nome: "Cartão" },
  { id: 3, nome: "Pix" },
  { id: 4, nome: "Crédito" },
  { id: 5, nome: "Moedas" },
];

const acoesRapidas = [
  { id: 1, titulo: "Usar pack / pacote", descricao: "2 disponíveis para este cliente" },
  { id: 2, titulo: "Usar créditos", descricao: "R$ 80,00 disponíveis" },
  { id: 3, titulo: "Agendar próximo atendimento", descricao: "Deixar retorno já marcado" },
];

function SectionCard({
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
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-3 p-4 lg:p-5">
        <div className="sticky top-0 z-20 flex flex-wrap items-center gap-3 rounded-lg border border-border bg-card px-3 py-2.5 shadow-sm">
          <div className="flex items-center divide-x divide-border">
            <div className="pr-4">
              <p className="text-[11px] text-muted-foreground">Comanda</p>
              <p className="text-[15px] font-semibold">Fechamento rápido</p>
            </div>
            <div className="px-4">
              <p className="text-[11px] text-muted-foreground">Cliente</p>
              <p className="text-[15px] font-semibold">Teste da barbearia</p>
            </div>
            <div className="pl-4">
              <p className="text-[11px] text-muted-foreground">Objetivo</p>
              <p className="text-[15px] font-semibold text-emerald-700">Fechar + vender mais</p>
            </div>
          </div>

          <div className="ml-auto flex flex-wrap items-center gap-2">
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

        <div className="grid gap-4 xl:grid-cols-[300px_minmax(0,1fr)_320px]">
          <aside className="flex min-h-[740px] flex-col rounded-xl border border-border bg-card shadow-sm">
            <div className="border-b border-border p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Comandas abertas
                  </p>
                  <p className="mt-1 text-lg font-semibold text-foreground">Selecione para fechar</p>
                </div>
                <span className="rounded-full bg-muted px-2 py-1 text-[11px] font-semibold text-muted-foreground">
                  {comandas.length}
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
              {comandas.map((comanda) => (
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
                      <p className="mt-1 text-xs text-muted-foreground">
                        {comanda.hora} · {comanda.itens} item(ns)
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-sm font-semibold text-foreground">{comanda.valor}</p>
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
            <SectionCard
              title="Fechamento da comanda"
              subtitle="Fluxo principal: itens, sugestão, pagamento e finalização."
              action={
                <span className="rounded-full bg-muted px-2 py-1 text-[11px] font-semibold text-muted-foreground">
                  PDV
                </span>
              }
            >
              <div className="grid gap-4">
                <div className="rounded-lg border border-border bg-muted/20 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Cliente em atendimento
                      </p>
                      <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground">Teste da barbearia</h1>
                    </div>
                    <div className="rounded-lg border border-border bg-background px-3 py-2 text-right">
                      <p className="text-[11px] text-muted-foreground">Data</p>
                      <p className="text-sm font-semibold text-foreground">22/04/2026</p>
                    </div>
                  </div>
                </div>

                <SectionCard
                  title="1. Adicionar rápido"
                  subtitle="Busca direta para lançar item sem abrir fluxo pesado."
                >
                  <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_220px_140px]">
                    <input
                      className="h-11 rounded-lg border border-border bg-background px-3 text-sm outline-none transition-colors focus:border-foreground"
                      placeholder="Buscar serviço para adicionar..."
                    />
                    <input
                      className="h-11 rounded-lg border border-border bg-background px-3 text-sm outline-none transition-colors focus:border-foreground"
                      placeholder="Profissional"
                    />
                    <button className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:opacity-90">
                      <Plus className="h-4 w-4" />
                      Adicionar
                    </button>
                  </div>
                </SectionCard>

                <SectionCard
                  title="2. Itens da comanda"
                  subtitle="Revise o que será cobrado antes do pagamento."
                  action={<button className="text-xs font-medium text-primary">Editar</button>}
                >
                  <div className="space-y-3">
                    {itensComanda.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between gap-3 rounded-lg border border-border bg-background px-4 py-4"
                      >
                        <div className="min-w-0">
                          <p className="text-base font-semibold text-foreground">{item.nome}</p>
                          <p className="mt-1 text-sm text-muted-foreground">Profissional: {item.profissional}</p>
                        </div>
                        <div className="shrink-0 text-right">
                          <p className="text-xl font-bold text-foreground">{item.valor}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </SectionCard>

                <SectionCard
                  title="3. Sugestões para vender mais"
                  subtitle="Aparecem antes do pagamento para estimular upsell no fechamento."
                  action={<span className="text-xs font-medium text-amber-700">Baseado no histórico</span>}
                >
                  <div className="grid gap-3 lg:grid-cols-3">
                    {sugestoes.map((sugestao) => (
                      <div key={sugestao.id} className="rounded-lg border border-border bg-amber-50/50 p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold text-foreground">{sugestao.nome}</p>
                            <p className="mt-1 min-h-[40px] text-xs text-muted-foreground">{sugestao.motivo}</p>
                          </div>
                          <Sparkles className="h-4 w-4 shrink-0 text-amber-500" />
                        </div>
                        <div className="mt-4 flex items-center justify-between gap-3">
                          <span className="text-base font-bold text-foreground">{sugestao.valor}</span>
                          <button className="inline-flex h-9 items-center justify-center gap-1 rounded-md border border-amber-300 bg-background px-3 text-xs font-semibold text-amber-700 transition-colors hover:bg-amber-100">
                            <Plus className="h-3.5 w-3.5" />
                            Adicionar
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </SectionCard>

                <SectionCard
                  title="4. Pagamento e finalização"
                  subtitle="Concentre o fechamento no final do fluxo, com foco no total."
                >
                  <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">
                    <div className="space-y-4">
                      <div>
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          Forma de pagamento
                        </p>
                        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
                          {pagamentos.map((pagamento, index) => (
                            <button
                              key={pagamento.id}
                              className={`inline-flex h-11 items-center justify-center rounded-lg border px-3 text-sm font-medium transition-colors ${
                                index === 0
                                  ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                                  : "border-border bg-background text-foreground hover:bg-muted"
                              }`}
                            >
                              {pagamento.nome}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="rounded-lg border border-border bg-background p-4">
                          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            Valor recebido
                          </p>
                          <p className="mt-2 text-2xl font-bold text-foreground">R$ 50,00</p>
                        </div>
                        <div className="rounded-lg border border-border bg-background p-4">
                          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            Observação rápida
                          </p>
                          <p className="mt-2 text-sm text-muted-foreground">Sem observações para este fechamento.</p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                        Resumo do fechamento
                      </p>
                      <div className="mt-4 space-y-3">
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-sm text-muted-foreground">Total da comanda</span>
                          <span className="text-3xl font-bold text-foreground">R$ 50,00</span>
                        </div>
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-sm text-muted-foreground">Falta receber</span>
                          <span className="text-xl font-bold text-red-500">R$ 50,00</span>
                        </div>
                      </div>

                      <button className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-4 text-base font-bold text-white transition-colors hover:bg-emerald-700">
                        <CreditCard className="h-5 w-5" />
                        Finalizar comanda
                      </button>
                    </div>
                  </div>
                </SectionCard>
              </div>
            </SectionCard>
          </main>

          <aside className="flex flex-col gap-4">
            <SectionCard title="Cliente" subtitle="Informações úteis no momento do fechamento.">
              <div className="space-y-4">
                <div>
                  <p className="text-2xl font-bold leading-tight text-foreground">Teste da barbearia</p>
                  <p className="mt-1 text-sm text-muted-foreground">Cliente recorrente · última visita há 6 dias</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border border-border bg-muted/20 p-3">
                    <p className="text-xs text-muted-foreground">Packs</p>
                    <p className="mt-1 text-xl font-bold text-foreground">2</p>
                  </div>
                  <div className="rounded-lg border border-border bg-muted/20 p-3">
                    <p className="text-xs text-muted-foreground">Créditos</p>
                    <p className="mt-1 text-xl font-bold text-foreground">R$ 80</p>
                  </div>
                  <div className="rounded-lg border border-border bg-muted/20 p-3">
                    <p className="text-xs text-muted-foreground">Moedas</p>
                    <p className="mt-1 text-xl font-bold text-foreground">0</p>
                  </div>
                  <div className="rounded-lg border border-border bg-muted/20 p-3">
                    <p className="text-xs text-muted-foreground">Débitos</p>
                    <p className="mt-1 text-xl font-bold text-foreground">R$ 0</p>
                  </div>
                </div>
              </div>
            </SectionCard>

            <SectionCard
              title="Ações contextuais"
              subtitle="Tudo que ajuda a fechar melhor e preparar a próxima visita."
            >
              <div className="space-y-3">
                {acoesRapidas.map((acao, index) => (
                  <button
                    key={acao.id}
                    className={`w-full rounded-lg border p-4 text-left transition-colors ${
                      index === 2
                        ? "border-primary/30 bg-primary/5 hover:bg-primary/10"
                        : "border-border bg-background hover:bg-muted/50"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-foreground">{acao.titulo}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{acao.descricao}</p>
                      </div>
                      {index === 0 ? (
                        <Ticket className="h-4 w-4 shrink-0 text-primary" />
                      ) : index === 1 ? (
                        <Wallet className="h-4 w-4 shrink-0 text-primary" />
                      ) : (
                        <Calendar className="h-4 w-4 shrink-0 text-primary" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </SectionCard>

            <SectionCard
              title="Próximo passo"
              subtitle="A retenção aparece depois do fechamento, sem disputar atenção com o pagamento."
            >
              <div className="rounded-lg border border-dashed border-primary/40 bg-primary/5 p-4">
                <p className="text-sm text-muted-foreground">
                  Depois de finalizar a comanda, ofereça o retorno imediatamente.
                </p>
                <button className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-primary/30 bg-background px-4 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary/10">
                  Agendar retorno
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </SectionCard>
          </aside>
        </div>
      </div>
    </div>
  );
}
