import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Box,
  Coins,
  Crown,
  MoreHorizontal,
  Plus,
  Printer,
  Eye,
} from "lucide-react";
import { toast } from "sonner";
import { AppLayout } from "@/components/AppLayout";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const R$ = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

// Dados de exemplo: a ficha ainda não está ligada ao banco
const cliente = {
  nome: "Aline Teixeira",
  telefone: "(11) 98298-3896",
  plano: "Plano Especial",
  planoAtivo: true,
};
const saldos = { moedas: 240, packs: 2, debitos: 0, creditos: 100 };
const resumo = { visitas: 18, total: 1640, ticket: 91, frequencia: "34 dias" };

const proximos = [
  {
    dia: "31",
    semana: "sáb",
    servico: "Esmaltação em gel",
    hora: "14:00",
    prof: "Cláudia",
  },
  {
    dia: "14",
    semana: "sáb",
    servico: "Corte feminino",
    hora: "10:30",
    prof: "Rafaela",
  },
  {
    dia: "28",
    semana: "sáb",
    servico: "Hidratação",
    hora: "09:00",
    prof: "Cláudia",
  },
  {
    dia: "12",
    semana: "sáb",
    servico: "Esmaltação em gel",
    hora: "15:30",
    prof: "Cláudia",
  },
];

type Comanda = {
  id: number;
  data: string;
  servico: string;
  prof: string;
  valor: number;
  pagamento?: string;
  obs?: string;
};

const fechadas: Comanda[] = [
  {
    id: 3961402,
    data: "14/10/2026",
    servico: "Depilação axila",
    prof: "Cláudia",
    valor: 16,
    pagamento: "Crédito",
  },
  {
    id: 3961377,
    data: "07/10/2026",
    servico: "Esmaltação em gel",
    prof: "Cláudia",
    valor: 70,
    pagamento: "Pix",
    obs: "Prefere cor nude. Alérgica a esmalte com formaldeído.",
  },
  {
    id: 3961301,
    data: "02/09/2026",
    servico: "Esmaltação em gel",
    prof: "Cláudia",
    valor: 70,
    pagamento: "Cartão",
  },
  {
    id: 3961122,
    data: "10/06/2026",
    servico: "Esmaltação em gel",
    prof: "Cláudia",
    valor: 0,
    pagamento: "Pack · sessão 3 de 5",
  },
  {
    id: 3960988,
    data: "22/05/2026",
    servico: "Corte feminino",
    prof: "Rafaela",
    valor: 90,
    pagamento: "Cartão",
  },
  {
    id: 3960811,
    data: "03/04/2026",
    servico: "Hidratação",
    prof: "Rafaela",
    valor: 60,
    pagamento: "Pix",
  },
  {
    id: 3960702,
    data: "12/03/2026",
    servico: "Esmaltação em gel",
    prof: "Cláudia",
    valor: 70,
    pagamento: "Dinheiro",
  },
  {
    id: 3960544,
    data: "18/02/2026",
    servico: "Corte feminino",
    prof: "Rafaela",
    valor: 90,
    pagamento: "Cartão",
  },
];

const abertas: Comanda[] = [
  {
    id: 3961410,
    data: "29/10/2026",
    servico: "Corte feminino",
    prof: "Rafaela",
    valor: 90,
  },
  {
    id: 3961389,
    data: "28/10/2026",
    servico: "Escova",
    prof: "Rafaela",
    valor: 60,
  },
];

const packs = [
  {
    cod: 1042,
    combo: "Pack Esmaltação · 5 sessões",
    servico: "Esmaltação em gel",
    usadas: 3,
    total: 5,
  },
  {
    cod: 1051,
    combo: "Pack Hidratação · 4 sessões",
    servico: "Hidratação",
    usadas: 1,
    total: 4,
  },
];

