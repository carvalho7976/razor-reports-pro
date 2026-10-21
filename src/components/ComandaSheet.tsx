import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
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
  Minus,
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
import { BandeiraCartao } from "@/components/BandeiraCartao";
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
  /** Cartão já salvo no cadastro da cliente, oferecido primeiro no pagamento */
  cartaoSalvo?: { bandeira: string; final: string; validade: string };
  /** Valor do primeiro item, quando a comanda já vem com preço (frente de caixa) */
  valor?: number;
};

type Item = {
  id: number;
  descricao: string;
  detalhe: string;
  valor: number;
  tipo: "servico" | "produto" | "pack";
  assinatura?: boolean;
  qtd?: number;
  semEstoque?: boolean;
  /** Só serviços e pacotes: quem atende e quem ajuda */
  horario?: string;
  profissional?: string;
  /** Preço de tabela, guardado quando o valor é alterado na comanda */
  valorOriginal?: number;
  assistentes?: string[];
};

// Mesmas iniciais e cores do cabeçalho da agenda; fotos fictícias (randomuser.me) só para avaliar o visual
const equipeSalao = [
  { nome: "Cesar", iniciais: "CE", cor: "bg-amber-700 text-white", foto: "https://randomuser.me/api/portraits/men/32.jpg" },
  { nome: "Claudia", iniciais: "CL", cor: "bg-pink-500 text-white", foto: "https://randomuser.me/api/portraits/women/44.jpg" },
  { nome: "Marcia Silva", iniciais: "MS", cor: "bg-rose-400 text-white", foto: "https://randomuser.me/api/portraits/women/65.jpg" },
  { nome: "Matheus", iniciais: "MA", cor: "bg-stone-700 text-white", foto: "https://randomuser.me/api/portraits/men/75.jpg" },
  { nome: "Vini", iniciais: "VI", cor: "bg-indigo-500 text-white", foto: "https://randomuser.me/api/portraits/men/12.jpg" },
];

const FotoProf = ({ nome, tamanho = "h-5 w-5 text-[9px]" }: { nome?: string; tamanho?: string }) => {
  const p = equipeSalao.find((e) => e.nome === nome);
  const [falhou, setFalhou] = useState(false);
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full font-semibold",
        tamanho,
        p?.cor ?? "bg-muted text-muted-foreground",
      )}
    >
      {p?.foto && !falhou ? (
        <img src={p.foto} alt={p.nome} className="h-full w-full object-cover" onError={() => setFalhou(true)} />
      ) : (
        p?.iniciais ?? "?"
      )}
    </span>
  );
};

// Cores das categorias de serviço (as mesmas cadastradas em Categorias)
const categorias: Record<string, string> = {
  Cabelo: "#3b82f6",
  Barba: "#78716c",
  Química: "#a855f7",
  Tratamento: "#00c5b4",
  Unhas: "#ec4899",
  Estética: "#f59e0b",
};

const categoriaDe = (servico: string) => {
  const s = servico.toLowerCase();
  if (/barba/.test(s)) return "Barba";
  if (/colora|mecha|luzes|progressiva|relax/.test(s)) return "Química";
  if (/hidrata|cauteriz|reconstr/.test(s)) return "Tratamento";
  if (/manicure|pedicure|unha|esmalt|pé e mão/.test(s)) return "Unhas";
  if (/sobrancelha|limpeza/.test(s)) return "Estética";
  return "Cabelo";
};

const corCategoria = (servico: string) => categorias[categoriaDe(servico)];

type CatalogoItem = { nome: string; valor: number; detalhe?: string; tipo: Item["tipo"]; semEstoque?: boolean };


type Pagamento = { id: number; forma: string; valor: number };

type Etapa = "agendamento" | "carrinho" | "pagamento" | "pago";

