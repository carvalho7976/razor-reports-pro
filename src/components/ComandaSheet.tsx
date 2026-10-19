import { useEffect, useMemo, useState } from "react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Banknote,
  CalendarPlus,
  Check,
  ChevronDown,
  ChevronRight,
  Coins,
  Copy,
  CreditCard,
  Crown,
  History,
  Link2,
  MoreVertical,
  Package,
  Plus,
  QrCode,
  RefreshCw,
  Search,
  Sparkles,
  Split,
  StickyNote,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { cn } from "@/lib/utils";

export type ComandaAgendamento = {
  id: number;
  cliente: string;
  servico: string;
  profissional: string;
  inicio: string;
  fim: string;
  data: string;
  telefone?: string;
};

type Item = {
  id: number;
  descricao: string;
  detalhe: string;
  valor: number;
  tipo: "servico" | "produto" | "pack";
  assinatura?: boolean;
  qtd?: number;
};

type CatalogoItem = { nome: string; valor: number; detalhe?: string; tipo: Item["tipo"] };


type Pagamento = { id: number; forma: string; valor: number };

type Etapa = "agendamento" | "carrinho" | "pagamento" | "pago";

const catalogo: Record<"servicos" | "produtos" | "pacotes", CatalogoItem[]> = {
  servicos: [
    { nome: "Corte Feminino", valor: 80, detalhe: "45min", tipo: "servico" },
    { nome: "Corte Masculino", valor: 50, detalhe: "30min", tipo: "servico" },
    { nome: "Escova", valor: 60, detalhe: "40min", tipo: "servico" },
    { nome: "Coloração", valor: 180, detalhe: "1h30", tipo: "servico" },
    { nome: "Mechas", valor: 220, detalhe: "2h", tipo: "servico" },
    { nome: "Design de sobrancelha", valor: 40, detalhe: "30min", tipo: "servico" },
  ],
  produtos: [
    { nome: "Pomada Modeladora", valor: 49, tipo: "produto" },
    { nome: "Shampoo Anticaspa", valor: 38, tipo: "produto" },
    { nome: "Óleo Reparador", valor: 65, tipo: "produto" },
    { nome: "Água", valor: 5, tipo: "produto" },
  ],
  pacotes: [
    { nome: "Pacote Especial", valor: 150, detalhe: "5 sessões", tipo: "pack" },
    { nome: "Assinatura Mensal", valor: 129, detalhe: "corte ilimitado", tipo: "pack" },
  ],
};

const recompraSugestoes: CatalogoItem[] = [
  { nome: "Pomada Modeladora", valor: 49, detalhe: "comprou há 28 dias", tipo: "produto" },
  { nome: "Shampoo Anticaspa", valor: 38, detalhe: "comprou há 45 dias", tipo: "produto" },
];

const ultimaVisita = { data: "27/04/2026", servico: "Corte Feminino", prof: "Matheus" };

const statusOpcoes = [
  { value: "agendado", label: "Agendado", cor: "bg-info" },
  { value: "confirmado", label: "Confirmado", cor: "bg-success" },
  { value: "atendendo", label: "Em atendimento", cor: "bg-warning" },
  { value: "finalizado", label: "Finalizado", cor: "bg-muted-foreground" },
  { value: "faltou", label: "Faltou", cor: "bg-destructive" },
];

const formasDaCliente = [
  { value: "Assinatura", icon: Crown, sub: "cobre o pacote" },
  { value: "Créditos", icon: Coins, sub: "R$ 0,00" },
];

const outrasFormas = [
  { value: "Pix", icon: QrCode },
  { value: "Crédito", icon: CreditCard },
  { value: "Débito", icon: CreditCard },
  { value: "Dinheiro", icon: Banknote },
  { value: "Dividir", icon: Split },
  { value: "Link de pagamento", icon: Link2 },
];

const abas = [
  { value: "rapida", label: "Venda rápida" },
  { value: "servicos", label: "Serviços" },
  { value: "produtos", label: "Produtos" },
  { value: "pacotes", label: "Pacotes" },
  { value: "sugestoes", label: "Sugestões" },
] as const;

type Aba = (typeof abas)[number]["value"];

const R$ = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const rotulo = "text-[11px] font-medium uppercase tracking-wide text-muted-foreground";