type Observacao = {
  texto: string;
  autor: string;
  data: string;
  origem?: string;
};
const observacoesIniciais: Observacao[] = [
  {
    texto: "Prefere atendimento com a Cláudia.",
    autor: "Larissa",
    data: "02/09/2026",
  },
  {
    texto: "Gosta de café sem açúcar na espera.",
    autor: "Cláudia",
    data: "10/06/2026",
  },
  {
    texto: "Prefere cor nude. Alérgica a esmalte com formaldeído.",
    autor: "Cláudia",
    data: "07/10/2026",
    origem: "Comanda #3961377",
  },
];

const abas = [
  ["historico", "Histórico", resumo.visitas],
  ["abertas", "Em aberto", abertas.length],
  ["packs", "Packs", packs.length],
  ["fichas", "Fichas", 0],
  ["observacoes", "Observações", observacoesIniciais.length],
] as const;

type AbaId = (typeof abas)[number][0];

const coresAvatar = [
  "bg-blue-100 text-blue-800",
  "bg-emerald-100 text-emerald-800",
  "bg-amber-100 text-amber-800",
  "bg-pink-100 text-pink-800",
  "bg-violet-100 text-violet-800",
  "bg-teal-100 text-teal-800",
];
const corAvatar = (nome: string) =>
  coresAvatar[
    [...nome].reduce((s, c) => s + c.charCodeAt(0), 0) % coresAvatar.length
  ];
const iniciais = (nome: string) =>
  nome
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0])
    .join("")
    .toUpperCase();

const tituloBloco =
  "text-xs font-semibold uppercase tracking-wide text-foreground";

