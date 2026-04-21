import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { TextField, Dropdown } from "@/components/FormModal";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Plus, X, Search, Check, CalendarDays, Users, Package, Sparkles, Tag } from "lucide-react";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";

interface ServicoOpt {
  id: number;
  nome: string;
}
interface ProdutoOpt {
  id: number;
  nome: string;
}
interface ProfissionalOpt {
  id: number;
  nome: string;
  iniciais: string;
}

const servicosDisponiveis: ServicoOpt[] = [
  { id: 1, nome: "Barba + Sobrancelha" },
  { id: 2, nome: "Barba Pacote" },
  { id: 3, nome: "Barba!" },
  { id: 4, nome: "Bigode" },
  { id: 5, nome: "Corte Masculino" },
  { id: 6, nome: "Corte Feminino" },
  { id: 7, nome: "Hidratação" },
  { id: 8, nome: "Coloração" },
  { id: 9, nome: "Manicure" },
  { id: 10, nome: "Pedicure" },
];

const produtosDisponiveis: ProdutoOpt[] = [
  { id: 1, nome: "3030 Condicionador Lavado" },
  { id: 2, nome: "Agua" },
  { id: 3, nome: "Balm" },
  { id: 4, nome: "Biscoito teste v" },
  { id: 5, nome: "Botox" },
  { id: 6, nome: "color dicolor 10.89" },
];

const profissionaisDisponiveis: ProfissionalOpt[] = [
  { id: 1, nome: "Cesar", iniciais: "CC" },
  { id: 2, nome: "Claudia", iniciais: "CC" },
  { id: 3, nome: "Marcia Silva", iniciais: "MS" },
  { id: 4, nome: "Matheus", iniciais: "MM" },
  { id: 5, nome: "Vini", iniciais: "VV" },
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
  { value: "ILIMITADO", label: "Ilimitado" },
  { value: "1", label: "1x / mês" },
  { value: "2", label: "2x / mês" },
  { value: "4", label: "4x / mês" },
  { value: "8", label: "8x / mês" },
];

const comissaoOptions = [
  { value: "TEMPO", label: "Por tempo" },
  { value: "VALOR", label: "Por valor" },
  { value: "FIXO", label: "Valor fixo" },
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
}

function SectionBlock({
  step,
  title,
  description,
  rightSlot,
  children,
}: {
  step: number;
  title: string;
  description?: string;
  rightSlot?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 sm:p-5">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-foreground text-xs font-bold text-background">
            {step}
          </div>
          <div>
            <h2 className="text-base font-semibold text-foreground">{title}</h2>
            {description && (
              <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
            )}
          </div>
        </div>
        {rightSlot}
      </div>
      {children}
    </div>
  );
}

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
    <div className="grid gap-0.5">
      <label className="text-[13px] font-semibold text-foreground">{label}</label>
      <div className="flex h-10 items-center rounded-lg border border-border bg-card text-sm focus-within:border-foreground focus-within:ring-4 focus-within:ring-muted">
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

