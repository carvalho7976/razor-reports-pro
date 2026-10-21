import { useEffect, useMemo, useState, type ReactNode } from "react";
import type React from "react";
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
  Gift,
  History,
  Link2,
  Minus,
  MoreHorizontal,
  MoreVertical,
  ArrowDown,
  ArrowUp,
  Package,
  ReceiptText,
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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
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
  /** Comanda recém-aberta no caixa: começa vazia e já no catálogo */
  nova?: boolean;
  /** De onde veio a comanda (Balcão, Agenda...). Padrão: Balcão */
  origem?: string;
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
  /** Serviço coberto por assinatura ou pacote da cliente: sai zerado, com o motivo */
  cobertura?: Cobertura;
  qtd?: number;
  semEstoque?: boolean;
  /** Só serviços e pacotes: quem atende e quem ajuda */
  horario?: string;
  profissional?: string;
  /** Preço de tabela, guardado quando o valor é alterado na comanda */
  valorOriginal?: number;
  gratuito?: boolean;
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

// Exemplo: a cliente assina o "Plano Especial" (cabelo ilimitado) e tem um pacote de hidratação
const coberturaPara = (servico: string): Cobertura | undefined => {
  if (/pacote/i.test(servico)) return { tipo: "pacote", nome: servico, detalhe: "sessão 2 de 5" };
  const cat = categoriaDe(servico);
  if (cat === "Cabelo") return { tipo: "assinatura", nome: "Plano Especial", detalhe: "cortes e escova ilimitados" };
  if (cat === "Tratamento") return { tipo: "pacote", nome: "Pacote Hidratação", detalhe: "sessão 3 de 5" };
  return undefined;
};

type Cobertura = { tipo: "assinatura" | "pacote"; nome: string; detalhe: string };

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

const precoTabela = (servico: string) =>
  catalogo.servicos.find((c) => c.nome.toLowerCase() === servico.toLowerCase())?.valor ??
  (/pacote/i.test(servico) ? 30 : 50);

const recompraSugestoes: CatalogoItem[] = [
  { nome: "Pomada Modeladora", valor: 49, detalhe: "comprou há 28 dias", tipo: "produto" },
  { nome: "Shampoo Anticaspa", valor: 38, detalhe: "comprou há 45 dias", tipo: "produto" },
];

const ultimaVisita = { data: "27/04/2026", servico: "Corte Feminino", prof: "Matheus" };

// Exemplo: pacotes ativos da cliente (sessões usadas de um total)
const pacotesCliente = [
  { nome: "Pacote Hidratação", usadas: 2, total: 5 },
  { nome: "Pacote Escova", usadas: 7, total: 10 },
];

type Observacao = { id: number; texto: string; data: string; autor: string };

const observacoesExemplo: Observacao[] = [
  { id: 1, texto: "Alérgica a dipirona.", data: "12/03/2026", autor: "Lara" },
  { id: 2, texto: "Prefere não cortar a franja.", data: "27/04/2026", autor: "Matheus" },
];

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

// Título de seção: um só padrão em todas as etapas (Itens da comanda, Adicionar, Forma de pagamento...)
// Título de grupo da coluna da cliente: menor e mais discreto que o título de seção
// Cor suave do avatar da cliente, estável pelo nome
const coresAvatar = [
  "bg-blue-100 text-blue-800",
  "bg-emerald-100 text-emerald-800",
  "bg-amber-100 text-amber-800",
  "bg-pink-100 text-pink-800",
  "bg-violet-100 text-violet-800",
  "bg-teal-100 text-teal-800",
];
const corAvatar = (nome: string) => coresAvatar[[...nome].reduce((a, ch) => a + ch.charCodeAt(0), 0) % coresAvatar.length];

const tituloGrupo = "text-[11px] font-semibold uppercase tracking-wide text-muted-foreground";

const tituloSecao = "text-xs font-semibold uppercase tracking-wide text-foreground";

