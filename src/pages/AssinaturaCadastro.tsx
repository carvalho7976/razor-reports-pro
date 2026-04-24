import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { TextField, Dropdown } from "@/components/FormModal";
import { useToast } from "@/hooks/use-toast";
import {
  Plus,
  CalendarDays,
  Trash2,
  ArrowUp,
  ArrowDown,
  Search,
  Star,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";

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
  { id: "dados", label: "Dados do plano" },
  { id: "servicos", label: "Serviços" },
  { id: "produtos", label: "Produtos" },
  { id: "beneficios", label: "Benefícios" },
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
    <div className="grid gap-1.5">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <div className="flex h-10 items-center rounded-lg border border-border bg-background text-sm focus-within:ring-2 focus-within:ring-primary/20">
        <span className="pl-3 pr-1 text-muted-foreground">R$</span>
        <input
          value={formatted}
          onChange={(e) => {
            const digits = e.target.value.replace(/\D/g, "");
            const num = (parseInt(digits || "0", 10) / 100).toFixed(2).replace(".", ",");
            onChange(num);
          }}
          className="h-full flex-1 bg-transparent pr-3 text-sm outline-none"
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
      className={cn("scroll-mt-24 rounded-xl border border-border bg-card p-4", className)}
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
}: {
  items: T[];
  selected: Map<number, ServicoIncluso>;
  setSelected: (m: Map<number, ServicoIncluso>) => void;
  searchPlaceholder: string;
  comissaoEnabled?: boolean;
  hideUsos?: boolean;
}) {
  const [busca, setBusca] = useState("");

  const filtered = items.filter((i) => i.nome.toLowerCase().includes(busca.toLowerCase()));
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

  return (
    <div className="rounded-xl border border-border bg-card">
      {/* Search header */}
      <div className="flex items-center gap-2 border-b border-border p-3">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder={searchPlaceholder}
            className="h-10 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <button
          type="button"
          onClick={toggleAll}
          className="h-10 shrink-0 rounded-lg border border-border bg-background px-4 text-sm font-medium text-foreground transition hover:bg-muted"
        >
          {allSelected ? "Desmarcar todos" : "Selecionar todos"}
        </button>
      </div>

      {/* List */}
      <div className="max-h-[260px] overflow-y-auto p-2">
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
                  <div className="flex items-center gap-3 px-3 py-2.5">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => toggle(item.id)}
                      onClick={(e) => e.stopPropagation()}
                      className="h-4 w-4 rounded-md border border-zinc-400 bg-background shadow-sm data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white"
                    />
                    <span className="flex-1 truncate text-sm font-medium text-foreground">
                      {item.nome}
                    </span>

                    {isSelected && (
                      <div
                        className="flex flex-wrap items-end gap-2.5"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {/* DESCONTO */}
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                            Desconto
                          </span>
                          <div className="flex h-9 items-center rounded-md border border-border bg-background">
                            <input
                              type="text"
                              inputMode="numeric"
                              value={sel.desconto}
                              onChange={(e) =>
                                update(item.id, "desconto", e.target.value.replace(/\D/g, ""))
                              }
                              className="h-full w-12 bg-transparent px-2 text-right text-sm outline-none"
                            />
                            <span className="pr-2 text-xs text-muted-foreground">%</span>
                          </div>
                        </div>

                        {/* USOS */}
                        {!hideUsos && (
                          <div className="flex flex-col gap-0.5">
                            <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                              Usos/mês
                            </span>
                            <select
                              value={sel.usos}
                              onChange={(e) => update(item.id, "usos", e.target.value)}
                              className="h-9 w-[110px] rounded-md border border-blue-500/40 bg-background px-2 text-xs font-semibold text-foreground outline-none focus:ring-2 focus:ring-primary/20"
                            >
                              {usosOptions.map((o) => (
                                <option key={o.value} value={o.value}>
                                  {o.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}

                        {/* COMISSÃO */}
                        {comissaoEnabled && (
                          <div className="flex flex-col gap-0.5">
                            <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                              Comissão
                            </span>
                            <select
                              value={sel.comissao}
                              onChange={(e) => update(item.id, "comissao", e.target.value)}
                              className="h-9 w-[130px] rounded-md border border-blue-500/40 bg-background px-2 text-xs font-semibold text-foreground outline-none focus:ring-2 focus:ring-primary/20"
                            >
                              {comissaoOptions.map((o) => (
                                <option key={o.value} value={o.value}>
                                  {o.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}

                        {/* % COM. ou PONTOS  */}
                        {comissaoEnabled &&
                          (sel.comissao === "PORCENTAGEM" || sel.comissao === "PONTOS") && (
                            <div className="flex flex-col gap-0.5">
                              <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                                {sel.comissao === "PONTOS" ? "Pontos" : "% com."}
                              </span>
                              <div className="flex h-9 items-center rounded-md border border-border bg-background">
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
                                  className="h-full w-12 bg-transparent px-2 text-right text-sm outline-none"
                                />
                                <span className="pr-2 text-xs text-muted-foreground">
                                  {sel.comissao === "PONTOS" ? "pts" : "%"}
                                </span>
                              </div>
                            </div>
                          )}
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

  // Detalhes
  const [nome, setNome] = useState(editing || "");
  const [valor, setValor] = useState("250,00");
  const [recorrencia, setRecorrencia] = useState("MENSAL");
  const [formaPagamento, setFormaPagamento] = useState("CARTAO_CREDITO");
  const [disponivelVenda, setDisponivelVenda] = useState(true);
  const [destaque, setDestaque] = useState(false);

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
        <div className="mx-6 mt-4">
          <div className="flex items-start justify-between gap-4">
            <div className="pt-1">
              <h1 className="text-xl font-bold text-foreground">
                {editing ? "Editar plano de assinatura" : "Novo plano de assinatura"}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Configure os dados, serviços e produtos do plano.
              </p>
            </div>
          </div>
        </div>

        {/* TAB BAR (anchor-style, profissionalPerfil pattern) */}
        <div className="mt-4 border-b border-border bg-background">
          <div className="mx-6 flex gap-6 overflow-x-auto">
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
        <div className="mx-6 mt-5 grid grid-cols-1 gap-5 pb-24 lg:grid-cols-[minmax(0,1fr)_280px]">
          {/* COLUNA PRINCIPAL */}
          <div className="flex flex-col gap-5">
            {/* DADOS DO PLANO */}
            <SectionBlock
              id="dados"
              title="Dados do plano"
              description="Identificação e cobrança do plano de assinatura."
            >
              <div className="grid gap-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1.2fr)_minmax(0,1.2fr)]">
                  <TextField
                    label="Nome do plano *"
                    value={nome}
                    onChange={setNome}
                    placeholder="Ex: Francez Plano Master"
                    error={showError("nome")}
                  />
                  <CurrencyInput label="Valor" value={valor} onChange={setValor} />
                  <Dropdown
                    label="Recorrência"
                    value={recorrencia}
                    setValue={setRecorrencia}
                    options={recorrenciaOptions}
                  />
                  <Dropdown
                    label="Forma de pagamento"
                    value={formaPagamento}
                    setValue={setFormaPagamento}
                    options={formaPagamentoOptions}
                  />
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 px-3 py-2.5">
                    <div>
                      <p className="text-sm font-semibold text-foreground">Disponível na vitrine</p>
                      <p className="text-xs text-muted-foreground">
                        Quando ativo, fica disponível para venda.
                      </p>
                    </div>
                    <Switch checked={disponivelVenda} onCheckedChange={setDisponivelVenda} />
                  </div>

                  <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <Star
                        className={cn(
                          "h-4 w-4",
                          destaque ? "fill-amber-500 text-amber-500" : "text-muted-foreground",
                        )}
                      />
                      <div>
                        <p className="text-sm font-semibold text-foreground">Destaque</p>
                        <p className="text-xs text-muted-foreground">
                          Marca este plano como destaque na vitrine.
                        </p>
                      </div>
                    </div>
                    <Switch checked={destaque} onCheckedChange={setDestaque} />
                  </div>
                </div>
              </div>
            </SectionBlock>

            {/* SERVIÇOS */}
            <SectionBlock
              id="servicos"
              title="Serviços inclusos"
              description="Selecione os serviços e configure desconto, usos e comissão."
              rightSlot={
                <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                  {servicosArr.length} selecionado(s)
                </span>
              }
            >
              <InlineSelectableList
                items={servicosDisponiveis}
                selected={servicosMap}
                setSelected={setServicosMap}
                searchPlaceholder="Buscar serviço..."
              />
            </SectionBlock>

            {/* PRODUTOS */}
            <SectionBlock
              id="produtos"
              title="Desconto em produtos"
              description="Selecione os produtos com desconto incluído no plano."
              rightSlot={
                <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                  {produtosArr.length} selecionado(s)
                </span>
              }
            >
              <InlineSelectableList
                items={produtosDisponiveis}
                selected={produtosMap}
                setSelected={setProdutosMap}
                searchPlaceholder="Buscar produto..."
                hideUsos
              />
            </SectionBlock>

            {/* BENEFÍCIOS */}
            <SectionBlock
              id="beneficios"
              title="Benefícios"
              description="Itens exibidos no plano. Use as setas para reorganizar."
            >
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
                  className="h-10 flex-1 rounded-lg border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
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
                          <td className="px-3 py-2.5 text-sm text-foreground">{b}</td>
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
            <SectionBlock
              id="disponibilidade"
              title="Disponibilidade"
              description="Dias e profissionais que aceitam o plano."
            >
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">Dias aceitos</span>
                  </div>
                  <div className="grid grid-cols-7 gap-2">
                    {diasSemana.map((d) => {
                      const ativo = diasAceitos.includes(d.key);
                      return (
                        <button
                          key={d.key}
                          type="button"
                          onClick={() => toggleDia(d.key)}
                          className={cn(
                            "inline-flex h-12 items-center justify-center rounded-lg border text-sm font-semibold transition",
                            ativo
                              ? "border-foreground bg-blue-500/10 text-blue-700 dark:text-blue-400"
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
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium text-foreground">
                      Profissionais que atendem
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {profissionaisAtendem.length} de {profissionaisDisponiveis.length}
                    </span>
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
                              ? "border-foreground bg-blue-500/5"
                              : "border-border bg-card opacity-60 hover:opacity-100",
                          )}
                        >
                          <div className="relative">
                            <div
                              className={cn(
                                "flex h-14 w-14 items-center justify-center rounded-full text-sm font-bold text-white shadow-sm",
                                p.cor,
                              )}
                            >
                              {p.iniciais}
                            </div>
                            {ativo && (
                              <CheckCircle2 className="absolute -bottom-0.5 -right-0.5 h-5 w-5 rounded-full bg-background fill-blue-500 text-white" />
                            )}
                          </div>
                          <span
                            className={cn(
                              "max-w-[80px] truncate text-xs font-medium",
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
          <aside className="lg:sticky lg:top-16 lg:self-start">
            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
              {/* Header */}
              <div className="border-b border-border p-5">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-xl font-bold uppercase leading-tight text-foreground">
                    {nome.trim() || "Nome do plano"}
                  </h3>
                  {destaque && (
                    <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-600">
                      <Star className="h-3 w-3 fill-amber-500" />
                      Destaque
                    </span>
                  )}
                </div>
              </div>

              {/* Body */}
              <div className="space-y-4 p-5">
                {/* Inclusos */}
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-sky-500">
                    Incluso:
                  </p>

                  <ul className="mt-3 flex flex-col gap-2">
                    {servicosArr.length === 0 && produtosArr.length === 0 && beneficios.length === 0 && (
                      <li className="text-sm italic text-muted-foreground">
                        Configure os itens do plano.
                      </li>
                    )}

                    {/* Serviços */}
                    {servicosArr.map((s) => (
                      <li key={`s-${s.id}`} className="flex items-start gap-2 text-sm font-semibold uppercase text-foreground">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 fill-emerald-500/20 text-emerald-600" />
                        <span>
                          {s.usos === "ILIMITADO" ? "Ilimitado" : s.usos} {nomeServico(s.id)}
                          {s.desconto !== "0" && s.desconto !== "100" && (
                            <span className="ml-1 normal-case text-muted-foreground">
                              ({s.desconto}% desc)
                            </span>
                          )}
                        </span>
                      </li>
                    ))}

                    {/* Produtos */}
                    {produtosArr.length > 0 && (
                      <li className="flex items-start gap-2 text-sm font-semibold uppercase text-foreground">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 fill-emerald-500/20 text-emerald-600" />
                        <span>Descontos em produtos</span>
                      </li>
                    )}

                    {/* Benefícios extras */}
                    {beneficios.map((b, idx) => (
                      <li key={`b-${idx}`} className="flex items-start gap-2 text-sm font-semibold uppercase text-foreground">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 fill-emerald-500/20 text-emerald-600" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>

              {/* Footer (preço + status) */}
              <div className="border-t border-border bg-muted/20 px-5 py-4">
                <div className="flex items-end justify-between gap-2">
                  <div>
                    <span className="text-xl font-bold text-foreground">
                      R$ {valor || "0,00"}
                    </span>
                    <span className="ml-1 text-sm text-muted-foreground">{recorrenciaLabel}</span>
                  </div>
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
                      disponivelVenda
                        ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    {disponivelVenda ? "Ativo" : "Inativo"}
                  </span>
                </div>

              </div>
            </div>
          </aside>
        </div>

        {/* FOOTER */}
        <div className="border-t border-border bg-card px-6 py-4">
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={handleSalvar}
              className="inline-flex h-11 items-center justify-center rounded-lg bg-foreground px-6 text-sm font-semibold text-background"
            >
              {editing ? "Salvar alterações" : "Criar plano"}
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