export default function AssinaturaCadastro() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  const editing = searchParams.get("nome");

  // Step 1
  const [nome, setNome] = useState(editing || "");
  const [valor, setValor] = useState("89,00");
  const [recorrencia, setRecorrencia] = useState("MENSAL");
  const [formaPagamento, setFormaPagamento] = useState("CARTAO_CREDITO");
  const [disponivelVenda, setDisponivelVenda] = useState(false);
  const [beneficios, setBeneficios] = useState<string[]>([
    "Mesa de sinuca",
    "10 % de desconto",
    "Traga um amigo no aniversario",
  ]);
  const [novoBeneficio, setNovoBeneficio] = useState("");

  // Step 2 - Serviços
  const [servicosBusca, setServicosBusca] = useState("");
  const [servicosInclusos, setServicosInclusos] = useState<ServicoIncluso[]>([
    { id: 1, desconto: "100", usos: "ILIMITADO", comissao: "TEMPO" },
    { id: 2, desconto: "100", usos: "ILIMITADO", comissao: "TEMPO" },
    { id: 3, desconto: "100", usos: "ILIMITADO", comissao: "TEMPO" },
    { id: 4, desconto: "100", usos: "ILIMITADO", comissao: "TEMPO" },
  ]);

  // Step 3 - Produtos
  const [produtosBusca, setProdutosBusca] = useState("");
  const [produtosSelecionados, setProdutosSelecionados] = useState<number[]>([]);
  const [descontoProdutos, setDescontoProdutos] = useState("10");

  // Step 4 - Disponibilidade
  const [diasAceitos, setDiasAceitos] = useState<string[]>([
    "seg", "ter", "qua", "qui", "sex",
  ]);
  const [profissionaisAtendem, setProfissionaisAtendem] = useState<number[]>([1, 2, 3, 4]);

  // Errors
  const [showErrors, setShowErrors] = useState(false);
  const errors = {
    nome: !nome.trim() ? "Informe o nome do plano" : "",
  };

  const showError = (k: keyof typeof errors) => (showErrors ? errors[k] : "");

  const toggleServico = (id: number) => {
    setServicosInclusos((prev) =>
      prev.some((s) => s.id === id)
        ? prev.filter((s) => s.id !== id)
        : [...prev, { id, desconto: "100", usos: "ILIMITADO", comissao: "TEMPO" }]
    );
  };

  const updateServico = (id: number, field: keyof ServicoIncluso, value: string) =>
    setServicosInclusos((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );

  const selecionarTodosServicos = () => {
    if (servicosInclusos.length === servicosDisponiveis.length) {
      setServicosInclusos([]);
    } else {
      setServicosInclusos(
        servicosDisponiveis.map((s) => ({
          id: s.id,
          desconto: "100",
          usos: "ILIMITADO",
          comissao: "TEMPO",
        }))
      );
    }
  };

  const toggleProduto = (id: number) => {
    setProdutosSelecionados((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const toggleDia = (key: string) =>
    setDiasAceitos((prev) =>
      prev.includes(key) ? prev.filter((d) => d !== key) : [...prev, key]
    );

  const toggleProfissional = (id: number) =>
    setProfissionaisAtendem((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );

  const adicionarBeneficio = () => {
    const t = novoBeneficio.trim();
    if (!t) return;
    setBeneficios((prev) => [...prev, t]);
    setNovoBeneficio("");
  };

  const removerBeneficio = (idx: number) =>
    setBeneficios((prev) => prev.filter((_, i) => i !== idx));

  const servicosFiltrados = useMemo(
    () =>
      servicosDisponiveis.filter((s) =>
        s.nome.toLowerCase().includes(servicosBusca.toLowerCase())
      ),
    [servicosBusca]
  );

  const produtosFiltrados = useMemo(
    () =>
      produtosDisponiveis.filter((p) =>
        p.nome.toLowerCase().includes(produtosBusca.toLowerCase())
      ),
    [produtosBusca]
  );

  const handleSalvar = () => {
    setShowErrors(true);
    if (errors.nome) {
      toast({ title: "Verifique os campos obrigatórios", variant: "destructive" });
      return;
    }
    toast({ title: editing ? "Plano atualizado" : "Plano criado com sucesso" });
    navigate("/assinantePesquisa");
  };

  const handleCancelar = () => navigate(-1);

  const getServicoIncluso = (id: number) =>
    servicosInclusos.find((s) => s.id === id);

  return (
    <AppLayout>
      <div className="mx-auto flex max-w-6xl flex-col gap-5 pb-24">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleCancelar}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-card px-3 text-sm font-medium text-foreground transition hover:bg-muted"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </button>
            <h1 className="text-xl font-bold text-foreground">
              {editing ? "Editar plano" : "Novo plano"}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCancelar}
              className="inline-flex h-9 items-center justify-center rounded-lg border border-border bg-card px-4 text-sm font-semibold text-foreground transition hover:bg-muted"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSalvar}
              className="inline-flex h-9 items-center justify-center rounded-lg bg-foreground px-5 text-sm font-semibold text-background transition hover:bg-foreground/90 active:scale-[0.98]"
            >
              Salvar plano
            </button>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
          {/* MAIN */}
          <div className="grid gap-5">
            {/* SECTION 1 - Detalhes */}
            <SectionBlock
              step={1}
              title="Detalhes do plano"
              description="Informações principais e configuração comercial."
            >
              <div className="grid gap-4">
                <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_160px_160px]">
                  <TextField
                    label="Nome do plano *"
                    value={nome}
                    onChange={setNome}
                    placeholder="Ex: Plano Mensal Premium"
                    error={showError("nome")}
                  />
                  <CurrencyInput label="Valor" value={valor} onChange={setValor} />
                  <Dropdown
                    label="Recorrência"
                    value={recorrencia}
                    setValue={setRecorrencia}
                    options={recorrenciaOptions}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <Dropdown
                    label="Forma de pagamento"
                    value={formaPagamento}
                    setValue={setFormaPagamento}
                    options={formaPagamentoOptions}
                  />
                  <div className="flex items-end">
                    <div className="flex w-full items-center justify-between rounded-lg border border-border bg-muted/30 px-3 py-2.5">
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          Disponível para venda
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Ative ou desative este plano na vitrine
                        </p>
                      </div>
                      <Switch
                        checked={disponivelVenda}
                        onCheckedChange={setDisponivelVenda}
                      />
                    </div>
                  </div>
                </div>

                {/* Benefícios */}
                <div className="grid gap-2">
                  <label className="text-[13px] font-semibold text-foreground">
                    Benefícios do plano
                  </label>
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
                      className="h-10 flex-1 rounded-lg border border-border bg-card px-3 text-sm outline-none transition focus:border-foreground focus:ring-4 focus:ring-muted"
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
                  {beneficios.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {beneficios.map((b, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-3 py-1 text-xs font-medium text-background"
                        >
                          <Sparkles className="h-3 w-3" />
                          {b}
                          <button
                            type="button"
                            onClick={() => removerBeneficio(idx)}
                            className="ml-0.5 rounded-full hover:bg-background/20"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </SectionBlock>

            {/* SECTION 2 - Serviços */}
            <SectionBlock
              step={2}
              title="Serviços inclusos"
              description="Selecione os serviços que fazem parte do plano e configure desconto, limite de uso e comissionamento."
              rightSlot={
                <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-foreground">
                  {servicosInclusos.length} selecionado(s)
                </span>
              }
            >
              <div className="grid gap-3">
                <div className="flex flex-wrap gap-2">
                  <div className="relative flex-1 min-w-[200px]">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      value={servicosBusca}
                      onChange={(e) => setServicosBusca(e.target.value)}
                      placeholder="Buscar serviço..."
                      className="h-10 w-full rounded-lg border border-border bg-card pl-9 pr-3 text-sm outline-none transition focus:border-foreground focus:ring-4 focus:ring-muted"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={selecionarTodosServicos}
                    className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-border bg-card px-4 text-sm font-semibold text-foreground transition hover:bg-muted"
                  >
                    <Check className="h-4 w-4" />
                    {servicosInclusos.length === servicosDisponiveis.length
                      ? "Limpar todos"
                      : "Selecionar todos"}
                  </button>
                </div>

                <div className="max-h-[340px] overflow-y-auto rounded-lg border border-border">
                  {servicosFiltrados.length === 0 ? (
                    <div className="p-6 text-center text-sm text-muted-foreground">
                      Nenhum serviço encontrado.
                    </div>
                  ) : (
                    servicosFiltrados.map((s, idx) => {
                      const incluso = getServicoIncluso(s.id);
                      const isLast = idx === servicosFiltrados.length - 1;
                      return (
                        <div
                          key={s.id}
                          className={cn(
                            "grid grid-cols-1 items-center gap-3 px-3 py-2.5 md:grid-cols-[minmax(0,1fr)_auto] transition",
                            !isLast && "border-b border-border",
                            incluso ? "bg-muted/40" : "bg-card"
                          )}
                        >
                          <label className="flex cursor-pointer select-none items-center gap-3">
                            <Checkbox
                              checked={!!incluso}
                              onCheckedChange={() => toggleServico(s.id)}
                              className="h-4 w-4 rounded-md border border-zinc-400 bg-background shadow-sm hover:bg-muted data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 data-[state=checked]:text-white"
                            />
                            <span className="text-sm font-medium text-foreground">
                              {s.nome}
                            </span>
                          </label>

                          {incluso && (
                            <div className="grid grid-cols-3 gap-2 md:w-[360px]">
                              <div className="grid gap-0.5">
                                <span className="text-[10px] font-semibold uppercase text-muted-foreground">
                                  Desconto
                                </span>
                                <div className="flex h-9 items-center rounded-md border border-border bg-card text-sm">
                                  <input
                                    value={incluso.desconto}
                                    onChange={(e) =>
                                      updateServico(
                                        s.id,
                                        "desconto",
                                        e.target.value.replace(/\D/g, "")
                                      )
                                    }
                                    className="h-full w-full bg-transparent px-2 text-sm outline-none"
                                  />
                                  <span className="pr-2 text-xs text-muted-foreground">
                                    %
                                  </span>
                                </div>
                              </div>
                              <div className="grid gap-0.5">
                                <span className="text-[10px] font-semibold uppercase text-muted-foreground">
                                  Usos/mês
                                </span>
                                <select
                                  value={incluso.usos}
                                  onChange={(e) =>
                                    updateServico(s.id, "usos", e.target.value)
                                  }
                                  className="h-9 rounded-md border border-border bg-card px-2 text-xs font-medium uppercase text-foreground outline-none"
                                >
                                  {usosOptions.map((o) => (
                                    <option key={o.value} value={o.value}>
                                      {o.label}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div className="grid gap-0.5">
                                <span className="text-[10px] font-semibold uppercase text-muted-foreground">
                                  Comissão
                                </span>
                                <select
                                  value={incluso.comissao}
                                  onChange={(e) =>
                                    updateServico(s.id, "comissao", e.target.value)
                                  }
                                  className="h-9 rounded-md border border-border bg-card px-2 text-xs font-medium uppercase text-foreground outline-none"
                                >
                                  {comissaoOptions.map((o) => (
                                    <option key={o.value} value={o.value}>
                                      {o.label}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </SectionBlock>

            {/* SECTION 3 - Produtos */}
            <SectionBlock
              step={3}
              title="Desconto em produtos"
              description="Aplique um desconto nos produtos selecionados para assinantes deste plano."
              rightSlot={
                <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-foreground">
                  {produtosSelecionados.length} selecionado(s)
                </span>
              }
            >
              <div className="grid gap-3">
                <div className="flex flex-wrap gap-2">
                  <div className="relative flex-1 min-w-[200px]">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      value={produtosBusca}
                      onChange={(e) => setProdutosBusca(e.target.value)}
                      placeholder="Buscar produto..."
                      className="h-10 w-full rounded-lg border border-border bg-card pl-9 pr-3 text-sm outline-none transition focus:border-foreground focus:ring-4 focus:ring-muted"
                    />
                  </div>
                  <div className="flex h-10 items-center gap-2 rounded-lg border border-border bg-card px-3">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs font-semibold text-muted-foreground">
                      DESCONTO
                    </span>
                    <input
                      value={descontoProdutos}
                      onChange={(e) =>
                        setDescontoProdutos(e.target.value.replace(/\D/g, ""))
                      }
                      className="h-full w-12 bg-transparent text-sm font-semibold text-foreground outline-none"
                    />
                    <span className="text-xs text-muted-foreground">%</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (produtosSelecionados.length === produtosDisponiveis.length) {
                        setProdutosSelecionados([]);
                      } else {
                        setProdutosSelecionados(produtosDisponiveis.map((p) => p.id));
                      }
                    }}
                    className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-border bg-card px-4 text-sm font-semibold text-foreground transition hover:bg-muted"
                  >
                    <Check className="h-4 w-4" />
                    {produtosSelecionados.length === produtosDisponiveis.length
                      ? "Limpar"
                      : "Todos"}
                  </button>
                </div>

                <div className="max-h-[260px] overflow-y-auto rounded-lg border border-border">
                  {produtosFiltrados.map((p, idx) => {
                    const isLast = idx === produtosFiltrados.length - 1;
                    const sel = produtosSelecionados.includes(p.id);
                    return (
                      <label
                        key={p.id}
                        className={cn(
                          "flex cursor-pointer select-none items-center gap-3 px-3 py-2.5 transition",
                          !isLast && "border-b border-border",
                          sel ? "bg-muted/40" : "bg-card hover:bg-muted/20"
                        )}
                      >
                        <Checkbox
                          checked={sel}
                          onCheckedChange={() => toggleProduto(p.id)}
                          className="h-4 w-4 rounded-md border border-zinc-400 bg-background shadow-sm hover:bg-muted data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 data-[state=checked]:text-white"
                        />
                        <span className="text-sm font-medium text-foreground">
                          {p.nome}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </SectionBlock>

            {/* SECTION 4 - Disponibilidade */}
            <SectionBlock
              step={4}
              title="Disponibilidade"
              description="Defina quando o plano pode ser utilizado e quais profissionais atendem."
            >
              <div className="grid gap-5">
                {/* Dias */}
                <div className="grid gap-2">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-muted-foreground" />
                    <span className="text-[13px] font-semibold text-foreground">
                      Dias em que o plano é aceito
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {diasSemana.map((d) => {
                      const ativo = diasAceitos.includes(d.key);
                      return (
                        <button
                          key={d.key}
                          type="button"
                          onClick={() => toggleDia(d.key)}
                          className={cn(
                            "inline-flex h-9 min-w-[64px] items-center justify-center rounded-lg border px-4 text-sm font-semibold transition",
                            ativo
                              ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                              : "border-rose-500/30 bg-rose-500/5 text-rose-600 dark:text-rose-400 hover:border-rose-500/50"
                          )}
                        >
                          {d.label}
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Verde = aceito · Vermelho = não aceito · Clique para alternar
                  </p>
                </div>

                {/* Profissionais */}
                <div className="grid gap-2">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-[13px] font-semibold text-foreground">
                      Profissionais que atendem
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {profissionaisDisponiveis.map((p) => {
                      const ativo = profissionaisAtendem.includes(p.id);
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => toggleProfissional(p.id)}
                          className={cn(
                            "inline-flex h-9 items-center gap-2 rounded-full border pl-1 pr-3 text-sm font-medium transition",
                            ativo
                              ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                              : "border-rose-500/30 bg-rose-500/5 text-rose-600 dark:text-rose-400 hover:border-rose-500/50"
                          )}
                        >
                          <span
                            className={cn(
                              "flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold",
                              ativo
                                ? "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300"
                                : "bg-rose-500/15 text-rose-600 dark:text-rose-400"
                            )}
                          >
                            {p.iniciais}
                          </span>
                          {p.nome}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </SectionBlock>
          </div>

          {/* SIDEBAR - Resumo sticky */}
          <aside className="self-start lg:sticky lg:top-4">
            <div className="rounded-xl border border-border bg-card p-4">
              <div className="mb-3 flex items-center gap-2">
                <Package className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-semibold text-foreground">
                  Resumo do plano
                </h3>
              </div>

              <div className="mb-4 rounded-lg bg-muted/40 p-3">
                <p className="text-xs text-muted-foreground">
                  {nome || "Novo plano"}
                </p>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className="text-xs text-foreground">R$</span>
                  <span className="text-2xl font-bold text-foreground">
                    {valor || "0,00"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    /
                    {recorrenciaOptions
                      .find((r) => r.value === recorrencia)
                      ?.label.toLowerCase()}
                  </span>
                </div>
              </div>

              <div className="grid gap-2.5 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Serviços</span>
                  <span className="font-semibold text-foreground">
                    {servicosInclusos.length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Produtos com desconto</span>
                  <span className="font-semibold text-foreground">
                    {produtosSelecionados.length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Benefícios</span>
                  <span className="font-semibold text-foreground">
                    {beneficios.length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Dias disponíveis</span>
                  <span className="font-semibold text-foreground">
                    {diasAceitos.length}/7
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Profissionais</span>
                  <span className="font-semibold text-foreground">
                    {profissionaisAtendem.length}/
                    {profissionaisDisponiveis.length}
                  </span>
                </div>
              </div>

              <div className="mt-4 border-t border-border pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-foreground">
                    Status na vitrine
                  </span>
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase",
                      disponivelVenda
                        ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {disponivelVenda ? "Ativo" : "Oculto"}
                  </span>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* Footer fixo */}
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={handleCancelar}
            className="inline-flex h-10 items-center justify-center rounded-lg border border-border bg-card px-4 text-sm font-semibold text-foreground transition hover:bg-muted"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSalvar}
            className="inline-flex h-10 items-center justify-center rounded-lg bg-foreground px-6 text-sm font-semibold text-background transition hover:bg-foreground/90 active:scale-[0.98]"
          >
            Salvar plano
          </button>
        </div>
      </div>
    </AppLayout>
  );
}
