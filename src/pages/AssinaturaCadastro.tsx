import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { TextField, Dropdown } from "@/components/FormModal";
import { useToast } from "@/hooks/use-toast";
import { Plus, X, CalendarDays, Users, Sparkles, Trash2, Scissors, Package, Settings2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";

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

const tabs = [
  { id: "detalhes", label: "Detalhes" },
  { id: "servicos", label: "Serviços" },
  { id: "produtos", label: "Produtos" },
];

function CurrencyInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
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

function SectionCard({
  icon,
  title,
  description,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-muted/30 text-foreground">
          {icon}
        </div>
        <div>
          <h2 className="text-sm font-semibold text-foreground">{title}</h2>
          {description ? <p className="mt-1 text-xs text-muted-foreground">{description}</p> : null}
        </div>
      </div>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="px-4 py-14 text-center">
      <p className="text-sm font-medium text-foreground">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

export default function AssinaturaCadastro() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  const editing = searchParams.get("nome");

  const [activeTab, setActiveTab] = useState("detalhes");

  // Detalhes
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

  // Serviços
  const [servicoSelecionado, setServicoSelecionado] = useState<string>("");
  const [descontoServico, setDescontoServico] = useState("100");
  const [usosServico, setUsosServico] = useState("ILIMITADO");
  const [comissaoServico, setComissaoServico] = useState("TEMPO");
  const [servicosInclusos, setServicosInclusos] = useState<ServicoIncluso[]>([
    { id: 1, desconto: "100", usos: "ILIMITADO", comissao: "TEMPO" },
    { id: 5, desconto: "100", usos: "ILIMITADO", comissao: "TEMPO" },
  ]);

  // Produtos
  const [produtoSelecionado, setProdutoSelecionado] = useState<string>("");
  const [descontoProdutoForm, setDescontoProdutoForm] = useState("10");
  const [produtosSelecionados, setProdutosSelecionados] = useState<{ id: number; desconto: string }[]>([]);

  // Disponibilidade
  const [diasAceitos, setDiasAceitos] = useState<string[]>(["seg", "ter", "qua", "qui", "sex"]);
  const [profissionaisAtendem, setProfissionaisAtendem] = useState<number[]>([1, 2, 3, 4]);

  const [showErrors, setShowErrors] = useState(false);

  const errors = {
    nome: !nome.trim() ? "Informe o nome do plano" : "",
  };

  const showError = (k: keyof typeof errors) => (showErrors ? errors[k] : "");

  const servicosDisponiveisFiltrados = useMemo(
    () => servicosDisponiveis.filter((s) => !servicosInclusos.some((i) => i.id === s.id)),
    [servicosInclusos],
  );

  const produtosDisponiveisFiltrados = useMemo(
    () => produtosDisponiveis.filter((p) => !produtosSelecionados.some((i) => i.id === p.id)),
    [produtosSelecionados],
  );

  const resumo = useMemo(() => {
    const recorrenciaLabel = recorrenciaOptions.find((o) => o.value === recorrencia)?.label || recorrencia;

    return {
      recorrenciaLabel,
      totalServicos: servicosInclusos.length,
      totalProdutos: produtosSelecionados.length,
      totalBeneficios: beneficios.length,
    };
  }, [recorrencia, servicosInclusos.length, produtosSelecionados.length, beneficios.length]);

  const tabCounts = {
    servicos: servicosInclusos.length,
    produtos: produtosSelecionados.length,
  };

  const adicionarServico = () => {
    if (!servicoSelecionado) return;
    const id = Number(servicoSelecionado);

    setServicosInclusos((prev) => [
      ...prev,
      { id, desconto: descontoServico || "0", usos: usosServico, comissao: comissaoServico },
    ]);

    setServicoSelecionado("");
    setDescontoServico("100");
    setUsosServico("ILIMITADO");
    setComissaoServico("TEMPO");
  };

  const removerServico = (id: number) => setServicosInclusos((prev) => prev.filter((s) => s.id !== id));

  const adicionarProduto = () => {
    if (!produtoSelecionado) return;
    const id = Number(produtoSelecionado);

    setProdutosSelecionados((prev) => [...prev, { id, desconto: descontoProdutoForm || "0" }]);
    setProdutoSelecionado("");
    setDescontoProdutoForm("10");
  };

  const removerProduto = (id: number) => setProdutosSelecionados((prev) => prev.filter((p) => p.id !== id));

  const toggleDia = (key: string) =>
    setDiasAceitos((prev) => (prev.includes(key) ? prev.filter((d) => d !== key) : [...prev, key]));

  const toggleProfissional = (id: number) =>
    setProfissionaisAtendem((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]));

  const adicionarBeneficio = () => {
    const t = novoBeneficio.trim();
    if (!t) return;
    setBeneficios((prev) => [...prev, t]);
    setNovoBeneficio("");
  };

  const removerBeneficio = (idx: number) => setBeneficios((prev) => prev.filter((_, i) => i !== idx));

  const handleSalvar = () => {
    setShowErrors(true);

    if (errors.nome) {
      setActiveTab("detalhes");
      toast({ title: "Verifique os campos obrigatórios", variant: "destructive" });
      return;
    }

    toast({ title: editing ? "Plano atualizado" : "Plano criado com sucesso" });
    navigate("/assinantePesquisa");
  };

  const nomeServico = (id: number) => servicosDisponiveis.find((s) => s.id === id)?.nome || "";

  const nomeProduto = (id: number) => produtosDisponiveis.find((p) => p.id === id)?.nome || "";

  const labelUsos = (v: string) => usosOptions.find((o) => o.value === v)?.label || v;
  const labelComissao = (v: string) => comissaoOptions.find((o) => o.value === v)?.label || v;

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
                Configure os dados, serviços, produtos e disponibilidade do plano.
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-full border border-border bg-card px-2.5 py-1 text-xs font-medium text-foreground">
                  R$ {valor} / {resumo.recorrenciaLabel}
                </span>
                <span className="rounded-full border border-border bg-card px-2.5 py-1 text-xs font-medium text-foreground">
                  {resumo.totalServicos} serviço(s)
                </span>
                <span className="rounded-full border border-border bg-card px-2.5 py-1 text-xs font-medium text-foreground">
                  {resumo.totalProdutos} produto(s)
                </span>
                <span className="rounded-full border border-border bg-card px-2.5 py-1 text-xs font-medium text-foreground">
                  {resumo.totalBeneficios} benefício(s)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* TABS */}
        <div className="mx-6 mt-4 border-b border-border">
          <div className="flex gap-6">
            {tabs.map((tab) => {
              const count = tab.id === "servicos" ? tabCounts.servicos : tab.id === "produtos" ? tabCounts.produtos : 0;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "relative flex items-center gap-2 pb-2.5 text-sm font-medium transition-colors",
                    activeTab === tab.id
                      ? "text-foreground after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:rounded-full after:bg-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {tab.label}
                  {count > 0 && (
                    <span
                      className={cn(
                        "inline-flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[11px] font-semibold",
                        activeTab === tab.id ? "bg-foreground text-background" : "bg-muted text-foreground",
                      )}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* CONTENT */}
        <div className="mx-6 mt-5 pb-24">
          {/* DETALHES */}
          {activeTab === "detalhes" && (
            <div className="grid max-w-4xl gap-4">
              <SectionCard
                icon={<Settings2 className="h-4 w-4" />}
                title="Identificação e cobrança"
                description="Defina os dados principais do plano."
              >
                <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_180px_180px]">
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

                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <Dropdown
                    label="Forma de pagamento"
                    value={formaPagamento}
                    setValue={setFormaPagamento}
                    options={formaPagamentoOptions}
                  />
                </div>
              </SectionCard>

              <SectionCard
                icon={<CalendarDays className="h-4 w-4" />}
                title="Disponibilidade do plano"
                description="Defina onde e com quem esse plano pode ser utilizado."
              >
                <div className="grid gap-5">
                  <div className="flex items-end">
                    <div className="flex w-full items-center justify-between rounded-lg border border-border bg-muted/30 px-3 py-2.5">
                      <div>
                        <p className="text-sm font-semibold text-foreground">Disponível para venda</p>
                        <p className="text-xs text-muted-foreground">Ative ou desative na vitrine</p>
                      </div>
                      <Switch checked={disponivelVenda} onCheckedChange={setDisponivelVenda} />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-foreground">Dias em que o plano é aceito</span>
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
                                : "border-border bg-card text-muted-foreground hover:border-foreground/40",
                            )}
                          >
                            {d.label}
                          </button>
                        );
                      })}
                    </div>

                    <p className="text-xs text-muted-foreground">Clique para alternar. Verde = aceito.</p>
                  </div>

                  <div className="grid gap-2">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-foreground">Profissionais que atendem</span>
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
                                : "border-border bg-card text-muted-foreground hover:border-foreground/40",
                            )}
                          >
                            <span
                              className={cn(
                                "flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold",
                                ativo
                                  ? "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300"
                                  : "bg-muted text-muted-foreground",
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
              </SectionCard>

              <SectionCard
                icon={<Sparkles className="h-4 w-4" />}
                title="Benefícios do plano"
                description="Liste vantagens que ajudam a vender esse plano."
              >
                <div className="grid gap-2">
                  <label className="text-sm font-medium text-foreground">Benefícios do plano</label>

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
              </SectionCard>
            </div>
          )}

          {/* SERVIÇOS */}
          {activeTab === "servicos" && (
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[330px_minmax(0,1fr)]">
              <div className="space-y-4 self-start">
                <div>
                  <h2 className="text-sm font-semibold text-foreground">Configurar serviço</h2>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Selecione o serviço e defina suas regras dentro do plano.
                  </p>
                </div>

                <Dropdown
                  label="Serviço"
                  value={servicoSelecionado}
                  setValue={setServicoSelecionado}
                  options={servicosDisponiveisFiltrados.map((s) => ({
                    value: String(s.id),
                    label: s.nome,
                  }))}
                />

                <div className="grid gap-1.5">
                  <label className="text-sm font-medium text-foreground">Desconto (%)</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={descontoServico}
                    onChange={(e) => setDescontoServico(e.target.value.replace(/\D/g, ""))}
                    placeholder="100"
                    className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <Dropdown label="Usos / mês" value={usosServico} setValue={setUsosServico} options={usosOptions} />

                <Dropdown
                  label="Comissionamento"
                  value={comissaoServico}
                  setValue={setComissaoServico}
                  options={comissaoOptions}
                />

                <div className="flex items-end gap-3 pt-1">
                  <button
                    type="button"
                    onClick={adicionarServico}
                    className="h-10 rounded-lg bg-foreground px-4 text-sm font-semibold text-background"
                  >
                    Adicionar serviço
                  </button>
                </div>
              </div>

              <div className="space-y-4 self-start">
                <div>
                  <h2 className="text-sm font-semibold text-foreground">Serviços incluídos no plano</h2>
                  <p className="mt-1 text-xs text-muted-foreground">Confira os serviços já configurados.</p>
                </div>

                <div className="overflow-hidden rounded-lg border border-border bg-card">
                  <table className="w-full border-collapse">
                    <thead className="bg-muted/40">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Serviço</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">Desconto</th>
                        <th className="px-4 py-3 text-center text-sm font-semibold text-foreground">Usos</th>
                        <th className="px-4 py-3 text-center text-sm font-semibold text-foreground">Comissão</th>
                        <th className="w-14 px-2 py-3" />
                      </tr>
                    </thead>
                    <tbody>
                      {servicosInclusos.length === 0 ? (
                        <tr>
                          <td colSpan={5}>
                            <EmptyState
                              title="Nenhum serviço adicionado"
                              description="Selecione um serviço ao lado para incluir neste plano."
                            />
                          </td>
                        </tr>
                      ) : (
                        servicosInclusos.map((s) => (
                          <tr key={s.id} className="border-t border-border bg-card">
                            <td className="px-4 py-3 text-sm text-foreground">{nomeServico(s.id)}</td>
                            <td className="px-4 py-3 text-right text-sm font-medium text-emerald-600">{s.desconto}%</td>
                            <td className="px-4 py-3 text-center text-sm text-foreground">{labelUsos(s.usos)}</td>
                            <td className="px-4 py-3 text-center text-sm text-foreground">
                              {labelComissao(s.comissao)}
                            </td>
                            <td className="px-2 py-3 text-center">
                              <button
                                type="button"
                                onClick={() => removerServico(s.id)}
                                className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-destructive transition hover:bg-destructive/10"
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
              </div>
            </div>
          )}

          {/* PRODUTOS */}
          {activeTab === "produtos" && (
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[330px_minmax(0,1fr)]">
              <div className="space-y-4 self-start">
                <div>
                  <h2 className="text-sm font-semibold text-foreground">Configurar produto</h2>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Selecione o produto e defina o desconto aplicado.
                  </p>
                </div>

                <Dropdown
                  label="Produto"
                  value={produtoSelecionado}
                  setValue={setProdutoSelecionado}
                  options={produtosDisponiveisFiltrados.map((p) => ({
                    value: String(p.id),
                    label: p.nome,
                  }))}
                />

                <div className="grid gap-1.5">
                  <label className="text-sm font-medium text-foreground">Desconto (%)</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={descontoProdutoForm}
                    onChange={(e) => setDescontoProdutoForm(e.target.value.replace(/\D/g, ""))}
                    placeholder="10"
                    className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div className="flex items-end gap-3 pt-1">
                  <button
                    type="button"
                    onClick={adicionarProduto}
                    className="h-10 rounded-lg bg-foreground px-4 text-sm font-semibold text-background"
                  >
                    Adicionar produto
                  </button>
                </div>
              </div>

              <div className="space-y-4 self-start">
                <div>
                  <h2 className="text-sm font-semibold text-foreground">Produtos incluídos no plano</h2>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Confira os produtos com desconto já configurados.
                  </p>
                </div>

                <div className="overflow-hidden rounded-lg border border-border bg-card">
                  <table className="w-full border-collapse">
                    <thead className="bg-muted/40">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Produto</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">Desconto</th>
                        <th className="w-14 px-2 py-3" />
                      </tr>
                    </thead>
                    <tbody>
                      {produtosSelecionados.length === 0 ? (
                        <tr>
                          <td colSpan={3}>
                            <EmptyState
                              title="Nenhum produto adicionado"
                              description="Selecione um produto ao lado para aplicar desconto neste plano."
                            />
                          </td>
                        </tr>
                      ) : (
                        produtosSelecionados.map((p) => (
                          <tr key={p.id} className="border-t border-border bg-card">
                            <td className="px-4 py-3 text-sm text-foreground">{nomeProduto(p.id)}</td>
                            <td className="px-4 py-3 text-right text-sm font-medium text-emerald-600">{p.desconto}%</td>
                            <td className="px-2 py-3 text-center">
                              <button
                                type="button"
                                onClick={() => removerProduto(p.id)}
                                className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-destructive transition hover:bg-destructive/10"
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
              </div>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="sticky bottom-0 border-t border-border bg-card px-6 py-4">
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={handleSalvar}
              className="inline-flex h-11 items-center justify-center rounded-lg bg-foreground px-6 text-sm font-semibold text-background"
            >
              Salvar
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