const itensIniciais = (a: ComandaAgendamento | null, variante: "agenda" | "caixa"): Item[] => {
  if (a?.nova) return [];
  const servico: Item = {
    id: 1,
    descricao: a?.servico ?? "Serviço",
    detalhe: "",
    horario: a?.inicio || undefined,
    profissional: a?.profissional || undefined,
    assistentes: [],
    valor: a?.valor ?? 0,
    tipo: "servico",
  };
  // Na agenda, o serviço agendado já entra com a cobertura da assinatura/pacote da cliente
  const cob = variante === "agenda" && a ? coberturaPara(a.servico) : undefined;
  if (cob && a) {
    servico.cobertura = cob;
    servico.valorOriginal = precoTabela(a.servico);
    servico.valor = 0;
  }
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
// Frente de caixa: cada coluna da comanda vira um card separado
const cartaoColuna = "overflow-hidden rounded-xl bg-card";

const btnPrincipal = "bg-[hsl(var(--novo-btn))] text-[hsl(var(--novo-btn-foreground))] hover:bg-[hsl(var(--novo-btn)/0.85)]";

// Campos de dinheiro: ao clicar já seleciona tudo, para digitar por cima sem apagar
const selecionarTudo = (e: React.FocusEvent<HTMLInputElement> | React.MouseEvent<HTMLInputElement>) =>
  e.currentTarget.select();

const valorItem = (i: Item) => (i.gratuito ? 0 : i.valor * (i.qtd ?? 1));

// Por onde o pagamento entra: maquininha (Rede) para cartão, Pix, caixa ou saldo da cliente
const OrigemPagamento = ({ forma }: { forma: string }) => {
  const f = forma.toLowerCase();
  if (/crédito|débito|••••|link/.test(f) && f !== "créditos") {
    return (
      <span className="inline-flex h-6 items-center justify-center rounded-full bg-[#FF6B00] px-2 text-[10px] font-bold lowercase tracking-tight text-white">
        rede
      </span>
    );
  }
  const rotuloOrigem = f === "pix" ? "Pix" : f === "dinheiro" ? "Caixa" : "Cliente";
  return (
    <span className="inline-flex h-6 items-center rounded-full bg-muted px-2 text-[11px] font-medium text-muted-foreground">
      {rotuloOrigem}
    </span>
  );
};

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
  const [etapa, setEtapa] = useState<Etapa>(agendamento?.nova ? "carrinho" : "agendamento");
  const [status, setStatus] = useState("agendado");
  const [observacoes, setObservacoes] = useState<Observacao[]>(observacoesExemplo);
  const [obs, setObs] = useState("");
  const [editandoObs, setEditandoObs] = useState(false);
  // Recolhíveis: com um único item já nascem abertos; com vários, recolhidos
  const [pacotesAbertos, setPacotesAbertos] = useState(pacotesCliente.length === 1);
  const [obsAbertas, setObsAbertas] = useState(observacoes.length === 1);
  const [itens, setItens] = useState<Item[]>(() => itensIniciais(agendamento, variante));
  const [aba, setAba] = useState<Aba>("rapida");
  const [busca, setBusca] = useState("");
  const [forma, setForma] = useState<string | null>(null);
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([]);
  const [novoPgForma, setNovoPgForma] = useState("");
  const [novoPgValor, setNovoPgValor] = useState("");
  const [editandoPreco, setEditandoPreco] = useState<number | null>(null);
  // Confirmação antes de finalizar (valor recebido, crédito, comprovante e nota)
  const [confirmando, setConfirmando] = useState(false);
  const [recebido, setRecebido] = useState("");
  const [lancarCredito, setLancarCredito] = useState(true);
  const [imprimir, setImprimir] = useState(false);
  const [emitirNota, setEmitirNota] = useState(false);
  const [resumoPago, setResumoPago] = useState<string[]>([]);

  // Ficou com uma só observação (apagou ou é a primeira): abre sozinha
  useEffect(() => {
    if (observacoes.length === 1) setObsAbertas(true);
  }, [observacoes.length]);

  // Cada agendamento aberto começa uma comanda nova
  useEffect(() => {
    setEtapa(agendamento?.nova ? "carrinho" : "agendamento");
    setStatus("agendado");
    setObs("");
    setObservacoes(observacoesExemplo);
    setEditandoObs(false);
    setItens(itensIniciais(agendamento, variante));
    setAba("rapida");
    setBusca("");
    setForma(null);
    setPagamentos([]);
    setResumoPago([]);
    setConfirmando(false);
  }, [agendamento?.id]);

  const total = useMemo(() => itens.reduce((s, i) => s + valorItem(i), 0), [itens]);
  const pagoAteAgora = pagamentos.reduce((s, p) => s + p.valor, 0);

  // No pagamento dividido, o campo de valor já vem com o que falta pagar
  useEffect(() => {
    if (forma !== "Dividir") return;
    const falta = Math.max(0, total - pagoAteAgora);
    setNovoPgValor(falta > 0 ? falta.toFixed(2).replace(".", ",") : "");
  }, [forma, total, pagoAteAgora]);
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

  // Serviço novo: antes de entrar na comanda, escolhe quem atende e quem ajuda
  const [escolhendoEquipe, setEscolhendoEquipe] = useState<CatalogoItem | null>(null);
  const [profEscolhida, setProfEscolhida] = useState("");
  const [assistEscolhidos, setAssistEscolhidos] = useState<string[]>([]);

  // Todo item (serviço, produto, pack) passa pela escolha de quem vendeu/atendeu
  const escolherItem = (c: CatalogoItem) => {
    // Já vem marcada a profissional da comanda, então o caso comum é um clique só em "Adicionar"
    setProfEscolhida(agendamento.profissional || equipeSalao[0].nome);
    setAssistEscolhidos([]);
    setEscolhendoEquipe(c);
  };

  const adicionar = (c: CatalogoItem, equipeItem?: { profissional: string; assistentes: string[] }) => {
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
          profissional: equipeItem?.profissional ?? (agendamento.profissional || equipeSalao[0].nome),
          assistentes: c.tipo === "produto" ? undefined : equipeItem?.assistentes ?? [],
          ...(c.tipo === "servico" && coberturaPara(c.nome)
            ? { valor: 0, valorOriginal: c.valor, cobertura: coberturaPara(c.nome) }
            : { valor: c.valor }),
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
    abrirConfirmacao();
  };

  const abrirConfirmacao = () => {
    setRecebido(total.toFixed(2).replace(".", ","));
    setLancarCredito(true);
    setConfirmando(true);
  };

  const linhasPagamento =
    forma === "Dividir" ? pagamentos.map((p) => ({ forma: p.forma, valor: p.valor })) : [{ forma: forma ?? "", valor: total }];
  const valorRecebido = (() => {
    const v = parseFloat(recebido.replace(/\./g, "").replace(",", "."));
    return isNaN(v) ? total : v;
  })();
  const excedente = forma === "Dividir" ? Math.max(0, pago - total) : Math.max(0, valorRecebido - total);

  const confirmarPagamento = () => {
    const resumo: string[] = [];
    if (excedente > 0) {
      resumo.push(
        lancarCredito ? `${R$(excedente)} lançados como crédito da cliente` : `Troco de ${R$(excedente)}`,
      );
    }
    if (imprimir) resumo.push("Comprovante enviado para impressão");
    if (emitirNota) resumo.push("Nota fiscal emitida");
    setResumoPago(resumo);
    setConfirmando(false);
    setStatus("finalizado");
    setEtapa("pago");
  };

  const menuMais = (lado: "top" | "bottom" = "top") => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 text-muted-foreground hover:bg-muted hover:text-foreground" aria-label="Mais ações">
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
            {(alterado || i.gratuito) && (
              <span className="text-[11px] font-normal text-muted-foreground line-through">
                {R$((i.gratuito ? i.valor : original) * (i.qtd ?? 1))}
              </span>
            )}
          </button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-60 p-3">
          <p className="text-[13px] font-semibold">Preço de {i.descricao}</p>
          <p className="mb-2 text-xs text-muted-foreground">Tabela: {R$(original)}{i.qtd && i.qtd > 1 ? " cada" : ""}</p>
          <label className="mb-3 flex cursor-pointer items-center justify-between rounded-md border border-border px-2.5 py-2 text-[13px]">
            Cortesia
            <Switch
              checked={!!i.gratuito}
              onCheckedChange={(v) => alterarItem(i.id, (it) => ({ ...it, gratuito: v }))}
            />
          </label>
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
                onFocus={selecionarTudo}
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
          {i.cobertura ? (
            <div className="mt-3 rounded-md bg-success/10 px-2.5 py-2 text-xs text-success">
              Coberto {i.cobertura.tipo === "assinatura" ? "pela assinatura" : "pelo pacote"} {i.cobertura.nome} (
              {i.cobertura.detalhe}).
              <button
                onClick={() => {
                  alterarItem(i.id, (it) => ({ ...it, valor: original, cobertura: undefined }));
                  setEditandoPreco(null);
                }}
                className="mt-1 block font-medium text-info hover:underline"
              >
                Cobrar normalmente
              </button>
            </div>
          ) : (
            alterado && (
              <button
                onClick={() => {
                  aplicarPreco(i, original);
                  setEditandoPreco(null);
                }}
                className="mt-2.5 text-[13px] text-info hover:underline"
              >
                Voltar ao preço de tabela
              </button>
            )
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
              </p>
              {i.cobertura && (
                <p className="mt-0.5 flex items-center gap-1 truncate text-xs font-medium text-success">
                  {i.cobertura.tipo === "assinatura" ? (
                    <Crown className="h-3.5 w-3.5 shrink-0" />
                  ) : (
                    <Package className="h-3.5 w-3.5 shrink-0" />
                  )}
                  {i.cobertura.tipo === "assinatura" ? `Assinatura ${i.cobertura.nome}` : i.cobertura.nome} · {i.cobertura.detalhe}
                </p>
              )}
              {i.gratuito && (
                <p className="mt-0.5 flex items-center gap-1 truncate text-xs font-medium text-success">
                  <Gift className="h-3.5 w-3.5 shrink-0" /> Cortesia
                </p>
              )}
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

  // Cabeçalho da cliente: o mesmo em todas as etapas (sem moldura; visita e retorno ficam no menu ⋯)
  const subtituloCliente = agendamento.telefone ?? [agendamento.data, agendamento.inicio].filter(Boolean).join(" · ");
  const cartaoCliente = () => (
    <div>
    <div className="flex items-center gap-3 px-4 pb-3 pt-4">
      <div className="relative shrink-0">
        <div
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-full text-[15px] font-semibold",
            corAvatar(agendamento.cliente),
          )}
        >
          {iniciais}
        </div>
        <span
          className="absolute -bottom-0.5 -right-0.5 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-card"
          title={planoAtrasado ? "Assinante com plano atrasado" : "Assinante"}
        >
          <Crown className={cn("h-3 w-3", planoAtrasado ? "text-destructive" : "text-warning")} />
        </span>
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[15px] font-semibold leading-tight">{agendamento.cliente}</p>
        <p className="truncate text-[13px] text-muted-foreground">{subtituloCliente}</p>
      </div>
      <WhatsAppButton telefone={agendamento.telefone} nome={agendamento.cliente} botao />
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
        <DropdownMenuContent align="end" className="w-60">
          <DropdownMenuItem onClick={() => toast("Abrindo perfil", noTopo)}>Ver perfil</DropdownMenuItem>
          <DropdownMenuItem onClick={() => toast("Abrindo ficha da cliente", noTopo)}>Ver ficha</DropdownMenuItem>
          <DropdownMenuItem className="items-start" onClick={() => toast("Abrindo histórico", noTopo)}>
            <History className="mr-2 mt-0.5 h-4 w-4" />
            <span>
              Histórico de visitas
              <span className="block text-xs text-muted-foreground">
                Última {ultimaVisita.data.slice(0, 5)} · {ultimaVisita.servico}
              </span>
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem className="items-start" onClick={() => toast("Abrindo agenda para o retorno", noTopo)}>
            <RefreshCw className="mr-2 mt-0.5 h-4 w-4" />
            <span>
              Agendar retorno
              <span className="block text-xs text-muted-foreground">Ideal em 28 dias</span>
            </span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => toast.success(`Lembrete enviado para ${agendamento.cliente}`, noTopo)}>
            Enviar lembrete
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setEtapa("carrinho")}>Cobrar avulso</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
    {saldosCliente()}
    </div>
  );

  // Saldos: só aparecem os que a cliente tem; crédito em azul, débito em vermelho
  // Exemplo: valores variam pelo nº da comanda
  const par = agendamento.id % 2 === 0;
  const saldos = [
    { label: "Moedas", icon: Coins, n: par ? 12 : 0, valor: String(par ? 12 : 0), cor: "" },
    { label: "Packs", icon: Package, n: pacotesCliente.length, valor: String(pacotesCliente.length), cor: "" },
    { label: "Débitos (a cliente deve)", icon: ArrowDown, n: 45, valor: R$(45), cor: "text-destructive" },
    { label: "Créditos (saldo a favor)", icon: ArrowUp, n: par ? 30 : 0, valor: R$(par ? 30 : 0), cor: "text-info" },
  ].filter((s) => s.n > 0);
  const planoAtrasado = !par;
  const saldosCliente = () => saldos.length > 0 && (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 px-4 pb-3">
      {saldos.map(({ label, icon: Icone, valor, cor }) => (
        <Tooltip key={label}>
          <TooltipTrigger asChild>
            <span className={cn("flex cursor-default items-center gap-1.5 whitespace-nowrap text-sm font-medium tabular-nums", cor)}>
              <Icone className={cn("h-4 w-4 shrink-0", cor || "text-muted-foreground")} />
              {valor}
            </span>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="text-xs">
            {label}
          </TooltipContent>
        </Tooltip>
      ))}
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
    <aside className={cn("flex min-h-0 w-full flex-col md:w-[320px]", variante === "caixa" ? cartaoColuna : "border-t border-border md:border-l md:border-t-0")}>
      {cartaoCliente()}

      <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
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
    rotulo,
  }: {
    value: string;
    /** Texto exibido no card quando difere do valor da forma (ex.: só o final do cartão) */
    rotulo?: string;
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
        <span className="block truncate font-medium">{rotulo ?? value}</span>
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
        <div className={cn("flex min-h-0 flex-1 flex-col md:flex-row md:overflow-hidden", variante === "caixa" && "gap-4")}>

        {etapa === "agendamento" && (
          <div className="flex min-h-0 min-w-0 flex-1 flex-col">

            <div className={cn("flex min-h-0 flex-1 flex-col md:flex-row md:overflow-hidden", variante === "caixa" && "gap-4")}>
              <section className={cn("flex min-h-0 min-w-0 flex-1 flex-col", variante === "caixa" && cartaoColuna)}>
                <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                      <ReceiptText className="h-[18px] w-[18px]" />
                    </span>
                    <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">#{numeroComanda}</p>
                    <p className="truncate text-[13px] text-muted-foreground">
                      {variante === "caixa"
                        ? agendamento.origem ?? "Balcão"
                        : `${agendamento.data} · ${agendamento.inicio}–${agendamento.fim} · ${agendamento.profissional}`}
                    </p>
                    </div>
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
                    <p className={tituloSecao}>Itens da comanda</p>
                    <button onClick={() => setEtapa("carrinho")} className="text-[13px] font-medium text-info hover:underline">
                      + Adicionar item
                    </button>
                  </div>
                  {listaItens()}
                </div>
              </section>

              {/* Dados da cliente + total: mesma largura e rodapé do carrinho, o botão principal não muda de lugar */}
              <aside className={cn("flex w-full shrink-0 flex-col md:w-[320px]", variante === "caixa" ? cartaoColuna : "border-t border-border md:border-l md:border-t-0")}>
                <div className="min-h-0 flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {cartaoCliente()}
                <div className="mt-4 space-y-4 border-t border-border px-4 pb-4 pt-4 text-[13px]">
                  <div className="flex items-center gap-3 rounded-lg bg-muted/50 px-3 py-2.5">
                    <Crown className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <span className="min-w-0 flex-1 truncate font-medium">Plano Especial</span>
                    <span
                      className={cn(
                        "shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium",
                        planoAtrasado ? "bg-destructive/10 text-destructive" : "bg-success/10 text-success",
                      )}
                    >
                      {planoAtrasado ? "Atrasado" : "Ativo"}
                    </span>
                  </div>
                  {pacotesCliente.length > 0 && (
                    <div>
                      <button
                        onClick={() => setPacotesAbertos((v) => !v)}
                        className="flex w-full items-center justify-between"
                      >
                        <span className={tituloGrupo}>Pacotes · {pacotesCliente.length}</span>
                        <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", pacotesAbertos && "rotate-180")} />
                      </button>
                      {pacotesAbertos && (
                        <div className="mt-2.5 space-y-2">
                          {pacotesCliente.map((p) => (
                            <div key={p.nome} className="flex items-center gap-3 rounded-lg bg-muted/50 px-3 py-2.5">
                              <Package className="h-4 w-4 shrink-0 text-muted-foreground" />
                              <span className="min-w-0 flex-1">
                                <span className="font-medium">{p.nome}</span>
                                <span className="block text-xs text-muted-foreground">
                                  Restam {p.total - p.usadas} de {p.total} sessões
                                </span>
                                <span className="mt-1.5 block h-1.5 w-full overflow-hidden rounded-full bg-muted">
                                  <span
                                    className="block h-full rounded-full bg-success"
                                    style={{ width: `${((p.total - p.usadas) / p.total) * 100}%` }}
                                  />
                                </span>
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  <div>
                    <div className="mb-2.5 flex items-center justify-between">
                      <button onClick={() => setObsAbertas((v) => !v)} className="text-left">
                        <span className={tituloGrupo}>Observações · {observacoes.length}</span>
                      </button>
                      <span className="flex items-center gap-3">
                        {!editandoObs && (
                          <button onClick={() => { setEditandoObs(true); setObsAbertas(true); }} className="text-[13px] font-medium text-info hover:underline">
                            + Adicionar
                          </button>
                        )}
                        <button onClick={() => setObsAbertas((v) => !v)} aria-label="Recolher observações">
                          <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", obsAbertas && "rotate-180")} />
                        </button>
                      </span>
                    </div>
                    {editandoObs && (
                      <div className="mb-3 space-y-2">
                        <Textarea
                          autoFocus
                          value={obs}
                          onChange={(e) => setObs(e.target.value)}
                          placeholder="Ex: alérgica a dipirona, não cortar franja"
                          className="min-h-[64px] resize-none text-[13px]"
                        />
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className={cn("h-7 flex-1 text-[13px]", btnPrincipal)}
                            onClick={() => {
                              if (obs.trim()) {
                                setObservacoes((prev) => [
                                  { id: Date.now(), texto: obs.trim(), data: new Date().toLocaleDateString("pt-BR"), autor: "Lara" },
                                  ...prev,
                                ]);
                              }
                              setObs("");
                              setEditandoObs(false);
                            }}
                          >
                            Salvar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 flex-1 text-[13px] hover:bg-muted hover:text-foreground"
                            onClick={() => {
                              setObs("");
                              setEditandoObs(false);
                            }}
                          >
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    )}
                    {observacoes.length === 0 && !editandoObs && (
                      <p className="text-[13px] text-muted-foreground">Nenhuma observação registrada.</p>
                    )}
                    <ul className={cn("space-y-2", !obsAbertas && "hidden")}>
                      {observacoes.map((o) => (
                        <li key={o.id} className="flex items-center gap-3 rounded-lg bg-muted/50 px-3 py-2.5">
                          <StickyNote className="h-4 w-4 shrink-0 text-muted-foreground" />
                          <span className="min-w-0 flex-1">
                            {o.texto}
                            <span className="block text-xs text-muted-foreground">
                              {o.data} · {o.autor}
                            </span>
                          </span>
                          <button
                            onClick={() => setObservacoes((prev) => prev.filter((x) => x.id !== o.id))}
                            className="shrink-0 rounded p-0.5 text-muted-foreground transition-colors hover:text-destructive"
                            aria-label="Apagar observação"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                </div>
                {faixaSugestoes("mx-4 mb-3")}
                <div className="border-t border-border p-4">
                  <div className="mb-3 flex items-baseline justify-between">
                    <span className="text-sm font-semibold">Total</span>
                    <span className="text-lg font-semibold tabular-nums">{R$(total)}</span>
                  </div>
                  <div className={cn("grid gap-2", agendamento.cartaoSalvo ? "grid-cols-[auto_minmax(0,1fr)]" : "grid-cols-1")}>
                    {/* Cartão salvo: paga direto daqui, sem passar pelo carrinho (como o "Pay now" da Fresha) */}
                    {agendamento.cartaoSalvo && (
                      <Button
                        variant="outline"
                        aria-label={`Pagar com ${agendamento.cartaoSalvo.bandeira} final ${agendamento.cartaoSalvo.final}`}
                        className="h-9 gap-2 px-3 font-semibold hover:border-info/40 hover:bg-info/10 hover:text-info"
                        title={`Cobrar ${R$(total)} no ${agendamento.cartaoSalvo.bandeira} final ${agendamento.cartaoSalvo.final}`}
                        onClick={() => {
                          setForma(`${agendamento.cartaoSalvo!.bandeira} •••• ${agendamento.cartaoSalvo!.final}`);
                          abrirConfirmacao();
                        }}
                      >
                        Pagar
                        <BandeiraCartao bandeira={agendamento.cartaoSalvo.bandeira} />
                      </Button>
                    )}
                    <Button className={cn("h-9 min-w-0 font-semibold", btnPrincipal)} onClick={() => setEtapa("pagamento")}>
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
            <section className={cn("flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto px-5 py-4", variante === "caixa" && cartaoColuna)}>
              <div className="flex items-center justify-between">
                {trilha("carrinho")}
                <button
                  onClick={() => setEtapa("agendamento")}
                  className="flex items-center gap-1 text-[13px] text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeft className="h-3.5 w-3.5" /> Agendamento
                </button>
              </div>
              <h2 className={cn(tituloSecao, "mb-4 mt-3")}>Adicionar à comanda</h2>
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
                    </button>
                  );
                })}
              </div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {listaCatalogo.map((c) => (
                  <button
                    key={c.nome}
                    onClick={() => escolherItem(c)}
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
            <section className={cn("flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto px-5 py-4", variante === "caixa" && cartaoColuna)}>
              <div className="flex items-center justify-between">
                {trilha("pagamento")}
                <button
                  onClick={() => setEtapa("agendamento")}
                  className="flex items-center gap-1 text-[13px] text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeft className="h-3.5 w-3.5" /> Agendamento
                </button>
              </div>
              <h2 className="sr-only">Forma de pagamento</h2>
              <div className="h-4" />

              <div className="mb-5 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {agendamento.cartaoSalvo &&
                  cardForma({
                    value: `${agendamento.cartaoSalvo.bandeira} •••• ${agendamento.cartaoSalvo.final}`,
                    marca: <BandeiraCartao bandeira={agendamento.cartaoSalvo.bandeira} className="h-6 w-9" />,
                    rotulo: `•••• ${agendamento.cartaoSalvo.final}`,
                    sub: `Vence ${agendamento.cartaoSalvo.validade}`,
                  })}
                {formasDaCliente.map((f) => cardForma(f))}
              </div>

              <div className="mb-4 border-t border-border" />
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {outrasFormas.map((f) => cardForma(f))}
              </div>

              {forma === "Dividir" && (
                <div className="mt-5 rounded-lg border border-border p-3">
                  <p className={cn(tituloSecao, "mb-2")}>Pagamentos</p>
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
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[13px] text-muted-foreground">R$</span>
                      <Input
                        value={novoPgValor}
                        onChange={(e) => setNovoPgValor(e.target.value)}
                        onFocus={selecionarTudo}
                        onMouseUp={(e) => e.preventDefault()}
                        placeholder="0,00"
                        aria-label="Valor desta parte"
                        className="h-9 pl-9 text-[13px] tabular-nums"
                      />
                    </div>
                    <Button size="sm" variant="outline" className="h-9 gap-1 text-[13px] hover:bg-muted hover:text-foreground" onClick={addPagamento}>
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
          <section className={cn("flex flex-1 flex-col items-center justify-center px-6 py-16 text-center", variante === "caixa" && cartaoColuna)}>
            {/* Anel verde carrega, preenche e o check aparece (estilo Mercado Pago) */}
            <svg viewBox="0 0 64 64" className="h-16 w-16 text-success" aria-hidden="true">
              <circle cx="32" cy="32" r="24" fill="none" stroke="currentColor" strokeOpacity="0.15" strokeWidth="4" />
              <circle
                cx="32"
                cy="32"
                r="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                className="pago-anel"
                transform="rotate(-90 32 32)"
              />
              <circle cx="32" cy="32" r="24" fill="currentColor" className="pago-fundo" />
              <path
                d="M22 33l7 7 13-15"
                fill="none"
                stroke="white"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="pago-check"
              />
            </svg>
            <h2 className="pago-texto mt-3 text-xl font-semibold tracking-tight">Comanda paga</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {R$(total)} · {agendamento.cliente}
              {forma && ` · ${forma}`}
            </p>
            {resumoPago.length > 0 && (
              <ul className="mt-3 space-y-1 text-[13px] text-muted-foreground">
                {resumoPago.map((r) => (
                  <li key={r} className="flex items-center justify-center gap-1.5">
                    <Check className="h-3.5 w-3.5 text-success" /> {r}
                  </li>
                ))}
              </ul>
            )}
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
                <Button variant="outline" className="h-9 flex-1 hover:bg-muted hover:text-foreground" onClick={() => onFechar()}>
                  Agora não
                </Button>
              </div>
            </div>
          </section>
        )}

        <Dialog open={!!escolhendoEquipe} onOpenChange={(o) => !o && setEscolhendoEquipe(null)}>
          <DialogContent className="max-w-sm gap-0 p-0">
            <DialogHeader className="space-y-0.5 px-5 pb-2 pt-5 text-left">
              <DialogTitle className="text-base">{escolhendoEquipe?.nome}</DialogTitle>
              <DialogDescription className="text-[13px]">
                {escolhendoEquipe && R$(escolhendoEquipe.valor)}
                {escolhendoEquipe?.detalhe && ` · ${escolhendoEquipe.detalhe}`}
              </DialogDescription>
            </DialogHeader>

            <div className="px-5 py-2">
              <p className={cn(tituloSecao, "mb-2")}>Profissional</p>
              <div className="space-y-1">
                {equipeSalao.map((e) => (
                  <button
                    key={e.nome}
                    onClick={() => {
                      setProfEscolhida(e.nome);
                      setAssistEscolhidos((prev) => prev.filter((n) => n !== e.nome));
                    }}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-2 py-1.5 text-left text-sm transition-colors",
                      profEscolhida === e.nome ? "bg-info/10" : "hover:bg-muted/60",
                    )}
                  >
                    <FotoProf nome={e.nome} tamanho="h-8 w-8 text-xs" />
                    <span className="flex-1 font-medium">{e.nome}</span>
                    {profEscolhida === e.nome && <Check className="h-4 w-4 text-info" />}
                  </button>
                ))}
              </div>

              {escolhendoEquipe?.tipo !== "produto" && <p className={cn(tituloSecao, "mb-2 mt-4")}>Assistentes</p>}
              <div className={cn("flex flex-wrap gap-1.5", escolhendoEquipe?.tipo === "produto" && "hidden")}>
                {equipeSalao
                  .filter((e) => e.nome !== profEscolhida)
                  .map((e) => {
                    const ativo = assistEscolhidos.includes(e.nome);
                    return (
                      <button
                        key={e.nome}
                        onClick={() =>
                          setAssistEscolhidos((prev) => (ativo ? prev.filter((n) => n !== e.nome) : [...prev, e.nome]))
                        }
                        className={cn(
                          "inline-flex h-7 items-center gap-1.5 rounded-[30px] border pl-0.5 pr-2.5 text-[13px] transition-colors",
                          ativo ? "border-info/40 bg-info/10" : "border-border hover:bg-muted",
                        )}
                      >
                        <FotoProf nome={e.nome} tamanho="h-6 w-6 text-[10px]" />
                        {e.nome}
                      </button>
                    );
                  })}
              </div>
            </div>

            <div className="flex gap-2 px-5 pb-5 pt-4">
              <Button
                variant="outline"
                className="h-9 flex-1 hover:bg-muted hover:text-foreground"
                onClick={() => setEscolhendoEquipe(null)}
              >
                Cancelar
              </Button>
              <Button
                autoFocus
                className={cn("h-9 flex-1 font-semibold", btnPrincipal)}
                onClick={() => {
                  if (escolhendoEquipe) {
                    adicionar(escolhendoEquipe, { profissional: profEscolhida, assistentes: assistEscolhidos });
                  }
                  setEscolhendoEquipe(null);
                }}
              >
                Adicionar
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={confirmando} onOpenChange={setConfirmando}>
          <DialogContent className="max-w-md gap-0 p-0" onOpenAutoFocus={(e) => e.preventDefault()}>
            <DialogHeader className="space-y-0.5 px-5 pb-2 pt-5 text-left">
              <DialogTitle className="text-base">Confirmar pagamento</DialogTitle>
              <DialogDescription className="text-[13px]">
                {agendamento.cliente} · #{numeroComanda}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-5 px-5 py-3">
              <div className="space-y-2">
                {linhasPagamento.map((l, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-sm">
                    <OrigemPagamento forma={l.forma} />
                    <span className="min-w-0 flex-1 truncate font-medium">{l.forma}</span>
                    {forma === "Dividir" ? (
                      <span className="font-semibold tabular-nums">{R$(l.valor)}</span>
                    ) : (
                      <div className="relative w-28">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">R$</span>
                        <Input
                          value={recebido}
                          onChange={(e) => setRecebido(e.target.value)}
                          onFocus={selecionarTudo}
                          onMouseUp={(e) => e.preventDefault()}
                          aria-label="Valor recebido"
                          className="h-8 pl-8 text-right text-sm font-semibold tabular-nums"
                        />
                      </div>
                    )}
                  </div>
                ))}
                <div className="flex items-center justify-between pt-1 text-[13px] text-muted-foreground">
                  <span>Total da comanda</span>
                  <span className="tabular-nums">{R$(total)}</span>
                </div>
              </div>

              <div className="space-y-3 border-t border-border pt-4">
                {excedente > 0 && (
                  <label className="flex cursor-pointer items-center justify-between gap-3">
                    <span>
                      <span className="block text-sm font-medium">Lançar {R$(excedente)} como crédito</span>
                      <span className="block text-xs text-muted-foreground">
                        {lancarCredito ? "Fica no saldo da cliente para a próxima visita" : `Devolver ${R$(excedente)} de troco`}
                      </span>
                    </span>
                    <Switch checked={lancarCredito} onCheckedChange={setLancarCredito} />
                  </label>
                )}
                <label className="flex cursor-pointer items-center justify-between gap-3">
                  <span className="text-sm font-medium">Imprimir comprovante</span>
                  <Switch checked={imprimir} onCheckedChange={setImprimir} />
                </label>
                <label className="flex cursor-pointer items-center justify-between gap-3">
                  <span className="text-sm font-medium">Emitir nota fiscal</span>
                  <Switch checked={emitirNota} onCheckedChange={setEmitirNota} />
                </label>
              </div>
              {forma !== "Dividir" && valorRecebido < total && (
                <p className="text-[13px] text-destructive">O valor recebido é menor que o total da comanda.</p>
              )}
            </div>

            <div className="flex gap-2 px-5 pb-5 pt-3">
              <Button variant="outline" className="h-9 flex-1 hover:bg-muted hover:text-foreground" onClick={() => setConfirmando(false)}>
                Voltar
              </Button>
              <Button
                className={cn("h-9 flex-1 font-semibold", btnPrincipal)}
                disabled={forma !== "Dividir" && valorRecebido < total}
                onClick={confirmarPagamento}
              >
                Confirmar {R$(forma === "Dividir" ? pago : valorRecebido)}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        </div>
  );
}
