import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { TextField, Dropdown } from "@/components/FormModal";
import { useToast } from "@/hooks/use-toast";
import { Crown, Star, Check, Search, X, GripVertical, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { initialPlanos, PlanoAssinatura, ServicoPlano, ProdutoPlano } from "./AssinaturaCadastro";

// ─── Mock catalogues ──────────────────────────────────────────────────────────

const SERVICOS = [
  { id: 1, nome: "Barba + Sobrancelha", preco: 50 },
  { id: 2, nome: "Barba Pacote", preco: 80 },
  { id: 3, nome: "Barba!", preco: 35 },
  { id: 4, nome: "Bigode", preco: 20 },
  { id: 5, nome: "Coloração Aplicação", preco: 90 },
  { id: 6, nome: "Corte Feminino", preco: 60 },
  { id: 7, nome: "Corte Masculino", preco: 45 },
  { id: 8, nome: "Hidratação capilar", preco: 50 },
  { id: 9, nome: "Sobrancelha", preco: 20 },
  { id: 10, nome: "Progressiva", preco: 120 },
];

const PRODUTOS = [
  { id: 1, nome: "Balm para barba" },
  { id: 2, nome: "Botox capilar" },
  { id: 3, nome: "Pomada modeladora" },
  { id: 4, nome: "Óleo para barba" },
  { id: 5, nome: "Shampoo anticaspa" },
  { id: 6, nome: "Cera de cabelo" },
];

const PROFISSIONAIS = [
  { id: 1, nome: "Cesar", iniciais: "CE" },
  { id: 2, nome: "Claudia", iniciais: "CL" },
  { id: 3, nome: "Marcia Silva", iniciais: "MS" },
  { id: 4, nome: "Matheus", iniciais: "MA" },
  { id: 5, nome: "Vini", iniciais: "VI" },
];

const DAYS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
const USOS_OPTS = ["Ilimitado", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];

const recorrenciaOptions = [
  { value: "Mensal", label: "Mensal" },
  { value: "Trimestral", label: "Trimestral" },
  { value: "Semestral", label: "Semestral" },
  { value: "Anual", label: "Anual" },
];

const pagamentoOptions = [
  { value: "Cartão de Crédito", label: "Cartão de Crédito" },
  { value: "PIX", label: "PIX" },
  { value: "Boleto", label: "Boleto" },
  { value: "Múltiplos", label: "Múltiplos" },
];

const statusOptions = [
  { value: "Ativo", label: "Ativo — visível na vitrine" },
  { value: "Rascunho", label: "Rascunho — não visível" },
  { value: "Arquivado", label: "Arquivado — desativado" },
];

const carenciaOptions = [
  { value: "Sem carência", label: "Sem carência" },
  { value: "7 dias", label: "7 dias" },
  { value: "15 dias", label: "15 dias" },
  { value: "30 dias", label: "30 dias" },
];

function emptyPlano(): PlanoAssinatura {
  return {
    id: 0,
    nome: "",
    valor: 0,
    recorrencia: "Mensal",
    formaPagamento: "Cartão de Crédito",
    status: "Rascunho",
    destaque: false,
    desativarEm: "",
    beneficios: [],
    servicos: [],
    produtos: [],
    diasDisponiveis: [],
    profissionaisIds: [],
    cancelamentoCarencia: "Sem carência",
    cancelamentoPausa: false,
  };
}

// ─── Reusable section block (matches ProfissionalPerfil) ──────────────────────

function SectionBlock({
  title,
  description,
  children,
  className = "",
  action,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className={cn("rounded-xl border border-border bg-card p-4", className)}>
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-foreground">{title}</h2>
          {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

function statusBadgeClasses(status: PlanoAssinatura["status"]) {
  const styles: Record<PlanoAssinatura["status"], string> = {
    Ativo: "bg-green-100 text-green-800",
    Rascunho: "bg-yellow-100 text-yellow-800",
    Arquivado: "bg-gray-100 text-gray-600",
  };
  return styles[status];
}

// ─── Main page ────────────────────────────────────────────────────────────────

const tabs = [
  { id: "detalhes", label: "1. Detalhes" },
  { id: "diferenciais", label: "2. Diferenciais" },
  { id: "servicos", label: "3. Serviços" },
  { id: "produtos", label: "4. Produtos" },
  { id: "disponibilidade", label: "5. Disponibilidade" },
  { id: "cancelamento", label: "6. Cancelamento" },
];

export default function PlanoPerfil() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  const editId = searchParams.get("id") ? Number(searchParams.get("id")) : null;
  const existing = editId ? initialPlanos.find((p) => p.id === editId) : null;
  const isEdit = !!existing;

  const [form, setForm] = useState<PlanoAssinatura>(existing ? { ...existing } : emptyPlano());
  const [activeTab, setActiveTab] = useState("detalhes");

  const [svcSearch, setSvcSearch] = useState("");
  const [svcOnlySel, setSvcOnlySel] = useState(false);
  const [prodSearch, setProdSearch] = useState("");
  const [prodOnlySel, setProdOnlySel] = useState(false);

  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [newBeneficio, setNewBeneficio] = useState("");

  const update = <K extends keyof PlanoAssinatura>(field: K, value: PlanoAssinatura[K]) => {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      const isEmpty =
        value === "" ||
        value === false ||
        value === 0 ||
        (Array.isArray(value) && value.length === 0);
      if (!isEmpty) toast({ title: "Alteração salva automaticamente" });
      return next;
    });
  };

  const setSilent = (patch: Partial<PlanoAssinatura>) => setForm((prev) => ({ ...prev, ...patch }));

  const valorServicos = useMemo(
    () =>
      form.servicos.reduce((acc, sp) => {
        const s = SERVICOS.find((x) => x.id === sp.servicoId);
        return acc + (s ? s.preco * (sp.desconto / 100) : 0);
      }, 0),
    [form.servicos],
  );

  const svcsVisiveis = SERVICOS.filter((s) => {
    const q = s.nome.toLowerCase().includes(svcSearch.toLowerCase());
    const sel = !svcOnlySel || form.servicos.some((sp) => sp.servicoId === s.id);
    return q && sel;
  });

  const prodsVisiveis = PRODUTOS.filter((p) => {
    const q = p.nome.toLowerCase().includes(prodSearch.toLowerCase());
    const sel = !prodOnlySel || form.produtos.some((pp) => pp.produtoId === p.id);
    return q && sel;
  });

  const allSvcsSel =
    svcsVisiveis.length > 0 && svcsVisiveis.every((s) => form.servicos.some((sp) => sp.servicoId === s.id));

  // ── Servicos ──
  const toggleServico = (id: number) => {
    const exists = form.servicos.find((sp) => sp.servicoId === id);
    if (exists) {
      setSilent({ servicos: form.servicos.filter((sp) => sp.servicoId !== id) });
    } else {
      update("servicos", [...form.servicos, { servicoId: id, desconto: 100, usosPorMes: "Ilimitado" }]);
    }
  };
  const updateServico = (id: number, patch: Partial<ServicoPlano>) =>
    setSilent({
      servicos: form.servicos.map((sp) => (sp.servicoId === id ? { ...sp, ...patch } : sp)),
    });
  const selectAllSvcs = () => {
    if (allSvcsSel) {
      setSilent({ servicos: form.servicos.filter((sp) => !svcsVisiveis.some((s) => s.id === sp.servicoId)) });
    } else {
      const toAdd = svcsVisiveis
        .filter((s) => !form.servicos.some((sp) => sp.servicoId === s.id))
        .map((s) => ({ servicoId: s.id, desconto: 100, usosPorMes: "Ilimitado" }));
      update("servicos", [...form.servicos, ...toAdd]);
    }
  };

  // ── Produtos ──
  const toggleProduto = (id: number) => {
    const exists = form.produtos.find((pp) => pp.produtoId === id);
    if (exists) {
      setSilent({ produtos: form.produtos.filter((pp) => pp.produtoId !== id) });
    } else {
      update("produtos", [...form.produtos, { produtoId: id, desconto: 20, limiteDescontoMes: null }]);
    }
  };
  const updateProduto = (id: number, patch: Partial<ProdutoPlano>) =>
    setSilent({
      produtos: form.produtos.map((pp) => (pp.produtoId === id ? { ...pp, ...patch } : pp)),
    });

  // ── Dias / profissionais ──
  const toggleDia = (i: number) => {
    const dias = form.diasDisponiveis.includes(i)
      ? form.diasDisponiveis.filter((d) => d !== i)
      : [...form.diasDisponiveis, i];
    update("diasDisponiveis", dias);
  };

  const toggleProf = (id: number) => {
    const ids = form.profissionaisIds.includes(id)
      ? form.profissionaisIds.filter((p) => p !== id)
      : [...form.profissionaisIds, id];
    update("profissionaisIds", ids);
  };

  // ── Benefícios ──
  const addBeneficio = () => {
    if (!newBeneficio.trim()) return;
    update("beneficios", [...form.beneficios, newBeneficio.trim()]);
    setNewBeneficio("");
  };
  const removeBeneficio = (i: number) =>
    update("beneficios", form.beneficios.filter((_, idx) => idx !== i));
  const onDrop = (toIdx: number) => {
    if (dragIdx === null || dragIdx === toIdx) return;
    const arr = [...form.beneficios];
    const [moved] = arr.splice(dragIdx, 1);
    arr.splice(toIdx, 0, moved);
    update("beneficios", arr);
    setDragIdx(null);
  };

  // ── Render ──
  return (
    <AppLayout>
      <div className="flex flex-col gap-0">
        {/* Header */}
        <div className="mx-6 mt-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-5">
              <div className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border-2 border-border bg-muted shadow-sm">
                <Crown className="h-8 w-8 text-muted-foreground" />
                {form.destaque && (
                  <div className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-yellow-400 shadow">
                    <Star className="h-3.5 w-3.5 fill-white text-white" />
                  </div>
                )}
              </div>
              <div className="pt-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-foreground">
                    {form.nome || (isEdit ? "Editar plano" : "Novo plano")}
                  </h1>
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium",
                      statusBadgeClasses(form.status),
                    )}
                  >
                    {form.status}
                  </span>
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-0.5 text-sm text-muted-foreground">
                  <span>
                    R$ {Number(form.valor || 0).toFixed(2).replace(".", ",")} / {form.recorrencia}
                  </span>
                  <span>
                    {form.servicos.length} serviço{form.servicos.length !== 1 ? "s" : ""}
                  </span>
                  {form.produtos.length > 0 && (
                    <span>
                      {form.produtos.length} produto{form.produtos.length !== 1 ? "s" : ""}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs (etapas) */}
        <div className="mx-6 mt-4 border-b border-border overflow-x-auto">
          <div className="flex gap-6 min-w-max">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "relative pb-2.5 text-sm font-medium transition-colors whitespace-nowrap",
                  activeTab === tab.id
                    ? "text-foreground after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:rounded-full after:bg-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mx-6 mt-5 pb-10">
          {/* ───── 1. Detalhes ───── */}
          {activeTab === "detalhes" && (
            <div className="grid max-w-6xl gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
              <div className="grid gap-5">
                <SectionBlock title="Detalhes do plano" description="Identificação e cobrança principal.">
                  <div className="grid gap-4">
                    <div className="max-w-xl">
                      <TextField label="Nome do plano *" value={form.nome} onChange={(v) => update("nome", v)} placeholder="Ex: Clube Premium" />
                    </div>
                    <div className="grid gap-4 md:grid-cols-3">
                      <TextField
                        label="Valor (R$)"
                        type="number"
                        value={form.valor ? String(form.valor) : ""}
                        onChange={(v) => update("valor", parseFloat(v) || 0)}
                      />
                      <Dropdown
                        label="Recorrência"
                        value={form.recorrencia}
                        setValue={(v) => update("recorrencia", v)}
                        options={recorrenciaOptions}
                      />
                      <Dropdown
                        label="Forma de pagamento"
                        value={form.formaPagamento}
                        setValue={(v) => update("formaPagamento", v)}
                        options={pagamentoOptions}
                      />
                    </div>
                  </div>
                </SectionBlock>

                <SectionBlock title="Status e visibilidade" description="Controle quando o plano fica disponível.">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Dropdown
                      label="Status"
                      value={form.status}
                      setValue={(v) => update("status", v as PlanoAssinatura["status"])}
                      options={statusOptions}
                    />
                    {form.status === "Ativo" && (
                      <TextField
                        label="Desativar automaticamente em"
                        type="date"
                        value={form.desativarEm}
                        onChange={(v) => update("desativarEm", v)}
                      />
                    )}
                  </div>
                </SectionBlock>
              </div>

              <div className="grid gap-5 self-start">
                <SectionBlock title="Destaque" description="Faça este plano aparecer primeiro na vitrine.">
                  <label className="flex cursor-pointer select-none items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold text-foreground">Plano destaque</div>
                      <div className="text-xs text-muted-foreground">Aparece com selo ★ na vitrine</div>
                    </div>
                    <Switch checked={form.destaque} onCheckedChange={(v) => update("destaque", v)} />
                  </label>
                </SectionBlock>

                {valorServicos > 0 && (
                  <SectionBlock title="Resumo de valor" description="Cálculo automático com base nos serviços inclusos.">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Valor incluso:</span>
                        <span className="font-semibold text-foreground">R$ {valorServicos.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Cobrado:</span>
                        <span className="font-semibold text-foreground">R$ {Number(form.valor || 0).toFixed(2)}</span>
                      </div>
                      {form.valor > 0 && valorServicos > form.valor && (
                        <div className="flex justify-between border-t border-border pt-2">
                          <span className="text-muted-foreground">Cliente economiza:</span>
                          <span className="font-semibold text-green-700">
                            R$ {(valorServicos - form.valor).toFixed(2)}/mês
                          </span>
                        </div>
                      )}
                    </div>
                  </SectionBlock>
                )}
              </div>
            </div>
          )}

          {/* ───── 2. Diferenciais ───── */}
          {activeTab === "diferenciais" && (
            <div className="grid max-w-3xl gap-5">
              <SectionBlock
                title="Diferenciais do plano"
                description="O que torna este plano atrativo? Esses itens aparecem na vitrine do cliente. Arraste para reordenar."
              >
                {form.beneficios.length > 0 && (
                  <div className="mb-3 space-y-1.5">
                    {form.beneficios.map((b, i) => (
                      <div
                        key={i}
                        draggable
                        onDragStart={() => setDragIdx(i)}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={() => onDrop(i)}
                        className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 transition-colors hover:border-foreground/30 cursor-grab active:opacity-50"
                      >
                        <GripVertical className="h-4 w-4 text-muted-foreground" />
                        <span className="flex-1 text-sm font-medium text-foreground">{b}</span>
                        <button
                          onClick={() => removeBeneficio(i)}
                          className="text-muted-foreground transition-colors hover:text-destructive"
                          aria-label="Remover"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex gap-2">
                  <input
                    className="h-10 flex-1 rounded-lg border border-border bg-card px-3 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-all focus:border-foreground focus:ring-4 focus:ring-muted"
                    placeholder="Ex: Prioridade no agendamento"
                    value={newBeneficio}
                    onChange={(e) => setNewBeneficio(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addBeneficio()}
                  />
                  <button
                    onClick={addBeneficio}
                    className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-foreground px-4 text-sm font-semibold text-background transition hover:bg-foreground/90 active:scale-[0.98]"
                  >
                    <Plus className="h-4 w-4" />
                    Adicionar
                  </button>
                </div>
              </SectionBlock>
            </div>
          )}

          {/* ───── 3. Serviços ───── */}
          {activeTab === "servicos" && (
            <div className="grid max-w-5xl gap-5">
              <SectionBlock
                title="Serviços inclusos *"
                description="Selecione os serviços que farão parte do plano e configure desconto e quantidade de usos por mês."
                action={
                  form.servicos.length > 0 ? (
                    <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                      {form.servicos.length} selecionado{form.servicos.length !== 1 ? "s" : ""}
                    </span>
                  ) : null
                }
              >
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <div className="relative min-w-[220px] flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      value={svcSearch}
                      onChange={(e) => setSvcSearch(e.target.value)}
                      placeholder="Buscar serviço..."
                      className="h-10 w-full rounded-lg border border-border bg-card pl-9 pr-3 text-sm text-foreground outline-none focus:border-foreground focus:ring-4 focus:ring-muted"
                    />
                  </div>
                  {form.servicos.length > 0 && (
                    <button
                      onClick={() => setSvcOnlySel(!svcOnlySel)}
                      className={cn(
                        "inline-flex h-10 items-center gap-1.5 rounded-lg border px-3 text-sm font-medium transition",
                        svcOnlySel
                          ? "border-foreground bg-foreground text-background"
                          : "border-border bg-card text-foreground hover:border-foreground/40",
                      )}
                    >
                      <Check className="h-4 w-4" />
                      Selecionados
                    </button>
                  )}
                  <button
                    onClick={selectAllSvcs}
                    className="inline-flex h-10 items-center rounded-lg border border-border bg-card px-3 text-sm font-medium text-muted-foreground transition hover:border-foreground/40 hover:text-foreground"
                  >
                    {allSvcsSel ? "Desmarcar todos" : "Selecionar todos"}
                  </button>
                </div>

                <div className="max-h-[380px] space-y-1.5 overflow-y-auto pr-1">
                  {svcsVisiveis.map((s) => {
                    const sp = form.servicos.find((x) => x.servicoId === s.id);
                    const sel = !!sp;
                    return (
                      <div
                        key={s.id}
                        onClick={() => toggleServico(s.id)}
                        className={cn(
                          "flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2.5 transition-all",
                          sel ? "border-foreground bg-muted/40" : "border-border bg-background hover:border-foreground/30",
                        )}
                      >
                        <Checkbox
                          checked={sel}
                          onCheckedChange={() => toggleServico(s.id)}
                          onClick={(e) => e.stopPropagation()}
                          className="h-4 w-4 rounded-md border border-zinc-400 bg-background data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 data-[state=checked]:text-white"
                        />
                        <span className="flex-1 text-sm font-medium text-foreground">{s.nome}</span>
                        {sel && sp ? (
                          <div className="flex items-end gap-3 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                            <div className="flex flex-col gap-0.5">
                              <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Desconto</span>
                              <div className="flex items-center gap-1">
                                <input
                                  type="number"
                                  min={0}
                                  max={100}
                                  value={sp.desconto}
                                  onChange={(e) => updateServico(s.id, { desconto: Number(e.target.value) })}
                                  className="h-8 w-14 rounded-md border border-border bg-card px-2 text-center text-sm text-foreground outline-none focus:border-foreground"
                                />
                                <span className="text-xs text-muted-foreground">%</span>
                              </div>
                            </div>
                            <div className="mb-1 h-8 w-px self-end bg-border" />
                            <div className="flex flex-col gap-0.5">
                              <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Usos/mês</span>
                              <select
                                value={sp.usosPorMes}
                                onChange={(e) => updateServico(s.id, { usosPorMes: e.target.value })}
                                className="h-8 cursor-pointer rounded-md border border-border bg-card px-2 text-sm text-foreground outline-none focus:border-foreground"
                              >
                                {USOS_OPTS.map((o) => (
                                  <option key={o}>{o}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                        ) : (
                          <span className="flex-shrink-0 text-xs text-muted-foreground">R$ {s.preco}</span>
                        )}
                      </div>
                    );
                  })}
                  {svcsVisiveis.length === 0 && (
                    <p className="py-6 text-center text-sm text-muted-foreground">Nenhum serviço encontrado</p>
                  )}
                </div>
              </SectionBlock>
            </div>
          )}

          {/* ───── 4. Produtos ───── */}
          {activeTab === "produtos" && (
            <div className="grid max-w-5xl gap-5">
              <SectionBlock
                title="Desconto em produtos"
                description="Configure descontos opcionais que assinantes deste plano terão em produtos."
                action={
                  form.produtos.length > 0 ? (
                    <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                      {form.produtos.length} selecionado{form.produtos.length !== 1 ? "s" : ""}
                    </span>
                  ) : null
                }
              >
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <div className="relative min-w-[220px] flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      value={prodSearch}
                      onChange={(e) => setProdSearch(e.target.value)}
                      placeholder="Buscar produto..."
                      className="h-10 w-full rounded-lg border border-border bg-card pl-9 pr-3 text-sm text-foreground outline-none focus:border-foreground focus:ring-4 focus:ring-muted"
                    />
                  </div>
                  {form.produtos.length > 0 && (
                    <button
                      onClick={() => setProdOnlySel(!prodOnlySel)}
                      className={cn(
                        "inline-flex h-10 items-center gap-1.5 rounded-lg border px-3 text-sm font-medium transition",
                        prodOnlySel
                          ? "border-foreground bg-foreground text-background"
                          : "border-border bg-card text-foreground hover:border-foreground/40",
                      )}
                    >
                      <Check className="h-4 w-4" />
                      Selecionados
                    </button>
                  )}
                </div>

                <div className="max-h-[380px] space-y-1.5 overflow-y-auto pr-1">
                  {prodsVisiveis.map((p) => {
                    const pp = form.produtos.find((x) => x.produtoId === p.id);
                    const sel = !!pp;
                    return (
                      <div
                        key={p.id}
                        onClick={() => toggleProduto(p.id)}
                        className={cn(
                          "flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2.5 transition-all",
                          sel ? "border-foreground bg-muted/40" : "border-border bg-background hover:border-foreground/30",
                        )}
                      >
                        <Checkbox
                          checked={sel}
                          onCheckedChange={() => toggleProduto(p.id)}
                          onClick={(e) => e.stopPropagation()}
                          className="h-4 w-4 rounded-md border border-zinc-400 bg-background data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 data-[state=checked]:text-white"
                        />
                        <span className="flex-1 text-sm font-medium text-foreground">{p.nome}</span>
                        {sel && pp && (
                          <div className="flex items-end gap-3 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                            <div className="flex flex-col gap-0.5">
                              <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Desconto</span>
                              <div className="flex items-center gap-1">
                                <input
                                  type="number"
                                  min={0}
                                  max={100}
                                  value={pp.desconto}
                                  onChange={(e) => updateProduto(p.id, { desconto: Number(e.target.value) })}
                                  className="h-8 w-14 rounded-md border border-border bg-card px-2 text-center text-sm text-foreground outline-none focus:border-foreground"
                                />
                                <span className="text-xs text-muted-foreground">%</span>
                              </div>
                            </div>
                            <div className="mb-1 h-8 w-px self-end bg-border" />
                            <div className="flex flex-col gap-0.5">
                              <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Limite/mês</span>
                              <div className="flex items-center gap-1">
                                <span className="text-xs text-muted-foreground">R$</span>
                                <input
                                  type="number"
                                  min={0}
                                  value={pp.limiteDescontoMes ?? ""}
                                  placeholder="Sem limite"
                                  onChange={(e) =>
                                    updateProduto(p.id, {
                                      limiteDescontoMes: e.target.value ? Number(e.target.value) : null,
                                    })
                                  }
                                  className="h-8 w-20 rounded-md border border-border bg-card px-2 text-center text-sm text-foreground outline-none focus:border-foreground placeholder:text-muted-foreground/60"
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                  {prodsVisiveis.length === 0 && (
                    <p className="py-6 text-center text-sm text-muted-foreground">Nenhum produto encontrado</p>
                  )}
                </div>
              </SectionBlock>
            </div>
          )}

          {/* ───── 5. Disponibilidade ───── */}
          {activeTab === "disponibilidade" && (
            <div className="grid max-w-5xl gap-5">
              <SectionBlock
                title="Dias disponíveis"
                description="Em quais dias da semana os benefícios podem ser usados."
              >
                <div className="mb-3 flex flex-wrap gap-2">
                  {[
                    { label: "Todos os dias", dias: [] as number[] },
                    { label: "Dias úteis", dias: [0, 1, 2, 3, 4] },
                    { label: "Fins de semana", dias: [5, 6] },
                  ].map((opt) => {
                    const isActive =
                      JSON.stringify([...form.diasDisponiveis].sort()) === JSON.stringify([...opt.dias].sort());
                    return (
                      <button
                        key={opt.label}
                        onClick={() => update("diasDisponiveis", opt.dias)}
                        className={cn(
                          "rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
                          isActive
                            ? "border-foreground bg-foreground text-background"
                            : "border-border bg-card text-muted-foreground hover:border-foreground/40 hover:text-foreground",
                        )}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
                <div className="flex gap-2">
                  {DAYS.map((d, i) => {
                    const allDays = form.diasDisponiveis.length === 0;
                    const explicit = form.diasDisponiveis.includes(i);
                    return (
                      <button
                        key={i}
                        onClick={() => toggleDia(i)}
                        className={cn(
                          "flex-1 rounded-lg border-2 py-2 text-xs font-bold transition-all",
                          allDays
                            ? "border-border bg-muted/40 text-muted-foreground"
                            : explicit
                            ? "border-foreground bg-foreground text-background"
                            : "border-border bg-card text-muted-foreground hover:border-foreground/30",
                        )}
                      >
                        {d}
                      </button>
                    );
                  })}
                </div>
                <p className="mt-2 text-xs text-muted-foreground">Nenhum selecionado = aceito em todos os dias.</p>
              </SectionBlock>

              <SectionBlock
                title="Profissionais que atendem"
                description="Restrinja o plano a profissionais específicos."
              >
                <div className="flex flex-wrap gap-2">
                  {PROFISSIONAIS.map((p) => {
                    const sel = form.profissionaisIds.includes(p.id);
                    return (
                      <button
                        key={p.id}
                        onClick={() => toggleProf(p.id)}
                        className={cn(
                          "inline-flex items-center gap-2 rounded-lg border-2 px-3 py-1.5 text-sm font-semibold transition-all",
                          sel
                            ? "border-foreground bg-foreground text-background"
                            : "border-border bg-card text-foreground hover:border-foreground/40",
                        )}
                      >
                        <span
                          className={cn(
                            "flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-bold",
                            sel ? "bg-white/20 text-background" : "bg-muted text-muted-foreground",
                          )}
                        >
                          {p.iniciais}
                        </span>
                        {p.nome}
                      </button>
                    );
                  })}
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Nenhum selecionado = qualquer profissional pode atender.
                </p>
              </SectionBlock>
            </div>
          )}

          {/* ───── 6. Cancelamento ───── */}
          {activeTab === "cancelamento" && (
            <div className="grid max-w-3xl gap-5">
              <SectionBlock title="Regras de cancelamento" description="Defina como o cliente pode encerrar a assinatura.">
                <div className="grid gap-4 md:grid-cols-2">
                  <Dropdown
                    label="Carência para cancelar"
                    value={form.cancelamentoCarencia}
                    setValue={(v) => update("cancelamentoCarencia", v)}
                    options={carenciaOptions}
                  />
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  {form.cancelamentoCarencia === "Sem carência"
                    ? "O cliente pode cancelar a qualquer momento."
                    : `O cliente só pode cancelar após ${form.cancelamentoCarencia} do início da assinatura.`}
                </p>

                <div className="mt-5 border-t border-border pt-4">
                  <label className="flex cursor-pointer select-none items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold text-foreground">Permitir pausa</div>
                      <div className="text-xs text-muted-foreground">
                        Cliente pode pausar a assinatura temporariamente
                      </div>
                    </div>
                    <Switch
                      checked={form.cancelamentoPausa}
                      onCheckedChange={(v) => update("cancelamentoPausa", v)}
                    />
                  </label>
                </div>
              </SectionBlock>

              <div className="flex justify-end">
                <button
                  onClick={() => navigate("/planos")}
                  className="inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-card px-5 text-sm font-semibold text-foreground transition hover:bg-muted/40"
                >
                  Concluir e voltar para a lista
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
