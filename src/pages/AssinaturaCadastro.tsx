import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { TextField, Dropdown } from "@/components/FormModal";
import { useToast } from "@/hooks/use-toast";
import { AulaButton, YouTubeModal } from "@/components/YouTubeModal";
import {
  Plus,
  CalendarDays,
  Trash2,
  ArrowUp,
  ArrowDown,
  Search,
  Star,
  CheckCircle2,
  ShoppingBag,
  X,
  Users,
  Tag,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ServicoOpt {
  id: number;
  nome: string;
  preco: string;
  tempo: string;
}
interface ProdutoOpt {
  id: number;
  nome: string;
  preco: string;
}
interface ProfissionalOpt {
  id: number;
  nome: string;
  iniciais: string;
  cor: string;
}

const servicosDisponiveis: ServicoOpt[] = [
  { id: 1, nome: "Barba + Sobrancelha", preco: "R$ 50,00", tempo: "30 min" },
  { id: 2, nome: "Barba Pacote", preco: "R$ 40,00", tempo: "25 min" },
  { id: 3, nome: "Barba!", preco: "R$ 30,00", tempo: "20 min" },
  { id: 4, nome: "Bigode", preco: "R$ 20,00", tempo: "15 min" },
  { id: 5, nome: "Corte Masculino", preco: "R$ 45,00", tempo: "30 min" },
  { id: 6, nome: "Corte Feminino", preco: "R$ 65,00", tempo: "45 min" },
  { id: 7, nome: "Hidratação", preco: "R$ 80,00", tempo: "60 min" },
  { id: 8, nome: "Coloração", preco: "R$ 120,00", tempo: "90 min" },
  { id: 9, nome: "Manicure", preco: "R$ 35,00", tempo: "40 min" },
  { id: 10, nome: "Pedicure", preco: "R$ 40,00", tempo: "50 min" },
];

const produtosDisponiveis: ProdutoOpt[] = [
  { id: 1, nome: "3030 Condicionador Lavado", preco: "R$ 35,00" },
  { id: 2, nome: "Água", preco: "R$ 4,00" },
  { id: 3, nome: "Balm", preco: "R$ 28,00" },
  { id: 4, nome: "Pomada Modeladora", preco: "R$ 45,00" },
  { id: 5, nome: "Botox Capilar", preco: "R$ 90,00" },
  { id: 6, nome: "Color Dicolor 10.89", preco: "R$ 32,00" },
];

const profissionaisDisponiveis: ProfissionalOpt[] = [
  { id: 1, nome: "Cesar", iniciais: "CC", cor: "bg-blue-500" },
  { id: 2, nome: "Claudia", iniciais: "CL", cor: "bg-pink-500" },
  { id: 3, nome: "Marcia Silva", iniciais: "MS", cor: "bg-amber-500" },
  { id: 4, nome: "Matheus", iniciais: "MM", cor: "bg-emerald-500" },
  { id: 5, nome: "Vini", iniciais: "VV", cor: "bg-purple-500" },
];

const recorrenciaOptions = [
  { value: "MENSAL", label: "Mensal" },
  { value: "TRIMESTRAL", label: "Trimestral" },
  { value: "SEMESTRAL", label: "Semestral" },
  { value: "ANUAL", label: "Anual" },
];

const formaPagamentoOptions = [
  { value: "CARTAO_CREDITO", label: "Cartão de crédito" },
  { value: "PIX", label: "Pix" },
  { value: "BOLETO", label: "Boleto" },
  { value: "DINHEIRO", label: "Dinheiro" },
];

const usosOptions = [
  { value: "ILIMITADO", label: "ILIMITADO" },
  { value: "1", label: "1" },
  { value: "2", label: "2" },
  { value: "3", label: "3" },
  { value: "4", label: "4" },
  { value: "5", label: "5" },
  { value: "6", label: "6" },
  { value: "8", label: "8" },
  { value: "10", label: "10" },
];

const comissaoOptions = [
  { value: "TEMPO", label: "TEMPO" },
  { value: "VALOR", label: "VALOR" },
  { value: "FIXO", label: "FIXO" },
  { value: "PORCENTAGEM", label: "PORCENTAGEM" },
  { value: "PONTOS", label: "PONTOS" },
];

const diasSemana = [
  { key: "seg", label: "Seg" },
  { key: "ter", label: "Ter" },
  { key: "qua", label: "Qua" },
  { key: "qui", label: "Qui" },
  { key: "sex", label: "Sex" },
  { key: "sab", label: "Sáb" },
  { key: "dom", label: "Dom" },
] as const;

interface ServicoIncluso {
  id: number;
  desconto: string;
  usos: string;
  comissao: string;
  comissaoValor: string;
}

interface ProdutoIncluso {
  id: number;
  desconto: string;
  usos: string;
  comissao: string;
  comissaoValor: string;
}

const sections = [
  { id: "dados", label: "Dados" },
  { id: "servicos", label: "Serviços" },
  { id: "produtos", label: "Produtos" },
  { id: "beneficios", label: "Benefícios Extras" },
  { id: "disponibilidade", label: "Disponibilidade" },
];

function CurrencyInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const formatted = value || "0,00";
  return (
    <div className="grid min-w-0 gap-0.5">
      <label className="text-[13px] font-semibold text-foreground">{label}</label>
      <div className="flex h-10 w-full min-w-0 items-center overflow-hidden rounded-lg border border-info/50 bg-card text-sm focus-within:border-info/60 focus-within:ring-2 focus-within:ring-info/40">
        <span className="shrink-0 pl-3 pr-1 text-muted-foreground">R$</span>
        <input
          value={formatted}
          onChange={(e) => {
            const digits = e.target.value.replace(/\D/g, "");
            const num = (parseInt(digits || "0", 10) / 100).toFixed(2).replace(".", ",");
            onChange(num);
          }}
          className="h-full w-full min-w-0 flex-1 bg-transparent pr-3 text-sm outline-none"
        />
      </div>
    </div>
  );
}