export default function FichaCliente() {
  const navigate = useNavigate();
  const [aba, setAba] = useState<AbaId>("historico");
  const [todosAgendados, setTodosAgendados] = useState(false);
  const [historicoCompleto, setHistoricoCompleto] = useState(false);
  const [observacoes, setObservacoes] = useState(observacoesIniciais);
  const [novaObs, setNovaObs] = useState("");

  const agendados = todosAgendados ? proximos : proximos.slice(0, 2);
  const historico = historicoCompleto ? fechadas : fechadas.slice(0, 5);

  const salvarObs = () => {
    const texto = novaObs.trim();
    if (!texto) return;
    setObservacoes((o) => [
      { texto, autor: "Você", data: new Date().toLocaleDateString("pt-BR") },
      ...o,
    ]);
    setNovaObs("");
    toast.success("Observação salva");
  };

  const novaComanda = () => navigate("/frenteCaixa");
  const agendar = () => navigate("/novaAgenda2");

  const saldo = (label: string, valor: string, icone: React.ReactNode) => (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="flex cursor-default items-center gap-1.5 whitespace-nowrap text-sm font-medium tabular-nums">
          {icone}
          {valor}
        </span>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="text-xs">
        {label}
      </TooltipContent>
    </Tooltip>
  );

  const linhaComanda = (c: Comanda, aberta = false) => (
    <div
      key={c.id}
      className="flex items-start gap-3 rounded-lg px-2 py-3 transition-colors hover:bg-muted/60 sm:gap-4 sm:px-3"
    >
      <span className="w-11 shrink-0 pt-0.5 text-[13px] text-muted-foreground">
        {c.data.slice(0, 5)}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">{c.servico}</p>
        <p className="text-xs text-muted-foreground">{c.prof}</p>
        {c.obs && (
          <p className="mt-1 rounded-md bg-muted/60 px-2 py-1 text-xs text-muted-foreground">
            Obs: {c.obs}
          </p>
        )}
      </div>
      <div className="shrink-0 text-right">
        <p className="text-sm tabular-nums">{R$(c.valor)}</p>
        {c.pagamento && (
          <p className="text-xs text-muted-foreground">{c.pagamento}</p>
        )}
        {aberta ? (
          <button
            onClick={() => navigate("/frenteCaixa")}
            className="mt-0.5 inline-flex items-center gap-1 text-xs font-medium text-info hover:underline"
          >
            <Eye className="h-3 w-3" /> Visualizar
          </button>
        ) : (
          <button
            onClick={() =>
              toast("Imprimindo comanda", { position: "top-center" })
            }
            className="mt-0.5 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            <Printer className="h-3 w-3" /> Imprimir
          </button>
        )}
      </div>
    </div>
  );

  const vazio = (texto: string) => (
    <p className="px-4 py-10 text-center text-[13px] text-muted-foreground">
      {texto}
    </p>
  );

  return (
    <AppLayout>
      <div className="flex flex-col gap-4 pb-24 lg:h-full lg:min-h-0 lg:flex-row lg:-ml-6 lg:pb-0">
        {/* coluna da cliente */}
        <aside className="flex w-full shrink-0 flex-col rounded-xl bg-card lg:w-[300px] lg:overflow-y-auto">
          <div className="flex h-[52px] shrink-0 items-center justify-between gap-2 border-b border-border px-4 lg:h-[65px]">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-sm font-semibold"
            >
              <ArrowLeft className="h-4 w-4" /> Ficha da cliente
            </button>
            <button
              onClick={() =>
                toast("Editando cadastro", { position: "top-center" })
              }
              className="text-[13px] font-medium text-info hover:underline"
            >
              Editar
            </button>
          </div>

          <div className="flex items-center gap-3 px-4 pb-3 pt-4">
            <div
              className={cn(
                "flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-[15px] font-semibold",
                corAvatar(cliente.nome),
              )}
            >
              {iniciais(cliente.nome)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[15px] font-semibold leading-tight">
                {cliente.nome}
              </p>
              <p className="truncate text-[13px] text-muted-foreground">
                {cliente.telefone}
              </p>
            </div>
            <WhatsAppButton
              telefone={cliente.telefone}
              nome={cliente.nome}
              botao
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0 rounded-lg bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground"
                  aria-label="Opções da cliente"
                >
                  <MoreHorizontal className="h-[18px] w-[18px]" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={agendar}>
                  Agendar horário
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    toast("Link da carteira copiado", {
                      position: "top-center",
                    })
                  }
                >
                  Copiar link da carteira
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    toast.success(`Lembrete enviado para ${cliente.nome}`, {
                      position: "top-center",
                    })
                  }
                >
                  Enviar lembrete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 px-4 pb-3">
            {saldo(
              "Moedas",
              String(saldos.moedas),
              <Coins className="h-4 w-4 text-warning" />,
            )}
            {saldo(
              "Packs",
              String(saldos.packs),
              <Box className="h-4 w-4 text-info" />,
            )}
            <span aria-hidden="true" className="h-4 w-px bg-border/50" />
            {saldo(
              "Débitos (a cliente deve)",
              String(saldos.debitos),
              <span className="text-destructive">R$</span>,
            )}
            {saldo(
              "Créditos (saldo a favor)",
              String(saldos.creditos),
              <span className="text-success">R$</span>,
            )}
          </div>

          <div className="px-4 pb-4">
            <div className="flex items-center gap-3 rounded-lg bg-muted/50 px-3 py-2.5 text-[13px]">
              <Crown className="h-4 w-4 shrink-0 text-muted-foreground" />
              <span className="min-w-0 flex-1 truncate font-medium">
                {cliente.plano}
              </span>
              <span
                className={cn(
                  "shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium",
                  cliente.planoAtivo
                    ? "bg-success/10 text-success"
                    : "bg-destructive/10 text-destructive",
                )}
              >
                {cliente.planoAtivo ? "Ativo" : "Atrasado"}
              </span>
            </div>
          </div>

          <div className="border-t border-border px-4 py-4">
            <div className="mb-2.5 flex items-center justify-between">
              <h2 className={tituloBloco}>
                Próximos horários · {proximos.length}
              </h2>
              <button
                onClick={agendar}
                className="text-[13px] font-medium text-info hover:underline"
              >
                + Agendar
              </button>
            </div>
            <div className="space-y-1.5">
              {agendados.map((p, i) => (
                <div
                  key={`${p.dia}-${p.hora}`}
                  className={cn(
                    "flex items-center gap-3 rounded-lg bg-info/10 px-3 py-2.5",
                    i === 1 && !todosAgendados && "max-lg:hidden",
                  )}
                >
                  <span className="w-8 shrink-0 text-center leading-tight text-info">
                    <span className="block text-base font-semibold">
                      {p.dia}
                    </span>
                    <span className="block text-[10px] uppercase">
                      {p.semana}
                    </span>
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium">
                      {p.servico}
                    </span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {p.hora} · {p.prof}
                    </span>
                  </span>
                </div>
              ))}
            </div>
            {proximos.length > 2 && (
              <button
                onClick={() => setTodosAgendados((v) => !v)}
                className="mt-2 text-xs font-medium text-info hover:underline"
              >
                {todosAgendados ? (
                  "Ver menos"
                ) : (
                  <>
                    <span className="max-lg:hidden">
                      Ver mais {proximos.length - 2}
                    </span>
                    <span className="lg:hidden">
                      Ver mais {proximos.length - 1}
                    </span>
                  </>
                )}
              </button>
            )}
          </div>

          <div className="flex justify-between border-t border-border px-4 py-3 text-xs text-muted-foreground lg:hidden">
            <span>
              <b className="text-foreground">{resumo.visitas}</b> visitas
            </span>
            <span>
              <b className="text-foreground">{R$(resumo.total)}</b> total
            </span>
            <span>
              a cada <b className="text-foreground">{resumo.frequencia}</b>
            </span>
          </div>

          <div className="hidden border-t border-border px-4 py-4 lg:block">
            <h2 className={cn(tituloBloco, "mb-2")}>Resumo</h2>
            {[
              ["Visitas", String(resumo.visitas)],
              ["Total gasto", R$(resumo.total)],
              ["Ticket médio", R$(resumo.ticket)],
              ["Volta a cada", resumo.frequencia],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between py-1 text-[13px]">
                <span className="text-muted-foreground">{k}</span>
                <span className="font-semibold tabular-nums">{v}</span>
              </div>
            ))}
          </div>
        </aside>

        {/* cartão principal */}
        <section className="flex min-h-[420px] min-w-0 flex-1 flex-col rounded-xl bg-card">
          <div className="flex h-[46px] shrink-0 items-end justify-between gap-4 border-b border-border px-4 lg:h-[65px]">
            <div
              role="tablist"
              className="flex h-full min-w-0 items-end gap-5 overflow-x-auto overflow-y-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {abas.map(([id, nome, n]) => (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={aba === id}
                  onClick={() => setAba(id)}
                  className={cn(
                    "relative -mb-px whitespace-nowrap border-b-2 pb-3 text-sm font-medium transition-colors",
                    aba === id
                      ? "border-foreground text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground",
                  )}
                >
                  {nome}
                  {n > 0 && (
                    <span
                      className={cn(
                        "ml-1.5 text-[11px]",
                        id === "abertas"
                          ? "font-semibold text-destructive"
                          : "text-muted-foreground",
                      )}
                    >
                      {n}
                    </span>
                  )}
                </button>
              ))}
            </div>
            <button
              onClick={novaComanda}
              className="hidden shrink-0 pb-3 text-[13px] font-medium text-info hover:underline lg:block"
            >
              + Nova comanda
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-2 py-2 sm:px-3">
            {aba === "historico" && (
              <>
                {historico.map((c) => linhaComanda(c))}
                {!historicoCompleto && fechadas.length > 5 && (
                  <div className="py-3 text-center">
                    <button
                      onClick={() => setHistoricoCompleto(true)}
                      className="text-[13px] font-medium text-info hover:underline"
                    >
                      Ver mais antigas
                    </button>
                  </div>
                )}
              </>
            )}

            {aba === "abertas" &&
              (abertas.length ? (
                <>
                  <p className="px-2 pb-1 pt-2 text-[13px] text-muted-foreground sm:px-3">
                    Comandas que ainda não foram pagas.
                  </p>
                  {abertas.map((c) => linhaComanda(c, true))}
                </>
              ) : (
                vazio("Nenhuma comanda em aberto.")
              ))}

            {aba === "packs" &&
              (packs.length ? (
                <div className="space-y-1 p-1">
                  {packs.map((p) => (
                    <div
                      key={p.cod}
                      className="flex items-center gap-4 rounded-lg px-2 py-3 transition-colors hover:bg-muted/60 sm:px-3"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">
                          {p.combo}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          #{p.cod} · {p.servico}
                        </p>
                        <div className="mt-2 h-1.5 w-full max-w-[220px] overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full bg-info"
                            style={{ width: `${(p.usadas / p.total) * 100}%` }}
                          />
                        </div>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="text-sm tabular-nums">
                          {p.total - p.usadas}{" "}
                          <span className="text-muted-foreground">
                            de {p.total}
                          </span>
                        </p>
                        <p className="text-xs text-muted-foreground">
                          disponíveis
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                vazio("Nenhum pack ativo.")
              ))}

            {aba === "fichas" && (
              <div className="p-3">
                <div className="mb-2 flex items-center justify-between">
                  <h2 className={tituloBloco}>Arquivos da cliente</h2>
                  <button
                    onClick={() =>
                      toast("Escolha o arquivo para anexar", {
                        position: "top-center",
                      })
                    }
                    className="inline-flex items-center gap-1 text-[13px] font-medium text-info hover:underline"
                  >
                    <Plus className="h-3.5 w-3.5" /> Novo arquivo
                  </button>
                </div>
                {vazio(
                  "Nenhum arquivo anexado. Use fichas de anamnese, termos e fotos antes e depois.",
                )}
              </div>
            )}

            {aba === "observacoes" && (
              <div className="p-3">
                <Textarea
                  value={novaObs}
                  onChange={(e) => setNovaObs(e.target.value)}
                  placeholder="Alergia, preferência, aviso…"
                  className="min-h-[72px] border-info/50 text-[13px] focus-visible:ring-info/40"
                />
                <Button
                  size="sm"
                  onClick={salvarObs}
                  disabled={!novaObs.trim()}
                  className="mt-2 h-8 bg-[hsl(var(--novo-btn))] text-[hsl(var(--novo-btn-foreground))] hover:bg-[hsl(var(--novo-btn)/0.85)]"
                >
                  Salvar
                </Button>
                <div className="mt-4 divide-y divide-border">
                  {observacoes.map((o, i) => (
                    <div key={i} className="py-3 text-[13px]">
                      <p>{o.texto}</p>
                      <p className="mt-0.5 text-[11px] text-muted-foreground">
                        {o.autor} · {o.data}
                        {o.origem && (
                          <span className="ml-1.5 rounded-full bg-muted px-2 py-0.5">
                            {o.origem}
                          </span>
                        )}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* celular: ação principal sempre ao alcance */}
      <div className="fixed inset-x-0 bottom-0 z-20 flex gap-2 border-t border-border bg-card px-3 pb-3.5 pt-2.5 lg:hidden">
        <WhatsAppButton telefone={cliente.telefone} nome={cliente.nome} botao />
        <Button
          variant="outline"
          onClick={agendar}
          className="h-11 rounded-lg px-4 text-sm font-semibold"
        >
          Agendar
        </Button>
        <Button
          onClick={novaComanda}
          className="h-11 flex-1 gap-1.5 rounded-lg bg-[hsl(var(--novo-btn))] text-sm font-semibold text-[hsl(var(--novo-btn-foreground))] hover:bg-[hsl(var(--novo-btn)/0.85)]"
        >
          <Plus className="h-4 w-4" /> Nova comanda
        </Button>
      </div>
    </AppLayout>
  );
}