const itensIniciais = (a: ComandaAgendamento | null): Item[] => [
  {
    id: 1,
    descricao: a?.servico ?? "Serviço",
    detalhe: [a?.inicio, a?.profissional].filter(Boolean).join(" · "),
    valor: 0,
    tipo: "servico",
    assinatura: true,
  },
  { id: 2, descricao: "Água", detalhe: "Produto", valor: 5, tipo: "produto", qtd: 1 },
];

const valorItem = (i: Item) => i.valor * (i.qtd ?? 1);

export function ComandaSheet({
  open,
  onOpenChange,
  agendamento,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  agendamento: ComandaAgendamento | null;
}) {
  const [etapa, setEtapa] = useState<Etapa>("agendamento");
  const [status, setStatus] = useState("agendado");
  const [obs, setObs] = useState("");
  const [editandoObs, setEditandoObs] = useState(false);
  const [itens, setItens] = useState<Item[]>(() => itensIniciais(agendamento));
  const [aba, setAba] = useState<Aba>("rapida");
  const [busca, setBusca] = useState("");
  const [forma, setForma] = useState<string | null>(null);
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([]);
  const [novoPgForma, setNovoPgForma] = useState("");
  const [novoPgValor, setNovoPgValor] = useState("");

  // Cada agendamento aberto começa uma comanda nova
  useEffect(() => {
    setEtapa("agendamento");
    setStatus("agendado");
    setObs("");
    setEditandoObs(false);
    setItens(itensIniciais(agendamento));
    setAba("rapida");
    setBusca("");
    setForma(null);
    setPagamentos([]);
  }, [agendamento?.id]);

  const total = useMemo(() => itens.reduce((s, i) => s + valorItem(i), 0), [itens]);
  const pago = useMemo(() => pagamentos.reduce((s, p) => s + p.valor, 0), [pagamentos]);
  const resta = Math.max(0, total - pago);

  const listaCatalogo = useMemo<CatalogoItem[]>(() => {
    if (busca.trim()) {
      const q = busca.toLowerCase();
      return [...catalogo.servicos, ...catalogo.produtos, ...catalogo.pacotes].filter((i) =>
        i.nome.toLowerCase().includes(q),
      );
    }
    if (aba === "rapida") return [...catalogo.servicos.slice(0, 4), ...catalogo.produtos];
    if (aba === "sugestoes") return recompraSugestoes;
    return catalogo[aba];
  }, [aba, busca]);

  if (!agendamento) return null;

  const iniciais = agendamento.cliente
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0])
    .join("")
    .toUpperCase();

  const statusAtual = statusOpcoes.find((s) => s.value === status) ?? statusOpcoes[0];

  const adicionar = (c: CatalogoItem) => {
    setItens((prev) => {
      // Produto repetido soma na quantidade em vez de virar outra linha
      const existente = c.tipo === "produto" && prev.find((i) => i.tipo === "produto" && i.descricao === c.nome);
      if (existente) {
        return prev.map((i) => (i.id === existente.id ? { ...i, qtd: (i.qtd ?? 1) + 1 } : i));
      }
      return [
        ...prev,
        {
          id: Date.now(),
          descricao: c.nome,
          detalhe: c.tipo === "produto" ? "Produto" : agendamento.profissional,
          valor: c.valor,
          tipo: c.tipo,
          qtd: c.tipo === "produto" ? 1 : undefined,
        },
      ];
    });
    toast.success(`${c.nome} adicionado`);
  };

  const removerItem = (id: number) => setItens((prev) => prev.filter((i) => i.id !== id));


  const addPagamento = () => {
    const v = parseFloat(novoPgValor.replace(",", "."));
    if (!novoPgForma || isNaN(v) || v <= 0) {
      toast.error("Escolha a forma e informe o valor");
      return;
    }
    setPagamentos((prev) => [...prev, { id: Date.now(), forma: novoPgForma, valor: v }]);
    setNovoPgForma("");
    setNovoPgValor("");
  };

  const cobrar = () => {
    if (!forma) {
      toast.error("Escolha a forma de pagamento");
      return;
    }
    if (forma === "Dividir" && resta > 0) {
      toast.error(`Ainda faltam ${R$(resta)}`);
      return;
    }
    setStatus("finalizado");
    setEtapa("pago");
  };

  const menuMais = (lado: "top" | "bottom" = "top") => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="h-9 w-9 shrink-0" aria-label="Mais ações">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side={lado} align="start" className="w-52">
        <DropdownMenuItem onClick={() => setEtapa("carrinho")}>
          <Plus className="mr-2 h-4 w-4" /> Cobrar avulso
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            setEtapa("agendamento");
            setEditandoObs(true);
          }}
        >
          <StickyNote className="mr-2 h-4 w-4" /> Adicionar observação
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => toast("Link copiado")}>
          <Copy className="mr-2 h-4 w-4" /> Copiar link
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive focus:text-destructive"
          onClick={() => toast("Agendamento excluído")}
        >
          <Trash2 className="mr-2 h-4 w-4" /> Excluir agendamento
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const listaItens = (compacto = false) => (
    <div className={cn("space-y-3", compacto && "space-y-2.5")}>
      {itens.length === 0 && <p className="text-xs text-muted-foreground">Nenhum item na comanda.</p>}
      {itens.map((i) => (
        <div
          key={i.id}
          className={cn(
            "group border-l-[3px] py-1 pl-3",
            i.tipo === "produto" ? "border-border" : "border-primary",
          )}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className={cn("truncate font-medium", compacto ? "text-[13px]" : "text-[13.5px]")}>
                {i.descricao}
                {i.assinatura && (
                  <span className="ml-1.5 rounded-full bg-muted px-1.5 py-0.5 align-middle text-[10px] font-medium text-muted-foreground">
                    Assinatura
                  </span>
                )}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {i.detalhe}
                {i.qtd !== undefined && ` · ${i.qtd} un`}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <span className={cn("tabular-nums", compacto ? "text-[13px]" : "text-[13.5px]")}>{R$(valorItem(i))}</span>
              <button
                onClick={() => removerItem(i.id)}
                className="text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100 focus-visible:opacity-100"
                aria-label={`Remover ${i.descricao}`}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // Coluna direita do carrinho e do pagamento
  const painelCarrinho = (botao: string, onBotao: () => void) => (
    <aside className="flex min-h-0 w-full flex-col border-t border-border md:w-[320px] md:border-l md:border-t-0">
      <div className="m-4 rounded-xl border border-border p-3">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{agendamento.cliente}</p>
            <p className="truncate text-xs text-muted-foreground">
              {agendamento.telefone ?? `${agendamento.data} · ${agendamento.inicio}`}
            </p>
          </div>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
            {iniciais}
          </div>
        </div>
        <p className="mt-2 flex items-center gap-1.5 border-t border-border pt-2 text-xs text-muted-foreground">
          <Crown className="h-3.5 w-3.5" /> Assinante · R$ 0,00 em créditos
        </p>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-2">
        {listaItens(true)}
      </div>

      {etapa === "carrinho" && aba !== "sugestoes" && (
        <button
          onClick={() => {
            setBusca("");
            setAba("sugestoes");
          }}
          className="mx-4 mb-3 flex items-center justify-between rounded-lg bg-primary/[0.08] px-3 py-2 text-xs font-medium text-primary transition-colors hover:bg-primary/[0.12]"
        >
          <span className="flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5" /> {recompraSugestoes.length} sugestões de recompra
          </span>
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      )}

      <div className="space-y-1 px-4 pb-3 text-xs text-muted-foreground">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span className="tabular-nums">{R$(total)}</span>
        </div>
        {pago > 0 && (
          <div className="flex justify-between">
            <span>Pago</span>
            <span className="tabular-nums">{R$(pago)}</span>
          </div>
        )}
      </div>

      <div className="border-t border-border p-4">
        <div className="mb-3 flex items-baseline justify-between">
          <span className="text-sm font-semibold">A pagar</span>
          <span className="text-base font-semibold tabular-nums">{R$(forma === "Dividir" ? resta : total)}</span>
        </div>
        <div className="flex gap-2">
          {menuMais()}
          <Button className="h-9 flex-1 font-semibold" onClick={onBotao}>
            {botao}
          </Button>
        </div>
      </div>
    </aside>
  );

  const trilha = (atual: "carrinho" | "pagamento") => (
    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
      <button
        onClick={() => setEtapa("carrinho")}
        className={cn("hover:text-foreground", atual === "carrinho" && "font-medium text-foreground")}
      >
        Carrinho
      </button>
      <ChevronRight className="h-3 w-3" />
      <button
        onClick={() => setEtapa("pagamento")}
        className={cn("hover:text-foreground", atual === "pagamento" && "font-medium text-foreground")}
      >
        Pagamento
      </button>
    </div>
  );

  const cardForma = ({ value, icon: Icon, sub }: { value: string; icon: typeof Crown; sub?: string }) => (
    <button
      key={value}
      onClick={() => setForma(value)}
      className={cn(
        "flex min-h-[72px] flex-col items-center justify-center gap-1.5 rounded-lg border bg-card p-3 text-[13px] font-medium transition-colors hover:bg-muted",
        forma === value ? "border-2 border-primary bg-primary/[0.06] hover:bg-primary/[0.06]" : "border-border",
      )}
    >
      <Icon className="h-5 w-5" />
      {value}
      {sub && <span className="text-[11px] font-normal text-muted-foreground">{sub}</span>}
    </button>
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 overflow-y-auto p-0 sm:max-w-[920px] md:overflow-hidden [&>button:last-child]:hidden"
      >
        <SheetTitle className="sr-only">Comanda de {agendamento.cliente}</SheetTitle>

        <div className="flex min-h-0 flex-1 flex-col md:flex-row md:overflow-hidden">

        {etapa === "agendamento" && (
          <>
            {/* Cliente */}
            <aside className="flex w-full shrink-0 flex-col border-b border-border md:w-[240px] md:border-b-0 md:border-r md:overflow-y-auto">
              <div className="flex flex-col items-center px-5 pb-4 pt-6 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-xl font-semibold text-primary">
                  {iniciais}
                </div>
                <p className="mt-2.5 text-sm font-semibold">{agendamento.cliente}</p>
                {agendamento.telefone && (
                  <p className="mt-0.5 text-xs text-muted-foreground">{agendamento.telefone}</p>
                )}
                <div className="mt-4 flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="h-8 gap-1 text-xs">
                        Ações <ChevronDown className="h-3.5 w-3.5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="center" className="w-48">
                      <DropdownMenuItem onClick={() => toast("Abrindo perfil")}>Ver perfil</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => toast("Abrindo histórico")}>Histórico de visitas</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setEtapa("carrinho")}>Cobrar avulso</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <WhatsAppButton telefone={agendamento.telefone} nome={agendamento.cliente} />
                </div>
              </div>

              <div className="space-y-3 border-t border-border px-5 py-4 text-xs">
                <div className="rounded-lg bg-muted px-3 py-2">
                  <p className="flex items-center gap-1.5 font-medium">
                    <Crown className="h-3.5 w-3.5" /> Assinante
                  </p>
                  <p className="text-muted-foreground">Plano Especial · ativo</p>
                </div>
                <p className="flex items-start gap-2">
                  <History className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                  <span>
                    Última visita {ultimaVisita.data.slice(0, 5)} · {ultimaVisita.servico}
                  </span>
                </p>
                <p className="flex items-start gap-2">
                  <RefreshCw className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                  <span>Retorno ideal em 28 dias</span>
                </p>

                {editandoObs ? (
                  <div className="space-y-2">
                    <Textarea
                      autoFocus
                      value={obs}
                      onChange={(e) => setObs(e.target.value)}
                      placeholder="Ex: alérgica a dipirona, não cortar franja"
                      className="min-h-[70px] resize-none text-xs"
                    />
                    <Button size="sm" variant="outline" className="h-7 w-full text-xs" onClick={() => setEditandoObs(false)}>
                      Salvar observação
                    </Button>
                  </div>
                ) : obs ? (
                  <button
                    onClick={() => setEditandoObs(true)}
                    className="w-full rounded-lg bg-warning/10 px-3 py-2 text-left"
                  >
                    <span className="flex items-start gap-2">
                      <StickyNote className="mt-0.5 h-3.5 w-3.5 shrink-0" /> {obs}
                    </span>
                  </button>
                ) : (
                  <button
                    onClick={() => setEditandoObs(true)}
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
                  >
                    <StickyNote className="h-3.5 w-3.5" /> Adicionar observação
                  </button>
                )}
              </div>
            </aside>

            {/* Agendamento */}
            <section className="flex min-h-0 min-w-0 flex-1 flex-col">
              <div className="bg-header px-5 py-4 text-header-foreground">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-lg font-semibold tracking-tight">{agendamento.data}</p>
                    <p className="mt-0.5 text-xs opacity-75">
                      {agendamento.inicio} – {agendamento.fim} · {agendamento.profissional}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="inline-flex items-center gap-2 rounded-lg border border-white/25 bg-white/[0.08] px-3 py-1.5 text-xs font-medium hover:bg-white/[0.14]">
                          <span className={cn("h-2 w-2 rounded-full", statusAtual.cor)} />
                          {statusAtual.label}
                          <ChevronDown className="h-3.5 w-3.5" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-44">
                        {statusOpcoes.map((s) => (
                          <DropdownMenuItem key={s.value} onClick={() => setStatus(s.value)}>
                            <span className={cn("mr-2 h-2 w-2 rounded-full", s.cor)} />
                            {s.label}
                            {s.value === status && <Check className="ml-auto h-3.5 w-3.5" />}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <button
                      onClick={() => onOpenChange(false)}
                      className="rounded-md p-1.5 opacity-75 hover:bg-white/10 hover:opacity-100"
                      aria-label="Fechar"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
                <p className={cn(rotulo, "mb-4")}>Itens da comanda</p>
                {listaItens()}
                <Button variant="outline" size="sm" className="mt-5 h-8 gap-1.5 text-xs" onClick={() => setEtapa("carrinho")}>
                  <Plus className="h-3.5 w-3.5" /> Adicionar item
                </Button>
              </div>

              {/* Mesma largura e posição do rodapé do carrinho/pagamento: o botão principal não muda de lugar entre as etapas */}
              <div className="flex flex-col gap-3 border-t border-border pb-4 pt-3 pl-5 pr-4 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Total</p>
                  <p className="text-lg font-semibold tabular-nums">{R$(total)}</p>
                </div>
                <div className="flex gap-2 md:w-[287px]">
                  {menuMais()}
                  <Button className="h-9 flex-1 font-semibold" onClick={() => setEtapa("pagamento")}>
                    Fechar comanda
                  </Button>
                </div>
              </div>
            </section>
          </>
        )}

        {etapa === "carrinho" && (
          <>
            <section className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto px-5 py-4">
              <div className="flex items-center justify-between">
                {trilha("carrinho")}
                <button
                  onClick={() => setEtapa("agendamento")}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeft className="h-3.5 w-3.5" /> Agendamento
                </button>
              </div>
              <h2 className="mb-3 mt-1 text-lg font-semibold tracking-tight">Adicionar à comanda</h2>
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  placeholder="Buscar serviço, produto ou pacote"
                  className="h-9 pl-9 text-sm"
                />
              </div>
              <div className="mb-4 flex flex-wrap gap-1.5">
                {abas.map((a) => (
                  <button
                    key={a.value}
                    onClick={() => {
                      setBusca("");
                      setAba(a.value);
                    }}
                    className={cn("filter-chip", !(aba === a.value && !busca) && "border-border bg-card shadow-none hover:bg-muted")}
                  >
                    {a.label}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {listaCatalogo.map((c) => (
                  <button
                    key={c.nome}
                    onClick={() => adicionar(c)}
                    className="flex min-h-[54px] items-stretch overflow-hidden rounded-lg border border-border bg-card text-left transition-colors hover:bg-muted active:scale-[0.99]"
                  >
                    {c.tipo === "produto" ? (
                      <span className="flex w-12 shrink-0 items-center justify-center bg-muted text-muted-foreground">
                        <Package className="h-4 w-4" />
                      </span>
                    ) : (
                      <span className="w-[3px] shrink-0 bg-primary" />
                    )}
                    <span className="min-w-0 px-3 py-2">
                      <span className="block truncate text-[13px] font-medium">{c.nome}</span>
                      <span className="block truncate text-xs text-muted-foreground">
                        {R$(c.valor)}
                        {c.detalhe && ` · ${c.detalhe}`}
                      </span>
                    </span>
                  </button>
                ))}
                {listaCatalogo.length === 0 && (
                  <p className="text-xs text-muted-foreground">Nada encontrado para “{busca}”.</p>
                )}
              </div>
            </section>
            {painelCarrinho("Continuar para pagamento", () => setEtapa("pagamento"))}
          </>
        )}

        {etapa === "pagamento" && (
          <>
            <section className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto px-5 py-4">
              <div className="flex items-center justify-between">
                {trilha("pagamento")}
                <button
                  onClick={() => setEtapa("agendamento")}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeft className="h-3.5 w-3.5" /> Agendamento
                </button>
              </div>
              <h2 className="mb-4 mt-1 text-lg font-semibold tracking-tight">Forma de pagamento</h2>

              <p className={cn(rotulo, "mb-2")}>Da cliente</p>
              <div className="mb-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {formasDaCliente.map((f) => cardForma(f))}
              </div>

              <p className={cn(rotulo, "mb-2")}>Outras formas</p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {outrasFormas.map((f) => cardForma(f))}
              </div>

              {forma === "Dividir" && (
                <div className="mt-5 rounded-lg border border-border p-3">
                  <p className={cn(rotulo, "mb-2")}>Pagamentos</p>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_1fr_auto]">
                    <Select value={novoPgForma} onValueChange={setNovoPgForma}>
                      <SelectTrigger className="h-9 text-xs">
                        <SelectValue placeholder="Forma" />
                      </SelectTrigger>
                      <SelectContent>
                        {["Pix", "Crédito", "Débito", "Dinheiro", "Créditos"].map((f) => (
                          <SelectItem key={f} value={f}>
                            {f}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      value={novoPgValor}
                      onChange={(e) => setNovoPgValor(e.target.value)}
                      placeholder={resta ? resta.toFixed(2).replace(".", ",") : "Valor"}
                      className="h-9 text-xs"
                    />
                    <Button size="sm" variant="outline" className="h-9 gap-1 text-xs" onClick={addPagamento}>
                      <Plus className="h-3.5 w-3.5" /> Adicionar
                    </Button>
                  </div>
                  {pagamentos.length > 0 && (
                    <ul className="mt-2 space-y-1">
                      {pagamentos.map((p) => (
                        <li key={p.id} className="flex items-center justify-between rounded-md bg-muted px-2.5 py-1.5 text-xs">
                          <span>{p.forma}</span>
                          <span className="flex items-center gap-2 tabular-nums">
                            {R$(p.valor)}
                            <button
                              onClick={() => setPagamentos((prev) => prev.filter((x) => x.id !== p.id))}
                              aria-label="Remover pagamento"
                              className="text-muted-foreground hover:text-destructive"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                  <p className="mt-2 text-right text-xs text-muted-foreground">Resta {R$(resta)}</p>
                </div>
              )}
            </section>
            {painelCarrinho(
              forma && forma !== "Dividir" ? `Cobrar ${R$(total)}` : forma === "Dividir" ? "Concluir pagamento" : "Cobrar",
              cobrar,
            )}
          </>
        )}

        {etapa === "pago" && (
          <section className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-success/10 text-success">
              <Check className="h-7 w-7" />
            </div>
            <h2 className="mt-3 text-xl font-semibold tracking-tight">Comanda paga</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {R$(total)} · {agendamento.cliente}
            </p>
            <div className="mt-6 w-full max-w-sm rounded-xl border border-border p-4 text-left">
              <p className="flex items-center gap-2 text-sm font-semibold">
                <CalendarPlus className="h-4 w-4" /> Agendar retorno?
              </p>
              <p className="mb-3 mt-1 text-xs text-muted-foreground">
                Sugestão: em 28 dias com {agendamento.profissional}, mesmo horário.
              </p>
              <div className="flex gap-2">
                <Button
                  className="h-9 flex-1"
                  onClick={() => {
                    toast.success("Retorno agendado");
                    onOpenChange(false);
                  }}
                >
                  Agendar retorno
                </Button>
                <Button variant="outline" className="h-9 flex-1" onClick={() => onOpenChange(false)}>
                  Agora não
                </Button>
              </div>
            </div>
          </section>
        )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