function SectionBlock({
  id,
  title,
  description,
  children,
  rightSlot,
  className = "",
}: {
  id?: string;
  title: string;
  description?: string;
  children: React.ReactNode;
  rightSlot?: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={cn("scroll-mt-24 rounded-xl border border-border bg-card p-4 px-[16px]", className)}
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-foreground">{title}</h2>
          {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
        </div>
        {rightSlot}
      </div>
      {children}
    </section>
  );
}

/**
 * Inline-edit list for services/products (style from reference image).
 * - Each item is a row with a checkbox to include in the plan.
 * - Selected rows show editable fields: desconto, usos, comissão (+ ponto/% se aplicável).
 */
function InlineSelectableList<T extends { id: number; nome: string }>({
  items,
  selected,
  setSelected,
  searchPlaceholder,
  comissaoEnabled = true,
  hideUsos = false,
  showOnlySelected = false,
  onToggleShowOnlySelected,
  bulkDiscountEnabled = false,
  productMode = false,
}: {
  items: T[];
  selected: Map<number, ServicoIncluso>;
  setSelected: (m: Map<number, ServicoIncluso>) => void;
  searchPlaceholder: string;
  comissaoEnabled?: boolean;
  hideUsos?: boolean;
  showOnlySelected?: boolean;
  onToggleShowOnlySelected?: () => void;
  bulkDiscountEnabled?: boolean;
  productMode?: boolean;
}) {
  const [busca, setBusca] = useState("");
  const [bulkDiscount, setBulkDiscount] = useState("");

  const filtered = items.filter((i) => {
    if (showOnlySelected && !selected.has(i.id)) return false;
    return i.nome.toLowerCase().includes(busca.toLowerCase());
  });
  const allSelected = filtered.length > 0 && filtered.every((i) => selected.has(i.id));

  const toggle = (id: number) => {
    const next = new Map(selected);
    if (next.has(id)) next.delete(id);
    else
      next.set(id, {
        id,
        desconto: "100",
        usos: "ILIMITADO",
        comissao: "TEMPO",
        comissaoValor: "0",
      });
    setSelected(next);
  };

  const toggleAll = () => {
    const next = new Map(selected);
    if (allSelected) {
      filtered.forEach((i) => next.delete(i.id));
    } else {
      filtered.forEach((i) => {
        if (!next.has(i.id))
          next.set(i.id, {
            id: i.id,
            desconto: "100",
            usos: "ILIMITADO",
            comissao: "TEMPO",
            comissaoValor: "0",
          });
      });
    }
    setSelected(next);
  };

  const update = (id: number, field: keyof ServicoIncluso, value: string) => {
    const next = new Map(selected);
    const cur = next.get(id);
    if (cur) {
      next.set(id, { ...cur, [field]: value });
      setSelected(next);
    }
  };

  const applyBulkDiscount = () => {
    if (!bulkDiscount) return;
    const next = new Map(selected);
    next.forEach((cur, id) => {
      next.set(id, { ...cur, desconto: bulkDiscount });
    });
    setSelected(next);
  };

  return (
    <div className="rounded-xl bg-card">
      {/* Search header */}
      <div className="flex flex-col gap-2 pb-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder={searchPlaceholder}
            className="h-10 w-full rounded-lg border border-info/50 bg-card pl-9 pr-3 text-sm text-foreground outline-none transition-all focus:border-info/60 focus:ring-2 focus:ring-info/40"
          />
        </div>
        {bulkDiscountEnabled && selected.size > 0 && (
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex h-10 shrink-0 items-center rounded-lg border border-border bg-card pl-2">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={bulkDiscount}
                    onChange={(e) =>
                      setBulkDiscount(e.target.value.replace(/\D/g, "").slice(0, 3))
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        applyBulkDiscount();
                      }
                    }}
                    placeholder="0"
                    className="h-full w-9 bg-transparent text-right text-sm outline-none"
                  />
                  <span className="pr-1.5 text-xs text-muted-foreground">%</span>
                  <button
                    type="button"
                    onClick={applyBulkDiscount}
                    disabled={!bulkDiscount}
                    className="my-1 mr-1 inline-flex h-7 items-center rounded-md bg-foreground px-2 text-[11px] font-semibold text-background transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Aplicar
                  </button>
                </div>
              </TooltipTrigger>
              <TooltipContent className="bg-popover text-popover-foreground border border-border shadow-sm text-xs px-2 py-1">
                Aplicar desconto em todos os produtos selecionados
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        <button
          type="button"
          onClick={toggleAll}
          className="h-10 shrink-0 rounded-lg border border-border bg-background px-4 text-sm font-medium text-foreground transition hover:bg-muted"
        >
          {allSelected ? "Desmarcar todos" : "Selecionar todos"}
        </button>
      </div>

      {/* List */}
      <div className="max-h-[225px] overflow-y-auto px-0 py-0">
        {filtered.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-muted-foreground">
            Nenhum item encontrado.
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {filtered.map((item) => {
              const sel = selected.get(item.id);
              const isSelected = !!sel;
              return (
                <li
                  key={item.id}
                  onClick={() => toggle(item.id)}
                  className={cn(
                    "cursor-pointer rounded-lg border transition",
                    isSelected
                      ? "border-blue-500/40 bg-blue-500/5"
                      : "border-border bg-card hover:bg-muted/40",
                  )}
                >
                  <div className="flex flex-wrap items-center gap-3 px-3 py-2.5 sm:flex-nowrap">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => toggle(item.id)}
                      onClick={(e) => e.stopPropagation()}
                      className="h-4 w-4 rounded-md border border-zinc-400 bg-background shadow-sm data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white"
                    />
                    <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">
                      {item.nome}
                    </span>

                    {isSelected && (
                      <div
                        className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:flex-nowrap"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <TooltipProvider delayDuration={200}>
                          {/* DESCONTO */}
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex h-9 items-center rounded-md border border-border bg-card">
                                <span className="pl-2 text-[11px] font-medium text-muted-foreground">
                                  desc.
                                </span>
                                <input
                                  type="text"
                                  inputMode="numeric"
                                  value={sel.desconto}
                                  onChange={(e) =>
                                    update(item.id, "desconto", e.target.value.replace(/\D/g, ""))
                                  }
                                  className="h-full w-10 bg-transparent px-1 text-right text-sm outline-none"
                                />
                                <span className="pr-2 text-xs text-muted-foreground">%</span>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent className="bg-popover text-popover-foreground border border-border shadow-sm text-xs px-2 py-1">
                              Desconto
                            </TooltipContent>
                          </Tooltip>

                          {/* USOS */}
                          {productMode ? (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="flex h-9 items-center rounded-md border border-border bg-card">
                                  <span className="pl-2 text-[11px] font-medium text-muted-foreground">
                                    limite
                                  </span>
                                  <input
                                    type="text"
                                    inputMode="numeric"
                                    value={sel.usos === "ILIMITADO" ? "" : sel.usos}
                                    onChange={(e) =>
                                      update(
                                        item.id,
                                        "usos",
                                        e.target.value.replace(/\D/g, "") || "ILIMITADO",
                                      )
                                    }
                                    placeholder="∞"
                                    className="h-full w-12 bg-transparent px-1 text-right text-sm outline-none placeholder:text-muted-foreground/60"
                                  />
                                  <span className="pr-2 text-[11px] text-muted-foreground">un.</span>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent className="bg-popover text-popover-foreground border border-border shadow-sm text-xs px-2 py-1">
                                Limite de unidades por mês (vazio = ilimitado)
                              </TooltipContent>
                            </Tooltip>
                          ) : !hideUsos && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div>
                                  <Select
                                    value={sel.usos}
                                    onValueChange={(v) => update(item.id, "usos", v)}
                                  >
                                    <SelectTrigger className="h-9 w-[140px] rounded-md border-border bg-card px-2 text-xs font-semibold">
                                      <span className="mr-1 text-[11px] font-medium text-muted-foreground">
                                        usos
                                      </span>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {usosOptions.map((o) => (
                                        <SelectItem key={o.value} value={o.value} className="text-xs font-semibold">
                                          {o.label}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent className="bg-popover text-popover-foreground border border-border shadow-sm text-xs px-2 py-1">
                                Usos por mês
                              </TooltipContent>
                            </Tooltip>
                          )}

                          {/* COMISSÃO */}
                          {productMode && comissaoEnabled ? (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="flex h-9 items-center rounded-md border border-border bg-card">
                                  <span className="pl-2 text-[11px] font-medium text-muted-foreground">
                                    com.
                                  </span>
                                  <input
                                    type="text"
                                    inputMode="numeric"
                                    value={sel.comissaoValor}
                                    onChange={(e) =>
                                      update(
                                        item.id,
                                        "comissaoValor",
                                        e.target.value.replace(/\D/g, ""),
                                      )
                                    }
                                    className="h-full w-10 bg-transparent px-1 text-right text-sm outline-none"
                                  />
                                  <span className="pr-2 text-xs text-muted-foreground">%</span>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent className="bg-popover text-popover-foreground border border-border shadow-sm text-xs px-2 py-1">
                                Percentual de comissão
                              </TooltipContent>
                            </Tooltip>
                          ) : comissaoEnabled && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div>
                                  <Select
                                    value={sel.comissao}
                                    onValueChange={(v) => update(item.id, "comissao", v)}
                                  >
                                    <SelectTrigger className="h-9 w-[160px] rounded-md border-border bg-card px-2 text-xs font-semibold">
                                      <span className="mr-1 text-[11px] font-medium text-muted-foreground">
                                        com.
                                      </span>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {comissaoOptions.map((o) => (
                                        <SelectItem key={o.value} value={o.value} className="text-xs font-semibold">
                                          {o.label}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent className="bg-popover text-popover-foreground border border-border shadow-sm text-xs px-2 py-1">
                                Comissão
                              </TooltipContent>
                            </Tooltip>
                          )}

                          {/* % COM. ou PONTOS  */}
                          {!productMode && comissaoEnabled &&
                            (sel.comissao === "PORCENTAGEM" || sel.comissao === "PONTOS") && (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="flex h-9 items-center rounded-md border border-border bg-card">
                                    <span className="pl-2 text-[11px] font-medium text-muted-foreground">
                                      {sel.comissao === "PONTOS" ? "pts" : "%"}
                                    </span>
                                    <input
                                      type="text"
                                      inputMode="numeric"
                                      value={sel.comissaoValor}
                                      onChange={(e) =>
                                        update(
                                          item.id,
                                          "comissaoValor",
                                          e.target.value.replace(/\D/g, ""),
                                        )
                                      }
                                      className="h-full w-10 bg-transparent px-1 text-right text-sm outline-none"
                                    />
                                    <span className="pr-2 text-xs text-muted-foreground">
                                      {sel.comissao === "PONTOS" ? "pts" : "%"}
                                    </span>
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent className="bg-popover text-popover-foreground border border-border shadow-sm text-xs px-2 py-1">
                                  {sel.comissao === "PONTOS" ? "Pontos" : "Percentual de comissão"}
                                </TooltipContent>
                              </Tooltip>
                            )}
                        </TooltipProvider>
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

export default function AssinaturaCadastro() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  const editing = searchParams.get("nome");

  const [aulaOpen, setAulaOpen] = useState(false);

  // Detalhes
  const [nome, setNome] = useState(editing || "");
  const [valor, setValor] = useState("250,00");
  const [recorrencia, setRecorrencia] = useState("MENSAL");
  const [formaPagamento, setFormaPagamento] = useState("CARTAO_CREDITO");
  const [disponivelVenda, setDisponivelVenda] = useState(true);
  const [destaque, setDestaque] = useState(false);
  const [parcerias, setParcerias] = useState(false);

  const [beneficios, setBeneficios] = useState<string[]>([
    "Venha quando precisar",
    "Descontos em serviços",
    "Desconto em produtos",
  ]);
  const [novoBeneficio, setNovoBeneficio] = useState("");

  // Serviços
  const [servicosMap, setServicosMap] = useState<Map<number, ServicoIncluso>>(
    () =>
      new Map<number, ServicoIncluso>([
        [
          1,
          { id: 1, desconto: "10", usos: "ILIMITADO", comissao: "PORCENTAGEM", comissaoValor: "0" },
        ],
        [2, { id: 2, desconto: "100", usos: "ILIMITADO", comissao: "TEMPO", comissaoValor: "0" }],
      ]),
  );

  // Produtos
  const [produtosMap, setProdutosMap] = useState<Map<number, ServicoIncluso>>(
    () =>
      new Map<number, ServicoIncluso>([
        [1, { id: 1, desconto: "70", usos: "ILIMITADO", comissao: "TEMPO", comissaoValor: "0" }],
      ]),
  );

  // Disponibilidade
  const [diasAceitos, setDiasAceitos] = useState<string[]>([
    "seg",
    "ter",
    "qua",
    "qui",
    "sex",
  ]);
  const [profissionaisAtendem, setProfissionaisAtendem] = useState<number[]>([1, 2, 3, 4]);

  // Aba ativa (anchor scroll)
  const [activeSection, setActiveSection] = useState("dados");

  const [showErrors, setShowErrors] = useState(false);
  const errors = {
    nome: !nome.trim() ? "Informe o nome do plano" : "",
  };
  const showError = (k: keyof typeof errors) => (showErrors ? errors[k] : "");

  // Smooth scroll handler
  const handleNavClick = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveSection(id);
  };

  // Active section tracking via IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActiveSection(visible[0].target.id);
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] },
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const toggleDia = (key: string) =>
    setDiasAceitos((prev) =>
      prev.includes(key) ? prev.filter((d) => d !== key) : [...prev, key],
    );

  const toggleProfissional = (id: number) =>
    setProfissionaisAtendem((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    );

  const adicionarBeneficio = () => {
    const t = novoBeneficio.trim();
    if (!t) return;
    setBeneficios((prev) => [...prev, t]);
    setNovoBeneficio("");
  };
  const removerBeneficio = (idx: number) =>
    setBeneficios((prev) => prev.filter((_, i) => i !== idx));

  const moverBeneficio = (idx: number, dir: -1 | 1) =>
    setBeneficios((prev) => {
      const novo = [...prev];
      const j = idx + dir;
      if (j < 0 || j >= novo.length) return prev;
      [novo[idx], novo[j]] = [novo[j], novo[idx]];
      return novo;
    });

  const [editingBeneficioIdx, setEditingBeneficioIdx] = useState<number | null>(null);
  const [editingBeneficioValue, setEditingBeneficioValue] = useState("");

  const startEditBeneficio = (idx: number) => {
    setEditingBeneficioIdx(idx);
    setEditingBeneficioValue(beneficios[idx]);
  };
  const commitEditBeneficio = () => {
    if (editingBeneficioIdx === null) return;
    const t = editingBeneficioValue.trim();
    if (t) {
      setBeneficios((prev) =>
        prev.map((b, i) => (i === editingBeneficioIdx ? t : b)),
      );
    }
    setEditingBeneficioIdx(null);
    setEditingBeneficioValue("");
  };

  const handleSalvar = () => {
    setShowErrors(true);
    if (errors.nome) {
      toast({ title: "Verifique os campos obrigatórios", variant: "destructive" });
      return;
    }
    toast({ title: editing ? "Plano atualizado" : "Plano criado com sucesso" });
    navigate("/assinantePesquisa");
  };

  const servicosArr = useMemo(() => Array.from(servicosMap.values()), [servicosMap]);
  const produtosArr = useMemo(() => Array.from(produtosMap.values()), [produtosMap]);
  const [showOnlySelectedServicos, setShowOnlySelectedServicos] = useState(false);
  const [showOnlySelectedProdutos, setShowOnlySelectedProdutos] = useState(false);

  // Serviços 100% gratuitos = inclusos individualmente. Outros = "Descontos em serviços".
  const servicosInclusos = useMemo(
    () => servicosArr.filter((s) => s.desconto === "100"),
    [servicosArr],
  );
  const servicosComDesconto = useMemo(
    () => servicosArr.filter((s) => s.desconto !== "100"),
    [servicosArr],
  );

  // O X no card resumo apenas oculta a linha do preview, sem alterar a configuração do plano.
  const [hiddenResumo, setHiddenResumo] = useState<Set<string>>(new Set());
  const ocultarResumo = (key: string) =>
    setHiddenResumo((prev) => {
      const next = new Set(prev);
      next.add(key);
      return next;
    });

  const nomeServico = (id: number) => servicosDisponiveis.find((s) => s.id === id)?.nome || "";
  const nomeProduto = (id: number) => produtosDisponiveis.find((p) => p.id === id)?.nome || "";
  const labelUsos = (v: string) =>
    v === "ILIMITADO" ? "Ilimitado" : `${v}x / mês`;

  const recorrenciaLabel =
    recorrenciaOptions.find((r) => r.value === recorrencia)?.label || "";

  const diasValidosLabel = useMemo(() => {
    const order = ["seg", "ter", "qua", "qui", "sex", "sab", "dom"];
    const labels: Record<string, string> = {
      seg: "seg",
      ter: "ter",
      qua: "qua",
      qui: "qui",
      sex: "sex",
      sab: "sáb",
      dom: "dom",
    };
    const sel = order.filter((d) => diasAceitos.includes(d));
    if (sel.length === 0) return "Nenhum dia selecionado";
    if (sel.length === 7) return "Válido todos os dias";
    // detecta sequência contígua
    const idxs = sel.map((d) => order.indexOf(d));
    const contiguous = idxs.every((v, i) => i === 0 || v === idxs[i - 1] + 1);
    if (contiguous && sel.length >= 3) {
      return `Válido de ${labels[sel[0]]} a ${labels[sel[sel.length - 1]]}`;
    }
    if (sel.length === 1) return `Válido ${labels[sel[0]]}`;
    const last = labels[sel[sel.length - 1]];
    const head = sel.slice(0, -1).map((d) => labels[d]).join(", ");
    return `Válido ${head} e ${last}`;
  }, [diasAceitos]);

  return (
    <AppLayout>
      <div className="flex flex-col gap-0">
        {/* HEADER */}
        <div>
          <div className="flex flex-row items-center gap-3">
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight leading-none">
                {editing ? "Editar Plano" : "Novo Plano"}
              </h1>
              <AulaButton onOpen={() => setAulaOpen(true)} />
            </div>
            <span aria-hidden="true" className="inline-block h-6 w-px bg-border" />
            <button
              type="button"
              onClick={handleSalvar}
              className="inline-flex h-8 shrink-0 items-center justify-center rounded-lg bg-foreground px-4 text-sm font-semibold text-background"
            >
              {editing ? "Salvar alterações" : "Salvar Plano"}
            </button>
          </div>
        </div>

        {/* TAB BAR (anchor-style, profissionalPerfil pattern) */}
        <div className="mt-4 border-b border-border bg-background">
          <div className="flex gap-5 overflow-x-auto sm:gap-6">
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => handleNavClick(s.id)}
                className={cn(
                  "relative whitespace-nowrap pb-2.5 pt-3 text-sm font-medium transition-colors",
                  activeSection === s.id
                    ? "text-foreground after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:rounded-full after:bg-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* CONTENT */}
        <div className="mt-5 grid grid-cols-1 gap-5 pb-12 lg:grid-cols-[minmax(0,1fr)_280px]">
          {/* COLUNA PRINCIPAL */}
          <div className="flex flex-col gap-5">
            {/* DADOS DO PLANO */}
            <SectionBlock id="dados" title="Dados">
              <div className="grid gap-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-[minmax(0,1.8fr)_minmax(140px,1fr)_minmax(0,1.1fr)_minmax(0,1.3fr)]">
                  <TextField
                     label="Nome do Plano"
                    value={nome}
                    onChange={setNome}
                    placeholder="Ex: Estagiário"
                    error={showError("nome")}
                  />
                  <CurrencyInput label="Preço" value={valor} onChange={setValor} />
                  <Dropdown
                    label="Recorrência"
                    value={recorrencia}
                    setValue={setRecorrencia}
                    options={recorrenciaOptions}
                  />
                  <Dropdown label="Forma de Pagamento" value={formaPagamento} setValue={setFormaPagamento} options={formaPagamentoOptions} />
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="flex items-center justify-between rounded-lg border border-border bg-card px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <ShoppingBag
                        className={cn(
                          "h-4 w-4",
                          disponivelVenda ? "fill-emerald-500/20 text-emerald-500" : "text-muted-foreground",
                        )}
                      />
                      <div>
                        <p className="text-sm font-semibold text-foreground">Disponível para Venda</p>
                        <p className="text-xs text-muted-foreground" />
                      </div>
                    </div>
                    <Switch checked={disponivelVenda} onCheckedChange={setDisponivelVenda} />
                  </div>

                  <div className="flex items-center justify-between rounded-lg border border-border bg-card px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <Star
                        className={cn(
                          "h-4 w-4",
                          destaque ? "fill-amber-500 text-amber-500" : "text-muted-foreground",
                        )}
                      />
                      <div>
                        <p className="text-sm font-semibold text-foreground">Destaque</p>
                        <p className="text-xs text-muted-foreground" />
                      </div>
                    </div>
                    <Switch checked={destaque} onCheckedChange={setDestaque} />
                  </div>

                  <div className="flex items-center justify-between rounded-lg border border-border bg-card px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <Tag
                        className={cn(
                          "h-4 w-4",
                          parcerias ? "fill-sky-500/20 text-sky-500" : "text-muted-foreground",
                        )}
                      />
                      <div>
                        <p className="text-sm font-semibold text-foreground">Parcerias</p>
                        <p className="text-xs text-muted-foreground" />
                      </div>
                    </div>
                    <Switch checked={parcerias} onCheckedChange={setParcerias} />
                  </div>
                </div>
              </div>
            </SectionBlock>

            {/* SERVIÇOS */}
            <SectionBlock
              id="servicos"
              title="Serviços"
              rightSlot={
                <button
                  type="button"
                  onClick={() => servicosArr.length > 0 && setShowOnlySelectedServicos((v) => !v)}
                  disabled={servicosArr.length === 0}
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-medium transition",
                    showOnlySelectedServicos
                      ? "bg-info/15 text-info ring-1 ring-info/40"
                      : "bg-muted text-muted-foreground hover:bg-muted/70",
                    servicosArr.length === 0 && "cursor-default opacity-60",
                  )}
                >
                  {servicosArr.length} selecionado(s)
                </button>
              }
            >
              <InlineSelectableList
                items={servicosDisponiveis}
                selected={servicosMap}
                setSelected={setServicosMap}
                searchPlaceholder="Buscar serviço..."
                showOnlySelected={showOnlySelectedServicos}
                onToggleShowOnlySelected={() => setShowOnlySelectedServicos((v) => !v)}
              />
            </SectionBlock>

            {/* PRODUTOS */}
            <SectionBlock
              id="produtos"
              title="Produtos"
              rightSlot={
                <button
                  type="button"
                  onClick={() => produtosArr.length > 0 && setShowOnlySelectedProdutos((v) => !v)}
                  disabled={produtosArr.length === 0}
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-medium transition",
                    showOnlySelectedProdutos
                      ? "bg-info/15 text-info ring-1 ring-info/40"
                      : "bg-muted text-muted-foreground hover:bg-muted/70",
                    produtosArr.length === 0 && "cursor-default opacity-60",
                  )}
                >
                  {produtosArr.length} selecionado(s)
                </button>
              }
            >
              <InlineSelectableList
                items={produtosDisponiveis}
                selected={produtosMap}
                setSelected={setProdutosMap}
                searchPlaceholder="Buscar produto..."
                hideUsos
                showOnlySelected={showOnlySelectedProdutos}
                onToggleShowOnlySelected={() => setShowOnlySelectedProdutos((v) => !v)}
                bulkDiscountEnabled
                productMode
              />
            </SectionBlock>

            {/* BENEFÍCIOS */}
            <SectionBlock id="beneficios" title="Benefícios Extras">
              <div className="flex gap-2">
                <input
                  value={novoBeneficio}
                  onChange={(e) => setNovoBeneficio(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      adicionarBeneficio();
                    }
                  }}
                  placeholder="Ex: Traga um amigo no aniversário"
                  className="h-10 flex-1 rounded-lg border border-border bg-card px-3 text-sm outline-none transition-all focus:border-info/60 focus:ring-2 focus:ring-info/40"
                />
                <button
                  type="button"
                  onClick={adicionarBeneficio}
                  className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-border bg-card px-4 text-sm font-semibold text-foreground transition hover:bg-muted"
                >
                  <Plus className="h-4 w-4" />
                  Adicionar
                </button>
              </div>

              <div className="mt-3 overflow-hidden rounded-lg border border-border bg-card">
                <table className="w-full border-collapse">
                  <thead className="bg-muted/40">
                    <tr>
                      <th className="w-14 px-3 py-2.5 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        #
                      </th>
                      <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Benefício
                      </th>
                      <th className="w-32 px-3 py-2.5 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Ordem
                      </th>
                      <th className="w-14 px-2 py-2.5" />
                    </tr>
                  </thead>
                  <tbody>
                    {beneficios.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-4 py-10 text-center text-sm text-muted-foreground">
                          Nenhum benefício adicionado.
                        </td>
                      </tr>
                    ) : (
                      beneficios.map((b, idx) => (
                        <tr key={`${b}-${idx}`} className="border-t border-border">
                          <td className="px-3 py-2.5 text-center text-sm font-medium text-muted-foreground">
                            {idx + 1}
                          </td>
                          <td className="px-3 py-2.5 text-sm text-foreground">
                            {editingBeneficioIdx === idx ? (
                              <input
                                autoFocus
                                value={editingBeneficioValue}
                                onChange={(e) => setEditingBeneficioValue(e.target.value)}
                                onBlur={commitEditBeneficio}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    e.preventDefault();
                                    commitEditBeneficio();
                                  } else if (e.key === "Escape") {
                                    setEditingBeneficioIdx(null);
                                    setEditingBeneficioValue("");
                                  }
                                }}
                                className="h-8 w-full rounded-md border border-info/50 bg-card px-2 text-sm outline-none focus:border-info/60 focus:ring-2 focus:ring-info/40"
                              />
                            ) : (
                              <button
                                type="button"
                                onClick={() => startEditBeneficio(idx)}
                                className="-mx-1 w-full rounded-md px-1 py-0.5 text-left text-sm text-foreground transition hover:bg-muted/60"
                                title="Clique para editar"
                              >
                                {b}
                              </button>
                            )}
                          </td>
                          <td className="px-3 py-2.5">
                            <div className="flex items-center justify-center gap-1">
                              <button
                                type="button"
                                onClick={() => moverBeneficio(idx, -1)}
                                disabled={idx === 0}
                                className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-30"
                                aria-label="Mover para cima"
                              >
                                <ArrowUp className="h-4 w-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => moverBeneficio(idx, 1)}
                                disabled={idx === beneficios.length - 1}
                                className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-30"
                                aria-label="Mover para baixo"
                              >
                                <ArrowDown className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                          <td className="px-2 py-2.5 text-center">
                            <button
                              type="button"
                              onClick={() => removerBeneficio(idx)}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-destructive transition hover:bg-destructive/10"
                              aria-label="Remover benefício"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </SectionBlock>

            {/* DISPONIBILIDADE */}
            <SectionBlock id="disponibilidade" title="Disponibilidade">
              <div className="grid gap-6 lg:grid-cols-2">
                <div className="grid gap-3">
                  <div className="flex h-5 items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">Dias Válidos</span>
                  </div>
                  <div className="grid grid-cols-7 gap-1.5">
                    {diasSemana.map((d) => {
                      const ativo = diasAceitos.includes(d.key);
                      return (
                        <button
                          key={d.key}
                          type="button"
                          onClick={() => toggleDia(d.key)}
                          className={cn(
                            "inline-flex h-10 min-w-0 items-center justify-center rounded-lg border px-1 text-xs font-semibold transition",
                            ativo
                              ? "border-blue-500 bg-blue-500/10 text-blue-700 dark:text-blue-400"
                              : "border-border bg-card text-muted-foreground hover:border-foreground/40",
                          )}
                        >
                          {d.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid gap-3">
                  <div className="flex h-5 items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">Profissionais do Plano</span>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {profissionaisDisponiveis.map((p) => {
                      const ativo = profissionaisAtendem.includes(p.id);
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => toggleProfissional(p.id)}
                          className={cn(
                            "group flex flex-col items-center gap-1.5 rounded-lg border p-2 transition",
                            ativo
                              ? "border-blue-500 bg-blue-500/5"
                              : "border-border bg-card opacity-60 hover:opacity-100",
                          )}
                        >
                          <div className="relative">
                            <div
                              className={cn(
                                "flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold text-white shadow-sm",
                                p.cor,
                              )}
                            >
                              {p.iniciais}
                            </div>
                            {ativo && (
                              <CheckCircle2 className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full bg-background fill-blue-500 text-white" />
                            )}
                          </div>
                          <span
                            className={cn(
                              "max-w-[72px] truncate text-[11px] font-medium",
                              ativo ? "text-foreground" : "text-muted-foreground",
                            )}
                          >
                            {p.nome}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </SectionBlock>
          </div>

          {/* SIDEBAR DIREITA - PREVIEW DO PLANO */}
          <aside className="lg:sticky lg:top-5 lg:self-start">
            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm mx-0 px-0">
              {/* Header */}
              <div className="border-b border-border p-5">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-lg font-bold uppercase leading-tight text-foreground">
                    {nome.trim() || "Nome do plano"}
                  </h3>
                  {destaque && (
                    <span className="inline-flex shrink-0 items-center gap-1 bg-amber-500/15 px-2 py-0.5 font-bold uppercase tracking-wide text-amber-600 text-xs rounded-full">
                      <Star className="h-3 w-3 fill-amber-500" />
                      Destaque
                    </span>
                  )}
                </div>
              </div>

              {/* Body */}
              <div className="space-y-3 p-4 px-[17px]">
                {/* Inclusos */}
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-sky-500">
                    Incluso:
                  </p>

                  <ul className="mt-2 flex flex-col my-[7px] px-0 py-0 gap-[10px]">
                    {servicosArr.length === 0 && produtosArr.length === 0 && beneficios.length === 0 && (
                      <li className="text-[13px] italic text-muted-foreground">
                        Configure os itens do plano.
                      </li>
                    )}

                    {/* Serviços 100% gratuitos (inclusos individualmente) */}
                    {servicosInclusos.filter((s) => !hiddenResumo.has(`s-${s.id}`)).map((s) => (
                      <li key={`s-${s.id}`} className="group flex items-start gap-2 text-[13px] font-medium text-foreground">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 fill-emerald-500/20 text-emerald-600" />
                        <span className="flex-1">
                          {s.usos === "ILIMITADO"
                            ? `${nomeServico(s.id)} ilimitado`
                            : `${s.usos}x ${nomeServico(s.id)}`}
                        </span>
                        <button
                          type="button"
                          onClick={() => ocultarResumo(`s-${s.id}`)}
                          className="opacity-0 transition group-hover:opacity-100"
                          aria-label="Ocultar do resumo"
                          title="Ocultar do resumo"
                        >
                          <X className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
                        </button>
                      </li>
                    ))}

                    {/* Serviços com desconto (% < 100) agrupados */}
                    {servicosComDesconto.length > 0 && !hiddenResumo.has("desc-servicos") && (
                      <li className="group flex items-start gap-2 text-[13px] font-medium text-foreground">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 fill-emerald-500/20 text-emerald-600" />
                        <span className="flex-1">Descontos em serviços</span>
                        <button
                          type="button"
                          onClick={() => ocultarResumo("desc-servicos")}
                          className="opacity-0 transition group-hover:opacity-100"
                          aria-label="Ocultar do resumo"
                          title="Ocultar do resumo"
                        >
                          <X className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
                        </button>
                      </li>
                    )}

                    {/* Produtos */}
                    {produtosArr.length > 0 && !hiddenResumo.has("desc-produtos") && (
                      <li className="group flex items-start gap-2 text-[13px] font-medium text-foreground">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 fill-emerald-500/20 text-emerald-600" />
                        <span className="flex-1">Descontos em produtos</span>
                        <button
                          type="button"
                          onClick={() => ocultarResumo("desc-produtos")}
                          className="opacity-0 transition group-hover:opacity-100"
                          aria-label="Ocultar do resumo"
                          title="Ocultar do resumo"
                        >
                          <X className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
                        </button>
                      </li>
                    )}

                    {/* Benefícios extras */}
                    {beneficios.map((b, idx) => !hiddenResumo.has(`b-${idx}`) && (
                      <li key={`b-${idx}`} className="group flex items-start gap-2 text-[13px] font-medium text-foreground">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 fill-emerald-500/20 text-emerald-600" />
                        <span className="flex-1">{b}</span>
                        <button
                          type="button"
                          onClick={() => ocultarResumo(`b-${idx}`)}
                          className="opacity-0 transition group-hover:opacity-100"
                          aria-label="Ocultar do resumo"
                          title="Ocultar do resumo"
                        >
                          <X className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
                        </button>
                      </li>
                    ))}

                    {/* Dias válidos */}
                    <li className="flex items-start gap-2 text-[13px] font-medium text-foreground">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 fill-emerald-500/20 text-emerald-600" />
                      <span>{diasValidosLabel}</span>
                    </li>
                  </ul>
                </div>

              </div>

              {/* Footer (preço + status) */}
              <div className="border-t border-border bg-card px-5 py-4 my-0">
                <div className="flex items-end justify-between gap-2">
                  <div>
                    <span className="text-xl font-bold text-foreground">
                      R$ {valor || "0,00"}
                    </span>
                    <span className="ml-1 text-sm text-muted-foreground">{recorrenciaLabel}</span>
                  </div>
                  <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-semibold", disponivelVenda ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400" : "bg-muted text-muted-foreground")}>
                    {disponivelVenda ? "Disponível" : "Indisponível"}
                  </span>
                </div>

              </div>
            </div>
          </aside>
        </div>

      </div>
      <YouTubeModal
        open={aulaOpen}
        onClose={() => setAulaOpen(false)}
        videoUrl="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
        title="Aula - Cadastro de Plano"
      />
    </AppLayout>
  );
}