const catalogo: Record<"servicos" | "produtos" | "pacotes" | "assinaturas", CatalogoItem[]> = {
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
    { nome: "Óleo Reparador", valor: 65, tipo: "produto", semEstoque: true },
    { nome: "Água", valor: 5, tipo: "produto" },
  ],
  pacotes: [
    { nome: "Pacote Especial", valor: 150, detalhe: "5 sessões", tipo: "pack" },
  ],
  assinaturas: [
    { nome: "Clube do Corte", valor: 99, detalhe: "por mês · cortes ilimitados", tipo: "pack" },
    { nome: "Corte + Barba", valor: 149, detalhe: "por mês · ilimitado", tipo: "pack" },
    { nome: "Plano Especial", valor: 189, detalhe: "por mês · corte, escova e hidratação", tipo: "pack" },
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
  { value: "assinaturas", label: "Assinaturas" },
  { value: "sugestoes", label: "Sugestões" },
] as const;

type Aba = (typeof abas)[number]["value"];

const R$ = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const rotulo = "text-xs font-medium uppercase tracking-wide text-muted-foreground";

const itensIniciais = (a: ComandaAgendamento | null, variante: "agenda" | "caixa"): Item[] => {
  const servico: Item = {
    id: 1,
    descricao: a?.servico ?? "Serviço",
    detalhe: "",
    horario: a?.inicio || undefined,
    profissional: a?.profissional || undefined,
    assistentes: [],
    valor: a?.valor ?? 0,
    tipo: "servico",
    assinatura: variante === "agenda",
  };
  // Comanda de balcão começa só com o que veio da lista; a da agenda traz o exemplo da água
  return variante === "caixa"
    ? [servico]
    : [
        servico,
        { id: 2, descricao: "Água", detalhe: "Produto", valor: 5, tipo: "produto", qtd: 1, profissional: a?.profissional || undefined },
      ];
};

// Avisos no topo: no canto de baixo cobriam o botão principal da comanda
const noTopo = { position: "top-center" as const };

// Ação principal no padrão do sistema: botão escuro, o mesmo do "Novo" das tabelas
const btnPrincipal = "bg-[hsl(var(--novo-btn))] text-[hsl(var(--novo-btn-foreground))] hover:bg-[hsl(var(--novo-btn)/0.85)]";

const valorItem = (i: Item) => i.valor * (i.qtd ?? 1);

const SeloSemEstoque = () => (
  <span className="inline-block rounded bg-destructive px-1.5 py-0.5 text-[10px] font-semibold text-destructive-foreground">
    Sem estoque
  </span>
);

export function ComandaSheet({
  open,
  onOpenChange,
  agendamento,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  agendamento: ComandaAgendamento | null;
}) {
  if (!agendamento) return null;
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 overflow-y-auto p-0 sm:max-w-[920px] md:overflow-hidden [&>button:last-child]:hidden"
      >
        <SheetTitle className="sr-only">Comanda de {agendamento.cliente}</SheetTitle>
        <ComandaConteudo agendamento={agendamento} onFechar={() => onOpenChange(false)} />
      </SheetContent>
    </Sheet>
  );
}

/**
 * Miolo da comanda, usado na agenda (dentro do Sheet) e na frente de caixa.
 * "agenda" mostra data, horário e status do agendamento; "caixa" é uma comanda de balcão.
 */
