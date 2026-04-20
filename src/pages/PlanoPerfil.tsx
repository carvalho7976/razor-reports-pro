import { useState, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { ChevronLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { initialPlanos, PlanoAssinatura, ServicoPlano, ProdutoPlano } from "./ListaPlanos";

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
const CARENCIA_OPTS = ["Sem carência", "7 dias", "15 dias", "30 dias"];

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

// ─── Small reusable pieces ────────────────────────────────────────────────────

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
      {children}
    </label>
  );
}

function Input({
  value, onChange, placeholder, type = "text", className = "",
}: {
  value: string | number;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  className?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={e => onChange(e.target.value)}
      className={`w-full px-3 py-2 text-[13px] rounded-md border border-border bg-background text-foreground placeholder:text-muted-foreground outline-none focus:border-foreground transition-colors ${className}`}
    />
  );
}

function Select({
  value, onChange, options, className = "",
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  className?: string;
}) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className={`w-full px-3 py-2 text-[13px] rounded-md border border-border bg-background text-foreground outline-none focus:border-foreground transition-colors ${className}`}
    >
      {options.map(o => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-[18px] w-8 rounded-full transition-colors flex-shrink-0 ${checked ? "bg-foreground" : "bg-border"}`}
    >
      <span className={`absolute top-[3px] h-3 w-3 rounded-full bg-white transition-all ${checked ? "left-[17px]" : "left-[3px]"}`} />
    </button>
  );
}

function SectionCard({ num, title, sub, children }: {
  num: number; title: string; sub?: string; children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2.5">
        <div className="w-5 h-5 rounded-full bg-foreground text-background text-[10px] font-bold flex items-center justify-center flex-shrink-0">
          {num}
        </div>
        <span className="text-[13px] font-semibold text-foreground">{title}</span>
        {sub && <span className="text-[12px] text-muted-foreground ml-auto">{sub}</span>}
      </div>
      <div className="rounded-lg border border-border bg-card p-4">
        {children}
      </div>
    </div>
  );
}

function Divider() {
  return <div className="border-t border-border my-3" />;
}

function SearchInput({ value, onChange, placeholder }: {
  value: string; onChange: (v: string) => void; placeholder: string;
}) {
  return (
    <div className="relative flex-1">
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 text-[13px] rounded-md border border-border bg-muted/40 text-foreground placeholder:text-muted-foreground outline-none focus:border-foreground focus:bg-background transition-colors"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-[16px] leading-none"
        >
          ×
        </button>
      )}
    </div>
  );
}

function CheckIcon() {
  return (
    <svg width="9" height="9" viewBox="0 0 12 12" fill="none">
      <path d="M2 6l2.5 2.5L10 3" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Checkbox({ checked }: { checked: boolean }) {
  return (
    <div className={`w-4 h-4 rounded-[3px] border-[1.5px] flex items-center justify-center flex-shrink-0 transition-all ${checked ? "bg-foreground border-foreground" : "border-border"}`}>
      {checked && <CheckIcon />}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function PlanoPerfil() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  // Load existing plan if editing
  const editId = searchParams.get("id") ? Number(searchParams.get("id")) : null;
  const existing = editId ? initialPlanos.find(p => p.id === editId) : null;
  const isEdit = !!existing;

  const [form, setForm] = useState<PlanoAssinatura>(existing ? { ...existing } : emptyPlano());
  const [showErrors, setShowErrors] = useState(false);

  // Search / filter state
  const [svcSearch, setSvcSearch] = useState("");
  const [svcOnlySel, setSvcOnlySel] = useState(false);
  const [prodSearch, setProdSearch] = useState("");
  const [prodOnlySel, setProdOnlySel] = useState(false);

  // Benefit drag
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [newBeneficio, setNewBeneficio] = useState("");

  const set = (patch: Partial<PlanoAssinatura>) => setForm(prev => ({ ...prev, ...patch }));

  // ── Derived ────────────────────────────────────────────────────────────────

  const errors = {
    nome: !form.nome.trim() ? "Informe o nome do plano." : "",
    servicos: !form.servicos.length ? "Selecione ao menos um serviço." : "",
  };

  const valorServicos = useMemo(() =>
    form.servicos.reduce((acc, sp) => {
      const s = SERVICOS.find(x => x.id === sp.servicoId);
      return acc + (s ? s.preco * (sp.desconto / 100) : 0);
    }, 0),
    [form.servicos]
  );

  const svcsVisiveis = SERVICOS.filter(s => {
    const q = s.nome.toLowerCase().includes(svcSearch.toLowerCase());
    const sel = !svcOnlySel || form.servicos.some(sp => sp.servicoId === s.id);
    return q && sel;
  });

  const prodsVisiveis = PRODUTOS.filter(p => {
    const q = p.nome.toLowerCase().includes(prodSearch.toLowerCase());
    const sel = !prodOnlySel || form.produtos.some(pp => pp.produtoId === p.id);
    return q && sel;
  });

  const svcSelCount = form.servicos.length;
  const prodSelCount = form.produtos.length;
  const allSvcsSel =
    svcsVisiveis.length > 0 &&
    svcsVisiveis.every(s => form.servicos.some(sp => sp.servicoId === s.id));

  // ── Handlers ───────────────────────────────────────────────────────────────

  const toggleServico = (id: number) => {
    const exists = form.servicos.find(sp => sp.servicoId === id);
    if (exists) {
      set({ servicos: form.servicos.filter(sp => sp.servicoId !== id) });
    } else {
      set({ servicos: [...form.servicos, { servicoId: id, desconto: 100, usosPorMes: "Ilimitado" }] });
    }
  };

  const updateServico = (id: number, patch: Partial<ServicoPlano>) =>
    set({ servicos: form.servicos.map(sp => sp.servicoId === id ? { ...sp, ...patch } : sp) });

  const selectAllSvcs = () => {
    const allSel = svcsVisiveis.every(s => form.servicos.some(sp => sp.servicoId === s.id));
    if (allSel) {
      set({ servicos: form.servicos.filter(sp => !svcsVisiveis.some(s => s.id === sp.servicoId)) });
    } else {
      const toAdd = svcsVisiveis
        .filter(s => !form.servicos.some(sp => sp.servicoId === s.id))
        .map(s => ({ servicoId: s.id, desconto: 100, usosPorMes: "Ilimitado" }));
      set({ servicos: [...form.servicos, ...toAdd] });
    }
  };

  const toggleProduto = (id: number) => {
    const exists = form.produtos.find(pp => pp.produtoId === id);
    if (exists) {
      set({ produtos: form.produtos.filter(pp => pp.produtoId !== id) });
    } else {
      set({ produtos: [...form.produtos, { produtoId: id, desconto: 20, limiteDescontoMes: null }] });
    }
  };

  const updateProduto = (id: number, patch: Partial<ProdutoPlano>) =>
    set({ produtos: form.produtos.map(pp => pp.produtoId === id ? { ...pp, ...patch } : pp) });

  const toggleDia = (i: number) => {
    const dias = form.diasDisponiveis.includes(i)
      ? form.diasDisponiveis.filter(d => d !== i)
      : [...form.diasDisponiveis, i];
    set({ diasDisponiveis: dias });
  };

  const toggleProf = (id: number) => {
    const ids = form.profissionaisIds.includes(id)
      ? form.profissionaisIds.filter(p => p !== id)
      : [...form.profissionaisIds, id];
    set({ profissionaisIds: ids });
  };

  const addBeneficio = () => {
    if (!newBeneficio.trim()) return;
    set({ beneficios: [...form.beneficios, newBeneficio.trim()] });
    setNewBeneficio("");
  };

  const removeBeneficio = (i: number) =>
    set({ beneficios: form.beneficios.filter((_, idx) => idx !== i) });

  const onDrop = (toIdx: number) => {
    if (dragIdx === null || dragIdx === toIdx) return;
    const arr = [...form.beneficios];
    const [moved] = arr.splice(dragIdx, 1);
    arr.splice(toIdx, 0, moved);
    set({ beneficios: arr });
    setDragIdx(null);
  };

  const handleSave = () => {
    setShowErrors(true);
    if (errors.nome || errors.servicos) return;
    toast({ title: isEdit ? "Plano atualizado" : "Plano criado com sucesso" });
    navigate("/planos");
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto px-4 py-6 pb-20 space-y-5">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/planos")}
              className="flex items-center gap-1 text-[13px] text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              Voltar
            </button>
            <h1 className="text-[22px] font-bold text-foreground tracking-tight">
              {isEdit ? "Editar Plano" : "Novo Plano"}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/planos")}
              className="px-4 py-2 text-[13px] font-medium rounded-md border border-border bg-background text-foreground hover:bg-muted/40 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-[13px] font-semibold rounded-md bg-foreground text-background hover:opacity-85 transition-opacity"
            >
              Salvar plano
            </button>
          </div>
        </div>

        {/* Validation summary */}
        {showErrors && (errors.nome || errors.servicos) && (
          <div className="px-4 py-3 rounded-md bg-destructive/10 border border-destructive/30 text-[12px] text-destructive font-medium space-y-0.5">
            {errors.nome && <p>· {errors.nome}</p>}
            {errors.servicos && <p>· {errors.servicos}</p>}
          </div>
        )}

        {/* ── 1. Detalhes ─────────────────────────────────────────────── */}
        <SectionCard num={1} title="Detalhes do plano">
          <div className="flex gap-3">
            <div className="flex-1">
              <FieldLabel>Nome do plano</FieldLabel>
              <Input
                value={form.nome}
                onChange={v => set({ nome: v })}
                placeholder="Ex: Clube Premium"
                className={showErrors && errors.nome ? "border-destructive" : ""}
              />
            </div>
            <div className="w-28">
              <FieldLabel>Valor (R$)</FieldLabel>
              <Input
                type="number"
                value={form.valor || ""}
                onChange={v => set({ valor: parseFloat(v) || 0 })}
              />
            </div>
            <div className="w-32">
              <FieldLabel>Recorrência</FieldLabel>
              <Select
                value={form.recorrencia}
                onChange={v => set({ recorrencia: v })}
                options={[
                  { value: "Mensal", label: "Mensal" },
                  { value: "Trimestral", label: "Trimestral" },
                  { value: "Semestral", label: "Semestral" },
                  { value: "Anual", label: "Anual" },
                ]}
              />
            </div>
            <div className="w-44">
              <FieldLabel>Pagamento</FieldLabel>
              <Select
                value={form.formaPagamento}
                onChange={v => set({ formaPagamento: v })}
                options={[
                  { value: "Cartão de Crédito", label: "Cartão de Crédito" },
                  { value: "PIX", label: "PIX" },
                  { value: "Boleto", label: "Boleto" },
                  { value: "Múltiplos", label: "Múltiplos" },
                ]}
              />
            </div>
          </div>

          <Divider />

          <div className="flex items-start gap-6">
            <div className="w-56">
              <FieldLabel>Status do plano</FieldLabel>
              <Select
                value={form.status}
                onChange={v => set({ status: v as PlanoAssinatura["status"] })}
                options={[
                  { value: "Ativo", label: "Ativo — visível na vitrine" },
                  { value: "Rascunho", label: "Rascunho — não visível" },
                  { value: "Arquivado", label: "Arquivado — desativado" },
                ]}
              />
            </div>

            {form.status === "Ativo" && (
              <div>
                <FieldLabel>Desativar automaticamente em</FieldLabel>
                <Input
                  type="date"
                  value={form.desativarEm}
                  onChange={v => set({ desativarEm: v })}
                  className="w-44"
                />
                <p className="text-[11px] text-muted-foreground mt-1">
                  Deixe em branco para manter ativo indefinidamente.
                </p>
              </div>
            )}

            <div className="ml-auto flex items-center gap-2.5 pt-5">
              <Toggle checked={form.destaque} onChange={v => set({ destaque: v })} />
              <div>
                <div className="text-[13px] font-semibold text-foreground">Plano destaque ★</div>
                <div className="text-[11px] text-muted-foreground">Aparece primeiro na vitrine</div>
              </div>
            </div>
          </div>
        </SectionCard>

        {/* ── 2. Diferenciais ─────────────────────────────────────────── */}
        <SectionCard num={2} title="Diferenciais do plano" sub="Opcional · arraste para reordenar">
          <p className="text-[12px] text-muted-foreground mb-3">
            O que torna este plano atrativo? Esses itens aparecem na vitrine do cliente.
          </p>
          <div className="space-y-1.5 mb-3">
            {form.beneficios.map((b, i) => (
              <div
                key={i}
                draggable
                onDragStart={() => setDragIdx(i)}
                onDragOver={e => e.preventDefault()}
                onDrop={() => onDrop(i)}
                className="flex items-center gap-2 px-3 py-2 rounded-md border border-border bg-background cursor-grab active:opacity-50 hover:border-foreground/30 transition-colors"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-muted-foreground flex-shrink-0">
                  <circle cx="4" cy="3" r="1" fill="currentColor" />
                  <circle cx="8" cy="3" r="1" fill="currentColor" />
                  <circle cx="4" cy="6" r="1" fill="currentColor" />
                  <circle cx="8" cy="6" r="1" fill="currentColor" />
                  <circle cx="4" cy="9" r="1" fill="currentColor" />
                  <circle cx="8" cy="9" r="1" fill="currentColor" />
                </svg>
                <span className="flex-1 text-[13px] text-foreground font-medium">{b}</span>
                <button
                  onClick={() => removeBeneficio(i)}
                  className="text-muted-foreground hover:text-destructive text-[16px] leading-none transition-colors"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              className="flex-1 px-3 py-2 text-[13px] rounded-md border border-border bg-muted/40 text-foreground placeholder:text-muted-foreground outline-none focus:border-foreground transition-colors"
              placeholder="Ex: Prioridade no agendamento"
              value={newBeneficio}
              onChange={e => setNewBeneficio(e.target.value)}
              onKeyDown={e => e.key === "Enter" && addBeneficio()}
            />
            <button
              onClick={addBeneficio}
              className="px-4 py-2 text-[12px] font-semibold rounded-md border border-border bg-background text-foreground hover:border-foreground/60 transition-colors whitespace-nowrap"
            >
              + Adicionar
            </button>
          </div>
        </SectionCard>

        {/* ── 3. Serviços ─────────────────────────────────────────────── */}
        <SectionCard
          num={3}
          title="Serviços inclusos"
          sub={
            svcSelCount > 0
              ? `${svcSelCount} selecionado${svcSelCount !== 1 ? "s" : ""}`
              : showErrors && errors.servicos ? "⚠ Obrigatório" : "Obrigatório"
          }
        >
          {/* Indicador de valor calculado */}
          {valorServicos > 0 && (
            <div className="flex items-center gap-2 mb-3 px-3 py-2 rounded-md bg-muted/60 border border-border text-[12px]">
              <span className="text-muted-foreground">Valor incluso no plano:</span>
              <span className="font-semibold text-foreground">R$ {valorServicos.toFixed(2)}</span>
              {form.valor > 0 && valorServicos > form.valor && (
                <>
                  <span className="text-muted-foreground">·</span>
                  <span className="text-muted-foreground">
                    Cliente economiza{" "}
                    <strong className="text-foreground">
                      R$ {(valorServicos - form.valor).toFixed(2)}
                    </strong>
                    /mês
                  </span>
                </>
              )}
            </div>
          )}

          {/* Toolbar */}
          <div className="flex items-center gap-2 mb-3">
            <SearchInput value={svcSearch} onChange={setSvcSearch} placeholder="Buscar serviço..." />
            {svcSelCount > 0 && (
              <button
                onClick={() => setSvcOnlySel(!svcOnlySel)}
                className={`flex items-center gap-1.5 px-3 py-[7px] text-[12px] font-semibold rounded-md border-2 transition-colors whitespace-nowrap ${
                  svcOnlySel
                    ? "bg-foreground border-foreground text-background"
                    : "bg-background border-foreground text-foreground"
                }`}
              >
                {svcSelCount}
                <CheckIcon />
              </button>
            )}
            <button
              onClick={selectAllSvcs}
              className="px-3 py-[7px] text-[12px] font-medium rounded-md border border-border bg-background text-muted-foreground hover:border-foreground/60 hover:text-foreground transition-colors whitespace-nowrap"
            >
              {allSvcsSel ? "Desmarcar todos" : "Selecionar todos"}
            </button>
          </div>

          {/* Lista com scroll */}
          <div className="max-h-[220px] overflow-y-auto pr-0.5 space-y-1.5">
            {svcsVisiveis.map(s => {
              const sp = form.servicos.find(x => x.servicoId === s.id);
              const sel = !!sp;
              return (
                <div
                  key={s.id}
                  onClick={() => toggleServico(s.id)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-md border cursor-pointer transition-all ${
                    sel
                      ? "border-foreground bg-muted/40"
                      : "border-border bg-background hover:border-foreground/30"
                  }`}
                >
                  <Checkbox checked={sel} />
                  <span className="flex-1 text-[13px] font-medium text-foreground">{s.nome}</span>

                  {sel && sp ? (
                    <div
                      className="flex items-end gap-3 flex-shrink-0"
                      onClick={e => e.stopPropagation()}
                    >
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Desconto</span>
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            min={0}
                            max={100}
                            value={sp.desconto}
                            onChange={e => updateServico(s.id, { desconto: Number(e.target.value) })}
                            className="w-14 text-[13px] font-medium text-center px-2 py-1 rounded-md border border-border bg-muted/40 text-foreground outline-none focus:border-foreground"
                          />
                          <span className="text-[12px] text-muted-foreground">%</span>
                        </div>
                      </div>
                      <div className="w-px h-8 bg-border self-end mb-1 flex-shrink-0" />
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Usos/mês</span>
                        <select
                          value={sp.usosPorMes}
                          onChange={e => updateServico(s.id, { usosPorMes: e.target.value })}
                          className="text-[13px] font-medium px-2 py-1 rounded-md border border-border bg-muted/40 text-foreground outline-none focus:border-foreground cursor-pointer"
                        >
                          {USOS_OPTS.map(o => <option key={o}>{o}</option>)}
                        </select>
                      </div>
                    </div>
                  ) : (
                    <span className="text-[12px] text-muted-foreground flex-shrink-0">
                      R$ {s.preco}
                    </span>
                  )}
                </div>
              );
            })}
            {svcsVisiveis.length === 0 && (
              <p className="text-[13px] text-muted-foreground text-center py-3">
                Nenhum serviço encontrado
              </p>
            )}
          </div>
        </SectionCard>

        {/* ── 4. Produtos ─────────────────────────────────────────────── */}
        <SectionCard
          num={4}
          title="Desconto em produtos"
          sub={prodSelCount > 0 ? `${prodSelCount} selecionado${prodSelCount !== 1 ? "s" : ""}` : "Opcional"}
        >
          <div className="flex items-center gap-2 mb-3">
            <SearchInput value={prodSearch} onChange={setProdSearch} placeholder="Buscar produto..." />
            {prodSelCount > 0 && (
              <button
                onClick={() => setProdOnlySel(!prodOnlySel)}
                className={`flex items-center gap-1.5 px-3 py-[7px] text-[12px] font-semibold rounded-md border-2 transition-colors whitespace-nowrap ${
                  prodOnlySel
                    ? "bg-foreground border-foreground text-background"
                    : "bg-background border-foreground text-foreground"
                }`}
              >
                {prodSelCount}
                <CheckIcon />
              </button>
            )}
          </div>

          <div className="max-h-[200px] overflow-y-auto pr-0.5 space-y-1.5">
            {prodsVisiveis.map(p => {
              const pp = form.produtos.find(x => x.produtoId === p.id);
              const sel = !!pp;
              return (
                <div
                  key={p.id}
                  onClick={() => toggleProduto(p.id)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-md border cursor-pointer transition-all ${
                    sel
                      ? "border-foreground bg-muted/40"
                      : "border-border bg-background hover:border-foreground/30"
                  }`}
                >
                  <Checkbox checked={sel} />
                  <span className="flex-1 text-[13px] font-medium text-foreground">{p.nome}</span>
                  {sel && pp && (
                    <div
                      className="flex items-end gap-3 flex-shrink-0"
                      onClick={e => e.stopPropagation()}
                    >
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Desconto</span>
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            min={0}
                            max={100}
                            value={pp.desconto}
                            onChange={e => updateProduto(p.id, { desconto: Number(e.target.value) })}
                            className="w-14 text-[13px] font-medium text-center px-2 py-1 rounded-md border border-border bg-muted/40 text-foreground outline-none focus:border-foreground"
                          />
                          <span className="text-[12px] text-muted-foreground">%</span>
                        </div>
                      </div>
                      <div className="w-px h-8 bg-border self-end mb-1 flex-shrink-0" />
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Limite desc./mês</span>
                        <div className="flex items-center gap-1">
                          <span className="text-[12px] text-muted-foreground">R$</span>
                          <input
                            type="number"
                            min={0}
                            value={pp.limiteDescontoMes ?? ""}
                            placeholder="Sem limite"
                            onChange={e =>
                              updateProduto(p.id, {
                                limiteDescontoMes: e.target.value ? Number(e.target.value) : null,
                              })
                            }
                            className="w-20 text-[13px] font-medium text-center px-2 py-1 rounded-md border border-border bg-muted/40 text-foreground outline-none focus:border-foreground placeholder:text-muted-foreground/60"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            {prodsVisiveis.length === 0 && (
              <p className="text-[13px] text-muted-foreground text-center py-3">
                Nenhum produto encontrado
              </p>
            )}
          </div>
        </SectionCard>

        {/* ── 5. Dias disponíveis ─────────────────────────────────────── */}
        <SectionCard num={5} title="Dias disponíveis">
          <div className="flex gap-2 mb-3">
            {[
              { label: "Todos os dias", dias: [] as number[] },
              { label: "Dias úteis", dias: [0, 1, 2, 3, 4] },
              { label: "Fins de semana", dias: [5, 6] },
            ].map(opt => {
              const isActive =
                JSON.stringify([...form.diasDisponiveis].sort()) ===
                JSON.stringify([...opt.dias].sort());
              return (
                <button
                  key={opt.label}
                  onClick={() => set({ diasDisponiveis: opt.dias })}
                  className={`px-3 py-1.5 text-[12px] font-medium rounded-md border transition-colors ${
                    isActive
                      ? "bg-foreground border-foreground text-background"
                      : "border-border bg-background text-muted-foreground hover:border-foreground/40 hover:text-foreground"
                  }`}
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
                  className={`flex-1 py-2 text-[11px] font-bold rounded-md border-2 transition-all ${
                    allDays
                      ? "border-border bg-muted/40 text-muted-foreground"
                      : explicit
                      ? "border-foreground bg-foreground text-background"
                      : "border-border bg-background text-muted-foreground hover:border-foreground/30"
                  }`}
                >
                  {d}
                </button>
              );
            })}
          </div>
          <p className="text-[11px] text-muted-foreground mt-2">
            Nenhum selecionado = aceito em todos os dias
          </p>
        </SectionCard>

        {/* ── 6. Profissionais ────────────────────────────────────────── */}
        <SectionCard num={6} title="Profissionais que atendem">
          <div className="flex flex-wrap gap-2 mb-2">
            {PROFISSIONAIS.map(p => {
              const sel = form.profissionaisIds.includes(p.id);
              return (
                <button
                  key={p.id}
                  onClick={() => toggleProf(p.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md border-2 text-[13px] font-semibold transition-all ${
                    sel
                      ? "border-foreground bg-foreground text-background"
                      : "border-border bg-background text-foreground hover:border-foreground/40"
                  }`}
                >
                  <span className={`w-5 h-5 rounded-full text-[9px] font-bold flex items-center justify-center flex-shrink-0 ${sel ? "bg-white/20 text-background" : "bg-muted text-muted-foreground"}`}>
                    {p.iniciais}
                  </span>
                  {p.nome}
                </button>
              );
            })}
          </div>
          <p className="text-[11px] text-muted-foreground">
            Nenhum selecionado = qualquer profissional pode atender
          </p>
        </SectionCard>

        {/* ── 7. Cancelamento ─────────────────────────────────────────── */}
        <SectionCard num={7} title="Regras de cancelamento">
          <div className="flex items-end gap-6">
            <div className="w-48">
              <FieldLabel>Carência para cancelar</FieldLabel>
              <Select
                value={form.cancelamentoCarencia}
                onChange={v => set({ cancelamentoCarencia: v })}
                options={CARENCIA_OPTS.map(c => ({ value: c, label: c }))}
              />
            </div>
            <div className="flex items-center gap-2.5 pb-[1px]">
              <Toggle
                checked={form.cancelamentoPausa}
                onChange={v => set({ cancelamentoPausa: v })}
              />
              <div>
                <div className="text-[13px] font-semibold text-foreground">Permitir pausa</div>
                <div className="text-[11px] text-muted-foreground">
                  Cliente pode pausar a assinatura temporariamente
                </div>
              </div>
            </div>
          </div>
          <p className="text-[11px] text-muted-foreground mt-3">
            {form.cancelamentoCarencia === "Sem carência"
              ? "O cliente pode cancelar a qualquer momento."
              : `O cliente só pode cancelar após ${form.cancelamentoCarencia} do início da assinatura.`}
          </p>
        </SectionCard>

        {/* Footer actions */}
        <div className="flex justify-between pt-2">
          <button
            onClick={() => navigate("/planos")}
            className="px-4 py-2 text-[13px] font-medium rounded-md border border-border bg-background text-foreground hover:bg-muted/40 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 text-[13px] font-semibold rounded-md bg-foreground text-background hover:opacity-85 transition-opacity"
          >
            Salvar plano
          </button>
        </div>

      </div>
    </AppLayout>
  );
}