export function ComandaConteudo({
  agendamento,
  variante = "agenda",
  onFechar,
}: {
  agendamento: ComandaAgendamento | null;
  variante?: "agenda" | "caixa";
  onFechar: () => void;
}) {
  const [etapa, setEtapa] = useState<Etapa>("agendamento");
  const [status, setStatus] = useState("agendado");
  const [obs, setObs] = useState("");
  const [editandoObs, setEditandoObs] = useState(false);
  const [itens, setItens] = useState<Item[]>(() => itensIniciais(agendamento, variante));
  const [aba, setAba] = useState<Aba>("rapida");
  const [busca, setBusca] = useState("");
  const [forma, setForma] = useState<string | null>(null);
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([]);
  const [novoPgForma, setNovoPgForma] = useState("");
  const [novoPgValor, setNovoPgValor] = useState("");
  const [editandoPreco, setEditandoPreco] = useState<number | null>(null);

  // Cada agendamento aberto começa uma comanda nova
  useEffect(() => {
    setEtapa("agendamento");
    setStatus("agendado");
    setObs("");
    setEditandoObs(false);
    setItens(itensIniciais(agendamento, variante));
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
      return [...catalogo.servicos, ...catalogo.produtos, ...catalogo.pacotes, ...catalogo.assinaturas].filter((i) =>
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

  // Na agenda o número é derivado do agendamento; no caixa a comanda já tem número próprio
  const numeroComanda = variante === "caixa" ? agendamento.id : 10000 + agendamento.id;

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
          detalhe: c.tipo === "produto" ? "Produto" : "",
          profissional: agendamento.profissional || equipeSalao[0].nome,
          assistentes: c.tipo === "produto" ? undefined : [],
          valor: c.valor,
          tipo: c.tipo,
          qtd: c.tipo === "produto" ? 1 : undefined,
          semEstoque: c.semEstoque,
        },
      ];
    });
    toast.success(`${c.nome} adicionado`, noTopo);
  };

  const removerItem = (id: number) => setItens((prev) => prev.filter((i) => i.id !== id));

  const alterarItem = (id: number, mudar: (i: Item) => Item) =>
    setItens((prev) => prev.map((i) => (i.id === id ? mudar(i) : i)));

  const alterarQtd = (id: number, delta: number) =>
    setItens((prev) => prev.map((i) => (i.id === id ? { ...i, qtd: Math.max(1, (i.qtd ?? 1) + delta) } : i)));


  const addPagamento = () => {
    const v = parseFloat(novoPgValor.replace(",", "."));
    if (!novoPgForma || isNaN(v) || v <= 0) {
      toast.error("Escolha a forma e informe o valor", noTopo);
      return;
    }
    setPagamentos((prev) => [...prev, { id: Date.now(), forma: novoPgForma, valor: v }]);
    setNovoPgForma("");
    setNovoPgValor("");
  };

  const cobrar = () => {
    if (!forma) {
      toast.error("Escolha a forma de pagamento", noTopo);
      return;
    }
    if (forma === "Dividir" && resta > 0) {
      toast.error(`Ainda faltam ${R$(resta)}`, noTopo);
      return;
    }
    setStatus("finalizado");
    setEtapa("pago");
  };

  const menuMais = (lado: "top" | "bottom" = "top") => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 text-muted-foreground" aria-label="Mais ações">
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
        <DropdownMenuItem onClick={() => toast("Link copiado", noTopo)}>
          <Copy className="mr-2 h-4 w-4" /> Copiar link
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive focus:text-destructive"
          onClick={() => toast("Agendamento excluído", noTopo)}
        >
          <Trash2 className="mr-2 h-4 w-4" /> {variante === "caixa" ? "Excluir comanda" : "Excluir agendamento"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  // Profissional e assistentes de um serviço, editáveis direto na linha do item
  const disponiveis = (i: Item) =>
    equipeSalao.filter((e) => e.nome !== i.profissional && !(i.assistentes ?? []).includes(e.nome));

  // Profissional e assistentes de um serviço, editáveis direto na linha do item
  const equipe = (i: Item) => (
    <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[13px] text-muted-foreground">
      {i.tipo !== "produto" && i.horario && <span className="mr-0.5">{i.horario}</span>}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="inline-flex h-6 items-center gap-1.5 rounded-[30px] border border-border bg-card pl-0.5 pr-2 text-foreground hover:bg-muted">
            <FotoProf nome={i.profissional} />
            {i.profissional ?? "Profissional"}
            <ChevronDown className="h-3 w-3 text-muted-foreground" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-52">
          {equipeSalao.map((e) => (
            <DropdownMenuItem
              key={e.nome}
              className="gap-2"
              onClick={() =>
                alterarItem(i.id, (it) => ({
                  ...it,
                  profissional: e.nome,
                  assistentes: (it.assistentes ?? []).filter((n) => n !== e.nome),
                }))
              }
            >
              <FotoProf nome={e.nome} tamanho="h-6 w-6 text-[10px]" />
              {e.nome}
              {e.nome === i.profissional && <Check className="ml-auto h-3.5 w-3.5" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      {i.tipo === "produto" && i.qtd !== undefined && (
        <div className="inline-flex h-6 items-center rounded-[30px] border border-border bg-card">
          <button
            onClick={() => alterarQtd(i.id, -1)}
            disabled={i.qtd <= 1}
            className="flex h-full w-6 items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-40"
            aria-label={`Diminuir ${i.descricao}`}
          >
            <Minus className="h-3 w-3" />
          </button>
          <span className="w-5 text-center text-[13px] font-medium tabular-nums text-foreground">{i.qtd}</span>
          <button
            onClick={() => alterarQtd(i.id, 1)}
            className="flex h-full w-6 items-center justify-center text-muted-foreground hover:text-foreground"
            aria-label={`Aumentar ${i.descricao}`}
          >
            <Plus className="h-3 w-3" />
          </button>
        </div>
      )}
      {i.tipo === "produto" && i.qtd !== undefined && i.qtd > 1 && <span>{R$(i.valor)} cada</span>}
      {i.semEstoque && <SeloSemEstoque />}
      {(i.assistentes ?? []).map((nome) => (
        <span key={nome} className="inline-flex h-6 items-center gap-1.5 rounded-[30px] bg-muted pl-0.5 pr-2 text-foreground">
          <FotoProf nome={nome} />
          {nome}
          <button
            onClick={() => alterarItem(i.id, (it) => ({ ...it, assistentes: (it.assistentes ?? []).filter((n) => n !== nome) }))}
            className="text-muted-foreground hover:text-foreground"
            aria-label={`Tirar ${nome} de assistente`}
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}
      {i.tipo !== "produto" && disponiveis(i).length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="inline-flex h-6 items-center gap-1 rounded-[30px] border border-dashed border-border px-2 hover:bg-muted hover:text-foreground">
              <Plus className="h-3 w-3" /> Assistente
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-52">
            {disponiveis(i).map((e) => (
              <DropdownMenuItem
                key={e.nome}
                className="gap-2"
                onClick={() => alterarItem(i.id, (it) => ({ ...it, assistentes: [...(it.assistentes ?? []), e.nome] }))}
              >
                <FotoProf nome={e.nome} tamanho="h-6 w-6 text-[10px]" />
                {e.nome}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );

  // Preço editável: clica no valor, digita e confirma com Enter (Esc cancela)
  // Preço: clique abre um painel com novo valor ou desconto rápido
  const aplicarPreco = (i: Item, novo: number) => {
    const original = i.valorOriginal ?? i.valor;
    alterarItem(i.id, (it) => ({ ...it, valor: Math.max(0, Math.round(novo * 100) / 100), valorOriginal: original }));
  };

  const preco = (i: Item, compacto: boolean) => {
    const original = i.valorOriginal ?? i.valor;
    const alterado = i.valorOriginal !== undefined && i.valorOriginal !== i.valor;
    return (
      <Popover open={editandoPreco === i.id} onOpenChange={(o) => setEditandoPreco(o ? i.id : null)}>
        <PopoverTrigger asChild>
          <button
            title="Alterar preço"
            className={cn(
              "flex flex-col items-end rounded px-1 font-semibold tabular-nums hover:bg-muted",
              compacto ? "text-sm" : "text-sm",
            )}
          >
            {R$(valorItem(i))}
            {alterado && (
              <span className="text-[11px] font-normal text-muted-foreground line-through">
                {R$(original * (i.qtd ?? 1))}
              </span>
            )}
          </button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-60 p-3">
          <p className="text-[13px] font-semibold">Preço de {i.descricao}</p>
          <p className="mb-2 text-xs text-muted-foreground">Tabela: {R$(original)}{i.qtd && i.qtd > 1 ? " cada" : ""}</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const campo = new FormData(e.currentTarget).get("valor")?.toString() ?? "";
              const v = parseFloat(campo.replace(/\./g, "").replace(",", "."));
              if (!isNaN(v) && v >= 0) aplicarPreco(i, v);
              setEditandoPreco(null);
            }}
            className="flex gap-1.5"
          >
            <div className="relative flex-1">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[13px] text-muted-foreground">R$</span>
              <Input
                name="valor"
                autoFocus
                defaultValue={i.valor.toFixed(2).replace(".", ",")}
                className="h-8 pl-8 text-[13px] tabular-nums"
                aria-label="Novo preço"
              />
            </div>
            <Button type="submit" size="sm" className={cn("h-8 text-[13px]", btnPrincipal)}>
              Aplicar
            </Button>
          </form>
          <p className="mb-1.5 mt-3 text-xs text-muted-foreground">Desconto rápido</p>
          <div className="grid grid-cols-4 gap-1">
            {[5, 10, 15, 20].map((pct) => (
              <button
                key={pct}
                onClick={() => {
                  aplicarPreco(i, original * (1 - pct / 100));
                  setEditandoPreco(null);
                }}
                className="rounded-md border border-border py-1 text-[13px] hover:bg-muted"
              >
                {pct}%
              </button>
            ))}
          </div>
          {alterado && (
            <button
              onClick={() => {
                aplicarPreco(i, original);
                setEditandoPreco(null);
              }}
              className="mt-2.5 text-[13px] text-info hover:underline"
            >
              Voltar ao preço de tabela
            </button>
          )}
        </PopoverContent>
      </Popover>
    );
  };

  const listaItens = (compacto = false) => (
    <div className={cn("space-y-3", compacto && "space-y-2.5")}>
      {itens.length === 0 && <p className="text-[13px] text-muted-foreground">Nenhum item na comanda.</p>}
      {itens.map((i) => (
        <div
          key={i.id}
          className={cn("group border-l-[3px] py-1 pl-3", i.tipo === "produto" && "border-border")}
          style={i.tipo === "produto" ? undefined : { borderLeftColor: corCategoria(i.descricao) }}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className={cn("truncate font-medium", compacto ? "text-sm" : "text-sm")}>
                {i.descricao}
                {i.assinatura && (
                  <span className="ml-1.5 rounded-full bg-muted px-1.5 py-0.5 align-middle text-[10px] font-medium text-muted-foreground">
                    Assinatura
                  </span>
                )}
              </p>
              {equipe(i)}
            </div>
            <div className="flex items-center gap-1">
              {preco(i, compacto)}
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

  // Card da cliente: o mesmo em todas as etapas (agendamento, carrinho e pagamento)
  const subtituloCliente = agendamento.telefone ?? [agendamento.data, agendamento.inicio].filter(Boolean).join(" · ");
  const cartaoCliente = () => (
    <div className="m-4 rounded-xl border border-border p-3">
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{agendamento.cliente}</p>
          <p className="truncate text-[13px] text-muted-foreground">{subtituloCliente}</p>
        </div>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted text-[13px] font-semibold text-foreground">
          {iniciais}
        </div>
      </div>
      <div className="mt-2 flex items-center justify-between gap-2 border-t border-border pt-2 text-[13px] text-muted-foreground">
        <span className="flex min-w-0 items-center gap-1.5 truncate">
          <Crown className="h-3.5 w-3.5 shrink-0" /> Assinante · R$ 0,00 em créditos
        </span>
        <div className="flex shrink-0 items-center gap-1">
          <WhatsAppButton telefone={agendamento.telefone} nome={agendamento.cliente} />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="inline-flex items-center gap-0.5 rounded px-1 font-medium text-foreground hover:bg-muted">
                Ações <ChevronDown className="h-3 w-3" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => toast("Abrindo perfil", noTopo)}>Ver perfil</DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast("Abrindo ficha da cliente", noTopo)}>Ver ficha</DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast("Abrindo histórico", noTopo)}>Histórico de visitas</DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast.success(`Lembrete enviado para ${agendamento.cliente}`, noTopo)}>
                Enviar lembrete
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setEtapa("carrinho")}>Cobrar avulso</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );

  // Recompra: aparece em todas as etapas enquanto houver sugestão
  const faixaSugestoes = (classe: string) =>
    recompraSugestoes.length > 0 && (
      <button
        onClick={() => {
          setBusca("");
          setAba("sugestoes");
          setEtapa("carrinho");
        }}
        className={cn(
          "flex items-center justify-between rounded-lg bg-info/10 px-3 py-2 text-[13px] font-medium text-info transition-colors hover:bg-info/15",
          classe,
        )}
      >
        <span className="flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5" /> {recompraSugestoes.length} sugestões de recompra
        </span>
        <ChevronRight className="h-3.5 w-3.5" />
      </button>
    );

  // Coluna direita do carrinho e do pagamento
  const painelCarrinho = (botao: string, onBotao: () => void) => (
    <aside className="flex min-h-0 w-full flex-col border-t border-border md:w-[320px] md:border-l md:border-t-0">
      {cartaoCliente()}

      <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-2">
        {listaItens(true)}
      </div>

      {faixaSugestoes("mx-4 mb-3")}

      <div className="space-y-1 px-4 pb-3 text-[13px] text-muted-foreground">
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
          <span className="text-lg font-semibold tabular-nums">{R$(forma === "Dividir" ? resta : total)}</span>
        </div>
        <div className="flex gap-2">
          <Button className={cn("h-9 flex-1 font-semibold", btnPrincipal)} onClick={onBotao}>
            {botao}
          </Button>
        </div>
      </div>
    </aside>
  );

  const trilha = (atual: "carrinho" | "pagamento") => (
    <div className="flex items-center gap-1.5 text-[13px] text-muted-foreground">
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

  const cardForma = ({
    value,
    icon: Icon,
    sub,
    marca,
  }: {
    value: string;
    icon?: typeof Crown;
    sub?: string;
    /** Logo colorido no lugar do ícone (ex.: bandeira do cartão salvo) */
    marca?: ReactNode;
  }) => (
    <button
      key={value}
      onClick={() => setForma(value)}
      className={cn(
        "flex items-center gap-2.5 rounded-lg border bg-card px-3 py-2.5 text-left text-sm transition-colors hover:bg-muted/60",
        forma === value ? "border-foreground/70 bg-muted/60" : "border-border",
      )}
    >
      {marca ??
        (Icon && <Icon className={cn("h-4 w-4 shrink-0", forma === value ? "text-foreground" : "text-muted-foreground")} />)}
      <span className="min-w-0 flex-1">
        <span className="block truncate font-medium">{value}</span>
        {sub && <span className="block truncate text-xs text-muted-foreground">{sub}</span>}
      </span>
      <span
        className={cn(
          "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border",
          forma === value ? "border-foreground bg-foreground text-background" : "border-border",
        )}
      >
        {forma === value && <Check className="h-2.5 w-2.5" />}
      </span>
    </button>
  );

  return (
        <div className="flex min-h-0 flex-1 flex-col md:flex-row md:overflow-hidden">

        {etapa === "agendamento" && (
          <div className="flex min-h-0 min-w-0 flex-1 flex-col">

            <div className="flex min-h-0 flex-1 flex-col md:flex-row md:overflow-hidden">
              <section className="flex min-h-0 min-w-0 flex-1 flex-col">
                <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">#{numeroComanda}</p>
                    <p className="truncate text-[13px] text-muted-foreground">
                      {variante === "caixa"
                        ? `Aberta em ${agendamento.data} · Balcão`
                        : `${agendamento.data} · ${agendamento.inicio}–${agendamento.fim} · ${agendamento.profissional}`}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <span
                      className={cn(
                        "rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                        status === "finalizado" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground",
                      )}
                    >
                      {status === "finalizado" ? "Paga" : "Em aberto"}
                    </span>
                    {variante === "agenda" && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="inline-flex h-8 items-center gap-2 rounded-md border border-border bg-card px-2.5 text-[13px] font-medium hover:bg-muted">
                            <span className={cn("h-2 w-2 rounded-full", statusAtual.cor)} />
                            {statusAtual.label}
                            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
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
                    )}
                    {menuMais("bottom")}
                    {variante === "agenda" && (
                      <button
                        onClick={() => onFechar()}
                        className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                        aria-label="Fechar"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
                <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
                  <div className="mb-4 flex items-center justify-between gap-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-foreground">Itens da comanda</p>
                    <button onClick={() => setEtapa("carrinho")} className="text-[13px] font-medium text-info hover:underline">
                      + Adicionar item
                    </button>
                  </div>
                  {listaItens()}
                </div>
              </section>

              {/* Dados da cliente + total: mesma largura e rodapé do carrinho, o botão principal não muda de lugar */}
              <aside className="flex w-full shrink-0 flex-col border-t border-border md:w-[320px] md:border-l md:border-t-0">
                <div className="min-h-0 flex-1 overflow-y-auto">
                {cartaoCliente()}
                <div className="space-y-4 px-4 pb-4 text-[13px]">
                  <dl className="grid grid-cols-4 divide-x divide-border">
                    {[
                      { label: "Moedas", valor: "0" },
                      { label: "Packs", valor: "1" },
                      { label: "Débitos", valor: R$(0) },
                      { label: "Créditos", valor: R$(0) },
                    ].map(({ label, valor }) => (
                      <div key={label} className="px-2 first:pl-0">
                        <dt className="text-xs text-muted-foreground">{label}</dt>
                        <dd className="text-sm font-medium tabular-nums">{valor}</dd>
                      </div>
                    ))}
                  </dl>
                  <div className="space-y-2.5 border-t border-border pt-4">
                    <p className="flex items-start gap-2">
                      <Crown className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                      <span>Plano Especial · ativo</span>
                    </p>
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
                          className="min-h-[70px] resize-none text-[13px]"
                        />
                        <Button size="sm" variant="outline" className="h-7 w-full text-[13px]" onClick={() => setEditandoObs(false)}>
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
                </div>
                </div>
                {faixaSugestoes("mx-4 mb-3")}
                <div className="border-t border-border p-4">
                  <div className="mb-3 flex items-baseline justify-between">
                    <span className="text-sm font-semibold">Total</span>
                    <span className="text-lg font-semibold tabular-nums">{R$(total)}</span>
                  </div>
                  <div className="flex gap-2">
                    {/* Cartão salvo: paga direto daqui, sem passar pelo carrinho (como o "Pay now" da Fresha) */}
                    {agendamento.cartaoSalvo && (
                      <Button
                        variant="outline"
                        className="h-9 flex-1 gap-1.5 font-semibold"
                        title={`Cobrar ${R$(total)} no ${agendamento.cartaoSalvo.bandeira} final ${agendamento.cartaoSalvo.final}`}
                        onClick={() => {
                          setForma(`${agendamento.cartaoSalvo!.bandeira} •••• ${agendamento.cartaoSalvo!.final}`);
                          setStatus("finalizado");
                          setEtapa("pago");
                        }}
                      >
                        Pagar •••• {agendamento.cartaoSalvo.final}
                        <BandeiraCartao bandeira={agendamento.cartaoSalvo.bandeira} />
                      </Button>
                    )}
                    <Button className={cn("h-9 flex-1 font-semibold", btnPrincipal)} onClick={() => setEtapa("pagamento")}>
                      Fechar comanda
                    </Button>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        )}

        {etapa === "carrinho" && (
          <>
            <section className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto px-5 py-4">
              <div className="flex items-center justify-between">
                {trilha("carrinho")}
                <button
                  onClick={() => setEtapa("agendamento")}
                  className="flex items-center gap-1 text-[13px] text-muted-foreground hover:text-foreground"
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
              <div className="mb-4 flex flex-wrap border-b border-border">
                {abas.map((a) => {
                  const ativa = aba === a.value && !busca;
                  const qtd = a.value === "rapida" ? undefined : a.value === "sugestoes" ? recompraSugestoes.length : catalogo[a.value].length;
                  return (
                    <button
                      key={a.value}
                      onClick={() => {
                        setBusca("");
                        setAba(a.value);
                      }}
                      className={cn(
                        "-mb-px whitespace-nowrap border-b-2 px-3 py-2 text-[13px] font-medium transition-colors",
                        ativa
                          ? "border-foreground text-foreground"
                          : "border-transparent text-muted-foreground hover:border-muted-foreground/30 hover:text-foreground",
                      )}
                    >
                      {a.label}
                      {qtd !== undefined && (
                        <span
                          className={cn(
                            "ml-1.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold tabular-nums",
                            ativa ? "bg-foreground text-background" : "bg-muted text-muted-foreground",
                          )}
                        >
                          {qtd}
                        </span>
                      )}
                    </button>
                  );
                })}
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
                      <span className="w-[3px] shrink-0" style={{ backgroundColor: corCategoria(c.nome) }} />
                    )}
                    <span className="min-w-0 px-3 py-2">
                      <span className="block truncate text-sm font-medium">{c.nome}</span>
                      <span className="block truncate text-[13px] text-muted-foreground">
                        {R$(c.valor)}
                        {c.detalhe && ` · ${c.detalhe}`}
                      </span>
                      {c.semEstoque && (
                        <span className="mt-1 block">
                          <SeloSemEstoque />
                        </span>
                      )}
                    </span>
                  </button>
                ))}
                {listaCatalogo.length === 0 && (
                  <p className="text-[13px] text-muted-foreground">Nada encontrado para “{busca}”.</p>
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
                  className="flex items-center gap-1 text-[13px] text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeft className="h-3.5 w-3.5" /> Agendamento
                </button>
              </div>
              <h2 className="mb-4 mt-1 text-lg font-semibold tracking-tight">Forma de pagamento</h2>

              <p className={cn(rotulo, "mb-2")}>Da cliente</p>
              <div className="mb-5 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {agendamento.cartaoSalvo &&
                  cardForma({
                    value: `${agendamento.cartaoSalvo.bandeira} •••• ${agendamento.cartaoSalvo.final}`,
                    marca: <BandeiraCartao bandeira={agendamento.cartaoSalvo.bandeira} className="h-6 w-9" />,
                    sub: `Salvo · vence ${agendamento.cartaoSalvo.validade}`,
                  })}
                {formasDaCliente.map((f) => cardForma(f))}
              </div>

              <p className={cn(rotulo, "mb-2")}>Outras formas</p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {outrasFormas.map((f) => cardForma(f))}
              </div>

              {forma === "Dividir" && (
                <div className="mt-5 rounded-lg border border-border p-3">
                  <p className={cn(rotulo, "mb-2")}>Pagamentos</p>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_1fr_auto]">
                    <Select value={novoPgForma} onValueChange={setNovoPgForma}>
                      <SelectTrigger className="h-9 text-[13px]">
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
                      className="h-9 text-[13px]"
                    />
                    <Button size="sm" variant="outline" className="h-9 gap-1 text-[13px]" onClick={addPagamento}>
                      <Plus className="h-3.5 w-3.5" /> Adicionar
                    </Button>
                  </div>
                  {pagamentos.length > 0 && (
                    <ul className="mt-2 space-y-1">
                      {pagamentos.map((p) => (
                        <li key={p.id} className="flex items-center justify-between rounded-md bg-muted px-2.5 py-1.5 text-[13px]">
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
                  <p className="mt-2 text-right text-[13px] text-muted-foreground">Resta {R$(resta)}</p>
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
              {forma && ` · ${forma}`}
            </p>
            <div className="mt-6 w-full max-w-sm rounded-xl border border-border p-4 text-left">
              <p className="flex items-center gap-2 text-sm font-semibold">
                <CalendarPlus className="h-4 w-4" /> Agendar retorno?
              </p>
              <p className="mb-3 mt-1 text-[13px] text-muted-foreground">
                Sugestão: em 28 dias com {agendamento.profissional}, mesmo horário.
              </p>
              <div className="flex gap-2">
                <Button
                  className={cn("h-9 flex-1", btnPrincipal)}
                  onClick={() => {
                    toast.success("Retorno agendado", noTopo);
                    onFechar();
                  }}
                >
                  Agendar retorno
                </Button>
                <Button variant="outline" className="h-9 flex-1" onClick={() => onFechar()}>
                  Agora não
                </Button>
              </div>
            </div>
          </section>
        )}
        </div>
  );
}
