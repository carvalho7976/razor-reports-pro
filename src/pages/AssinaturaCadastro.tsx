import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { DataTable, Column, ActionsMenu, SelectionAction } from "@/components/DataTable";
import { Pencil, Trash2, Star, ToggleLeft, ToggleRight, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { FormModal, TextField, Dropdown, FormRow, DeleteModal, SaveButton } from "@/components/FormModal";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Servico {
  id: number;
  nome: string;
  preco: number;
}

interface Produto {
  id: number;
  nome: string;
}

interface Profissional {
  id: number;
  nome: string;
  iniciais: string;
}

interface ServicoPlano {
  servicoId: number;
  desconto: number; // 0-100
  usosPorMes: string; // "Ilimitado" | "1".."12"
}

interface ProdutoPlano {
  produtoId: number;
  desconto: number; // 0-100
  limiteDescontoMes: number | null; // R$ ou null = sem limite
}

interface PlanoAssinatura {
  id: number;
  nome: string;
  valor: number;
  recorrencia: string;
  formaPagamento: string;
  status: "Ativo" | "Rascunho" | "Arquivado";
  destaque: boolean;
  desativarEm: string; // "DD/MM/AAAA" ou ""
  beneficios: string[];
  servicos: ServicoPlano[];
  produtos: ProdutoPlano[];
  diasDisponiveis: number[]; // 0=Seg … 6=Dom, vazio = todos
  profissionaisIds: number[]; // vazio = todos
  cancelamentoCarencia: string; // "Sem carência" | "7 dias" | "30 dias"
  cancelamentoPausa: boolean;
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const SERVICOS_MOCK: Servico[] = [
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

const PRODUTOS_MOCK: Produto[] = [
  { id: 1, nome: "Balm para barba" },
  { id: 2, nome: "Botox capilar" },
  { id: 3, nome: "Pomada modeladora" },
  { id: 4, nome: "Óleo para barba" },
  { id: 5, nome: "Shampoo anticaspa" },
  { id: 6, nome: "Cera de cabelo" },
];

const PROFISSIONAIS_MOCK: Profissional[] = [
  { id: 1, nome: "Cesar", iniciais: "CE" },
  { id: 2, nome: "Claudia", iniciais: "CL" },
  { id: 3, nome: "Marcia Silva", iniciais: "MS" },
  { id: 4, nome: "Matheus", iniciais: "MA" },
  { id: 5, nome: "Vini", iniciais: "VI" },
];

const DAYS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
const USOS_OPTS = ["Ilimitado", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
const RECORRENCIA_OPTS = [
  { value: "Mensal", label: "Mensal" },
  { value: "Trimestral", label: "Trimestral" },
  { value: "Semestral", label: "Semestral" },
  { value: "Anual", label: "Anual" },
];
const PAGAMENTO_OPTS = [
  { value: "Cartão de Crédito", label: "Cartão de Crédito" },
  { value: "PIX", label: "PIX" },
  { value: "Boleto", label: "Boleto" },
  { value: "Múltiplos", label: "Múltiplos" },
];
const STATUS_OPTS = [
  { value: "Ativo", label: "Ativo — visível na vitrine" },
  { value: "Rascunho", label: "Rascunho — não visível" },
  { value: "Arquivado", label: "Arquivado — desativado" },
];
const CARENCIA_OPTS = [
  { value: "Sem carência", label: "Sem carência" },
  { value: "7 dias", label: "7 dias" },
  { value: "15 dias", label: "15 dias" },
  { value: "30 dias", label: "30 dias" },
];

const initialPlanos: PlanoAssinatura[] = [
  {
    id: 1,
    nome: "Clube Premium",
    valor: 89,
    recorrencia: "Mensal",
    formaPagamento: "Cartão de Crédito",
    status: "Ativo",
    destaque: true,
    desativarEm: "",
    beneficios: ["Prioridade no agendamento", "Traga um amigo no aniversário"],
    servicos: [
      { servicoId: 3, desconto: 100, usosPorMes: "Ilimitado" },
      { servicoId: 7, desconto: 100, usosPorMes: "4" },
    ],
    produtos: [{ produtoId: 1, desconto: 20, limiteDescontoMes: 50 }],
    diasDisponiveis: [],
    profissionaisIds: [],
    cancelamentoCarencia: "30 dias",
    cancelamentoPausa: true,
  },
  {
    id: 2,
    nome: "Estagiário",
    valor: 59,
    recorrencia: "Mensal",
    formaPagamento: "PIX",
    status: "Rascunho",
    destaque: false,
    desativarEm: "",
    beneficios: [],
    servicos: [{ servicoId: 4, desconto: 50, usosPorMes: "2" }],
    produtos: [],
    diasDisponiveis: [0, 1, 2, 3, 4],
    profissionaisIds: [1, 3],
    cancelamentoCarencia: "Sem carência",
    cancelamentoPausa: false,
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

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

function statusBadge(status: PlanoAssinatura["status"]) {
  const map: Record<string, string> = {
    Ativo: "bg-green-100 text-green-800",
    Rascunho: "bg-yellow-100 text-yellow-800",
    Arquivado: "bg-gray-100 text-gray-500",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium ${map[status]}`}>
      {status}
    </span>
  );
}

function valorServicos(plano: PlanoAssinatura) {
  return plano.servicos.reduce((acc, sp) => {
    const s = SERVICOS_MOCK.find((x) => x.id === sp.servicoId);
    return acc + (s ? s.preco * (sp.desconto / 100) : 0);
  }, 0);
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionTitle({ num, title, sub }: { num: number; title: string; sub?: string }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <div className="w-5 h-5 rounded-full bg-foreground text-background text-[10px] font-bold flex items-center justify-center flex-shrink-0">
        {num}
      </div>
      <span className="text-[13px] font-semibold text-foreground">{title}</span>
      {sub && <span className="text-[12px] text-muted-foreground ml-auto">{sub}</span>}
    </div>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-[18px] w-8 items-center rounded-full transition-colors flex-shrink-0 ${checked ? "bg-foreground" : "bg-border"}`}
    >
      <span
        className={`inline-block h-3 w-3 rounded-full bg-white transition-transform ${checked ? "translate-x-4" : "translate-x-1"}`}
      />
    </button>
  );
}

function SearchInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <div className="relative flex-1">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-[7px] text-[13px] rounded-md border border-border bg-muted/40 text-foreground placeholder:text-muted-foreground outline-none focus:border-foreground transition-colors"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground text-[15px] leading-none"
        >
          ×
        </button>
      )}
    </div>
  );
}

// ─── Plan Form ────────────────────────────────────────────────────────────────

function PlanForm({ plano, onChange }: { plano: PlanoAssinatura; onChange: (p: PlanoAssinatura) => void }) {
  const [svcSearch, setSvcSearch] = useState("");
  const [prodSearch, setProdSearch] = useState("");
  const [svcOnlySel, setSvcOnlySel] = useState(false);
  const [prodOnlySel, setProdOnlySel] = useState(false);
  const [newBeneficio, setNewBeneficio] = useState("");
  const [dragIdx, setDragIdx] = useState<number | null>(null);

  const set = (patch: Partial<PlanoAssinatura>) => onChange({ ...plano, ...patch });

  // Valor calculado dos serviços
  const valorCalculado = useMemo(() => valorServicos(plano), [plano.servicos]);

  // Serviços filtrados
  const svcsVisiveis = SERVICOS_MOCK.filter((s) => {
    const matchQ = s.nome.toLowerCase().includes(svcSearch.toLowerCase());
    const matchSel = !svcOnlySel || plano.servicos.some((sp) => sp.servicoId === s.id);
    return matchQ && matchSel;
  });

  // Produtos filtrados
  const prodsVisiveis = PRODUTOS_MOCK.filter((p) => {
    const matchQ = p.nome.toLowerCase().includes(prodSearch.toLowerCase());
    const matchSel = !prodOnlySel || plano.produtos.some((pp) => pp.produtoId === p.id);
    return matchQ && matchSel;
  });

  const toggleServico = (id: number) => {
    const exists = plano.servicos.find((sp) => sp.servicoId === id);
    if (exists) {
      set({ servicos: plano.servicos.filter((sp) => sp.servicoId !== id) });
    } else {
      set({ servicos: [...plano.servicos, { servicoId: id, desconto: 100, usosPorMes: "Ilimitado" }] });
    }
  };

  const updateServico = (id: number, patch: Partial<ServicoPlano>) => {
    set({ servicos: plano.servicos.map((sp) => (sp.servicoId === id ? { ...sp, ...patch } : sp)) });
  };

  const selectAllSvcs = () => {
    const allSel = svcsVisiveis.every((s) => plano.servicos.some((sp) => sp.servicoId === s.id));
    if (allSel) {
      set({ servicos: plano.servicos.filter((sp) => !svcsVisiveis.some((s) => s.id === sp.servicoId)) });
    } else {
      const toAdd = svcsVisiveis
        .filter((s) => !plano.servicos.some((sp) => sp.servicoId === s.id))
        .map((s) => ({ servicoId: s.id, desconto: 100, usosPorMes: "Ilimitado" as string }));
      set({ servicos: [...plano.servicos, ...toAdd] });
    }
  };

  const toggleProduto = (id: number) => {
    const exists = plano.produtos.find((pp) => pp.produtoId === id);
    if (exists) {
      set({ produtos: plano.produtos.filter((pp) => pp.produtoId !== id) });
    } else {
      set({ produtos: [...plano.produtos, { produtoId: id, desconto: 20, limiteDescontoMes: null }] });
    }
  };

  const updateProduto = (id: number, patch: Partial<ProdutoPlano>) => {
    set({ produtos: plano.produtos.map((pp) => (pp.produtoId === id ? { ...pp, ...patch } : pp)) });
  };

  const toggleDia = (i: number) => {
    const dias = plano.diasDisponiveis.includes(i)
      ? plano.diasDisponiveis.filter((d) => d !== i)
      : [...plano.diasDisponiveis, i];
    set({ diasDisponiveis: dias });
  };

  const toggleProf = (id: number) => {
    const ids = plano.profissionaisIds.includes(id)
      ? plano.profissionaisIds.filter((p) => p !== id)
      : [...plano.profissionaisIds, id];
    set({ profissionaisIds: ids });
  };

  const addBeneficio = () => {
    if (!newBeneficio.trim()) return;
    set({ beneficios: [...plano.beneficios, newBeneficio.trim()] });
    setNewBeneficio("");
  };

  const removeBeneficio = (i: number) => {
    set({ beneficios: plano.beneficios.filter((_, idx) => idx !== i) });
  };

  const onDragStart = (i: number) => setDragIdx(i);
  const onDrop = (i: number) => {
    if (dragIdx === null || dragIdx === i) return;
    const arr = [...plano.beneficios];
    const [moved] = arr.splice(dragIdx, 1);
    arr.splice(i, 0, moved);
    set({ beneficios: arr });
    setDragIdx(null);
  };

  const svcSelCount = plano.servicos.length;
  const prodSelCount = plano.produtos.length;
  const allSvcsSel =
    svcsVisiveis.length > 0 && svcsVisiveis.every((s) => plano.servicos.some((sp) => sp.servicoId === s.id));

  return (
    <div className="space-y-5">
      {/* ── 1. Detalhes ────────────────────────────────────────────── */}
      <section>
        <SectionTitle num={1} title="Detalhes do plano" />
        <div className="rounded-lg border border-border bg-card p-4 space-y-3">
          {/* Nome + Valor + Recorrência */}
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                Nome do plano
              </label>
              <input
                className="w-full px-3 py-[7px] text-[13px] rounded-md border border-border bg-background text-foreground outline-none focus:border-foreground transition-colors"
                placeholder="Ex: Clube Premium"
                value={plano.nome}
                onChange={(e) => set({ nome: e.target.value })}
              />
            </div>
            <div className="w-28">
              <label className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                Valor (R$)
              </label>
              <input
                type="number"
                className="w-full px-3 py-[7px] text-[13px] rounded-md border border-border bg-background text-foreground outline-none focus:border-foreground transition-colors"
                value={plano.valor || ""}
                onChange={(e) => set({ valor: parseFloat(e.target.value) || 0 })}
              />
            </div>
            <div className="w-32">
              <label className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                Recorrência
              </label>
              <select
                className="w-full px-3 py-[7px] text-[13px] rounded-md border border-border bg-background text-foreground outline-none focus:border-foreground transition-colors"
                value={plano.recorrencia}
                onChange={(e) => set({ recorrencia: e.target.value })}
              >
                {RECORRENCIA_OPTS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-40">
              <label className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                Pagamento
              </label>
              <select
                className="w-full px-3 py-[7px] text-[13px] rounded-md border border-border bg-background text-foreground outline-none focus:border-foreground transition-colors"
                value={plano.formaPagamento}
                onChange={(e) => set({ formaPagamento: e.target.value })}
              >
                {PAGAMENTO_OPTS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="border-t border-border" />

          {/* Status + Destaque */}
          <div className="flex gap-6">
            <div className="w-56">
              <label className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                Status do plano
              </label>
              <select
                className="w-full px-3 py-[7px] text-[13px] rounded-md border border-border bg-background text-foreground outline-none focus:border-foreground transition-colors"
                value={plano.status}
                onChange={(e) => set({ status: e.target.value as any })}
              >
                {STATUS_OPTS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>

            {plano.status === "Ativo" && (
              <div className="flex-1">
                <label className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                  Desativar automaticamente em
                </label>
                <input
                  type="date"
                  className="w-44 px-3 py-[7px] text-[13px] rounded-md border border-border bg-muted/40 text-foreground outline-none focus:border-foreground transition-colors"
                  value={plano.desativarEm}
                  onChange={(e) => set({ desativarEm: e.target.value })}
                />
                <p className="text-[11px] text-muted-foreground mt-1">Deixe vazio para manter ativo indefinidamente.</p>
              </div>
            )}

            <div className="flex items-end pb-[7px] gap-3 ml-auto">
              <div className="flex items-center gap-2">
                <Toggle checked={plano.destaque} onChange={(v) => set({ destaque: v })} />
                <div>
                  <div className="text-[13px] font-semibold text-foreground">Plano destaque ★</div>
                  <div className="text-[11px] text-muted-foreground">Aparece primeiro na vitrine</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. Diferenciais ────────────────────────────────────────── */}
      <section>
        <SectionTitle num={2} title="Diferenciais do plano" sub="Opcional · arraste para reordenar" />
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-[12px] text-muted-foreground mb-3">
            O que torna este plano atrativo? Esses textos aparecem na vitrine do cliente.
          </p>
          <div className="space-y-2 mb-3">
            {plano.beneficios.map((b, i) => (
              <div
                key={i}
                draggable
                onDragStart={() => onDragStart(i)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => onDrop(i)}
                className="flex items-center gap-2 px-3 py-[7px] rounded-md border border-border bg-background cursor-grab active:opacity-50 hover:border-foreground/30 transition-colors"
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  className="text-muted-foreground flex-shrink-0"
                >
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
              className="flex-1 px-3 py-[7px] text-[13px] rounded-md border border-border bg-muted/40 text-foreground placeholder:text-muted-foreground outline-none focus:border-foreground transition-colors"
              placeholder="Ex: Prioridade no agendamento"
              value={newBeneficio}
              onChange={(e) => setNewBeneficio(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addBeneficio()}
            />
            <button
              onClick={addBeneficio}
              className="px-4 py-[7px] text-[12px] font-semibold rounded-md border border-border bg-background text-foreground hover:border-foreground/60 transition-colors"
            >
              + Adicionar
            </button>
          </div>
        </div>
      </section>

      {/* ── 3. Serviços ────────────────────────────────────────────── */}
      <section>
        <SectionTitle
          num={3}
          title="Serviços inclusos"
          sub={svcSelCount > 0 ? `${svcSelCount} selecionado${svcSelCount !== 1 ? "s" : ""}` : "Obrigatório"}
        />
        <div className="rounded-lg border border-border bg-card p-4">
          {/* Indicador de valor */}
          {valorCalculado > 0 && (
            <div className="flex items-center gap-2 mb-3 px-3 py-2 rounded-md bg-muted/60 border border-border">
              <span className="text-[12px] text-muted-foreground">Valor dos serviços inclusos:</span>
              <span className="text-[13px] font-semibold text-foreground">R$ {valorCalculado.toFixed(2)}</span>
              {plano.valor > 0 && (
                <>
                  <span className="text-[12px] text-muted-foreground mx-1">·</span>
                  <span className="text-[12px] text-muted-foreground">
                    O cliente economiza{" "}
                    <strong className="text-foreground">R$ {(valorCalculado - plano.valor).toFixed(2)}</strong> por mês
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
                className={`flex items-center gap-1.5 px-3 py-[6px] text-[12px] font-semibold rounded-md border-2 transition-colors ${
                  svcOnlySel
                    ? "bg-foreground border-foreground text-background"
                    : "bg-background border-foreground text-foreground"
                }`}
              >
                {svcSelCount}
                <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                  <path
                    d="M2 6l2.5 2.5L10 3"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            )}
            <button
              onClick={selectAllSvcs}
              className="px-3 py-[6px] text-[12px] font-medium rounded-md border border-border bg-background text-muted-foreground hover:border-foreground/60 hover:text-foreground transition-colors whitespace-nowrap"
            >
              {allSvcsSel ? "Desmarcar todos" : "Selecionar todos"}
            </button>
          </div>

          {/* Lista com scroll */}
          <div className="max-h-[220px] overflow-y-auto pr-1 space-y-1.5 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
            {svcsVisiveis.map((s) => {
              const sp = plano.servicos.find((x) => x.servicoId === s.id);
              const sel = !!sp;
              return (
                <div
                  key={s.id}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md border transition-all cursor-pointer ${
                    sel ? "border-foreground bg-muted/40" : "border-border bg-background hover:border-foreground/30"
                  }`}
                  onClick={() => toggleServico(s.id)}
                >
                  {/* Checkbox */}
                  <div
                    className={`w-4 h-4 rounded-[3px] border-[1.5px] flex items-center justify-center flex-shrink-0 transition-all ${sel ? "bg-foreground border-foreground" : "border-border"}`}
                  >
                    {sel && (
                      <svg width="9" height="9" viewBox="0 0 12 12" fill="none">
                        <path
                          d="M2 6l2.5 2.5L10 3"
                          stroke="white"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>

                  <span className="flex-1 text-[13px] font-medium text-foreground">{s.nome}</span>

                  {/* Campos inline — só quando selecionado */}
                  {sel && sp && (
                    <div className="flex items-end gap-3 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
                          Desconto
                        </span>
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            min={0}
                            max={100}
                            value={sp.desconto}
                            onChange={(e) => updateServico(s.id, { desconto: Number(e.target.value) })}
                            className="w-14 text-[13px] font-medium text-center px-2 py-1 rounded-md border border-border bg-muted/40 text-foreground outline-none focus:border-foreground"
                          />
                          <span className="text-[12px] text-muted-foreground">%</span>
                        </div>
                      </div>
                      <div className="w-px h-8 bg-border flex-shrink-0 self-end mb-1" />
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
                          Usos/mês
                        </span>
                        <select
                          value={sp.usosPorMes}
                          onChange={(e) => updateServico(s.id, { usosPorMes: e.target.value })}
                          className="text-[13px] font-medium px-2 py-1 rounded-md border border-border bg-muted/40 text-foreground outline-none focus:border-foreground cursor-pointer"
                        >
                          {USOS_OPTS.map((o) => (
                            <option key={o}>{o}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}

                  {!sel && <span className="text-[12px] text-muted-foreground flex-shrink-0">R$ {s.preco}</span>}
                </div>
              );
            })}
            {svcsVisiveis.length === 0 && (
              <p className="text-[13px] text-muted-foreground text-center py-3">Nenhum serviço encontrado</p>
            )}
          </div>
        </div>
      </section>

      {/* ── 4. Produtos ────────────────────────────────────────────── */}
      <section>
        <SectionTitle
          num={4}
          title="Desconto em produtos"
          sub={prodSelCount > 0 ? `${prodSelCount} selecionado${prodSelCount !== 1 ? "s" : ""}` : "Opcional"}
        />
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center gap-2 mb-3">
            <SearchInput value={prodSearch} onChange={setProdSearch} placeholder="Buscar produto..." />
            {prodSelCount > 0 && (
              <button
                onClick={() => setProdOnlySel(!prodOnlySel)}
                className={`flex items-center gap-1.5 px-3 py-[6px] text-[12px] font-semibold rounded-md border-2 transition-colors ${
                  prodOnlySel
                    ? "bg-foreground border-foreground text-background"
                    : "bg-background border-foreground text-foreground"
                }`}
              >
                {prodSelCount}
                <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                  <path
                    d="M2 6l2.5 2.5L10 3"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            )}
          </div>

          <div className="max-h-[200px] overflow-y-auto pr-1 space-y-1.5 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
            {prodsVisiveis.map((p) => {
              const pp = plano.produtos.find((x) => x.produtoId === p.id);
              const sel = !!pp;
              return (
                <div
                  key={p.id}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md border transition-all cursor-pointer ${
                    sel ? "border-foreground bg-muted/40" : "border-border bg-background hover:border-foreground/30"
                  }`}
                  onClick={() => toggleProduto(p.id)}
                >
                  <div
                    className={`w-4 h-4 rounded-[3px] border-[1.5px] flex items-center justify-center flex-shrink-0 transition-all ${sel ? "bg-foreground border-foreground" : "border-border"}`}
                  >
                    {sel && (
                      <svg width="9" height="9" viewBox="0 0 12 12" fill="none">
                        <path
                          d="M2 6l2.5 2.5L10 3"
                          stroke="white"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                  <span className="flex-1 text-[13px] font-medium text-foreground">{p.nome}</span>
                  {sel && pp && (
                    <div className="flex items-end gap-3 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
                          Desconto
                        </span>
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            min={0}
                            max={100}
                            value={pp.desconto}
                            onChange={(e) => updateProduto(p.id, { desconto: Number(e.target.value) })}
                            className="w-14 text-[13px] font-medium text-center px-2 py-1 rounded-md border border-border bg-muted/40 text-foreground outline-none focus:border-foreground"
                          />
                          <span className="text-[12px] text-muted-foreground">%</span>
                        </div>
                      </div>
                      <div className="w-px h-8 bg-border flex-shrink-0 self-end mb-1" />
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
                          Limite desc./mês
                        </span>
                        <div className="flex items-center gap-1">
                          <span className="text-[12px] text-muted-foreground">R$</span>
                          <input
                            type="number"
                            min={0}
                            value={pp.limiteDescontoMes ?? ""}
                            placeholder="Sem limite"
                            onChange={(e) =>
                              updateProduto(p.id, { limiteDescontoMes: e.target.value ? Number(e.target.value) : null })
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
              <p className="text-[13px] text-muted-foreground text-center py-3">Nenhum produto encontrado</p>
            )}
          </div>
        </div>
      </section>

      {/* ── 5. Disponibilidade — Dias ───────────────────────────────── */}
      <section>
        <SectionTitle num={5} title="Dias disponíveis" />
        <div className="rounded-lg border border-border bg-card p-4">
          {/* Atalhos */}
          <div className="flex gap-2 mb-3">
            {[
              { label: "Todos os dias", dias: [] },
              { label: "Dias úteis", dias: [0, 1, 2, 3, 4] },
              { label: "Fins de semana", dias: [5, 6] },
            ].map((opt) => {
              const isActive =
                JSON.stringify([...plano.diasDisponiveis].sort()) === JSON.stringify([...opt.dias].sort());
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
              const sel = plano.diasDisponiveis.length === 0 || plano.diasDisponiveis.includes(i);
              const explicit = plano.diasDisponiveis.includes(i);
              const allDays = plano.diasDisponiveis.length === 0;
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
          <p className="text-[11px] text-muted-foreground mt-2">Nenhum selecionado = aceito em todos os dias</p>
        </div>
      </section>

      {/* ── 6. Disponibilidade — Profissionais ─────────────────────── */}
      <section>
        <SectionTitle num={6} title="Profissionais que atendem" />
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex flex-wrap gap-2 mb-2">
            {PROFISSIONAIS_MOCK.map((p) => {
              const sel = plano.profissionaisIds.includes(p.id);
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
                  <span
                    className={`w-5 h-5 rounded-full text-[9px] font-bold flex items-center justify-center flex-shrink-0 ${sel ? "bg-background/20 text-background" : "bg-muted text-muted-foreground"}`}
                  >
                    {p.iniciais}
                  </span>
                  {p.nome}
                </button>
              );
            })}
          </div>
          <p className="text-[11px] text-muted-foreground">Nenhum selecionado = qualquer profissional pode atender</p>
        </div>
      </section>

      {/* ── 7. Regras de cancelamento ──────────────────────────────── */}
      <section>
        <SectionTitle num={7} title="Regras de cancelamento" />
        <div className="rounded-lg border border-border bg-card p-4 space-y-3">
          <div className="flex gap-4 items-end">
            <div className="w-44">
              <label className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                Carência para cancelar
              </label>
              <select
                className="w-full px-3 py-[7px] text-[13px] rounded-md border border-border bg-background text-foreground outline-none focus:border-foreground transition-colors"
                value={plano.cancelamentoCarencia}
                onChange={(e) => set({ cancelamentoCarencia: e.target.value })}
              >
                {CARENCIA_OPTS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2 pb-[7px]">
              <Toggle checked={plano.cancelamentoPausa} onChange={(v) => set({ cancelamentoPausa: v })} />
              <div>
                <div className="text-[13px] font-semibold text-foreground">Permitir pausa</div>
                <div className="text-[11px] text-muted-foreground">
                  Cliente pode pausar a assinatura temporariamente
                </div>
              </div>
            </div>
          </div>
          <p className="text-[11px] text-muted-foreground">
            {plano.cancelamentoCarencia === "Sem carência"
              ? "O cliente pode cancelar a qualquer momento sem restrição."
              : `O cliente só pode cancelar após ${plano.cancelamentoCarencia} do início da assinatura.`}
          </p>
        </div>
      </section>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

type ModalState =
  | { type: "new" }
  | { type: "edit"; item: PlanoAssinatura }
  | { type: "delete"; item: PlanoAssinatura }
  | null;

export default function ListaPlanos() {
  const [allData, setAllData] = useState(initialPlanos);
  const [modal, setModal] = useState<ModalState>(null);
  const [form, setForm] = useState<PlanoAssinatura | null>(null);
  const [showErrors, setShowErrors] = useState(false);
  const { toast } = useToast();

  const errors = {
    nome: !form?.nome ? "Informe o nome do plano." : "",
    servicos: !form?.servicos.length ? "Selecione ao menos um serviço." : "",
  };

  const openNew = () => {
    setForm(emptyPlano());
    setModal({ type: "new" });
  };
  const openEdit = (item: PlanoAssinatura) => {
    setForm({ ...item });
    setModal({ type: "edit", item });
  };
  const openDelete = (item: PlanoAssinatura) => setModal({ type: "delete", item });
  const closeModal = () => {
    setModal(null);
    setForm(null);
    setShowErrors(false);
  };

  const handleSave = () => {
    if (!form) return;
    setShowErrors(true);
    if (errors.nome || errors.servicos) return;
    if (modal?.type === "new") {
      const nextId = allData.length ? Math.max(...allData.map((d) => d.id)) + 1 : 1;
      setAllData((prev) => [{ ...form, id: nextId }, ...prev]);
      toast({ title: "Plano criado com sucesso" });
    } else if (modal?.type === "edit") {
      setAllData((prev) => prev.map((d) => (d.id === form.id ? form : d)));
      toast({ title: "Plano atualizado" });
    }
    closeModal();
  };

  const handleDelete = () => {
    if (modal?.type !== "delete") return;
    setAllData((prev) => prev.filter((d) => d.id !== modal.item.id));
    toast({ title: "Plano removido", variant: "destructive" });
    closeModal();
  };

  const toggleStatus = (item: PlanoAssinatura) => {
    const next: PlanoAssinatura["status"] = item.status === "Ativo" ? "Arquivado" : "Ativo";
    setAllData((prev) => prev.map((d) => (d.id === item.id ? { ...d, status: next } : d)));
    toast({ title: `Plano ${next === "Ativo" ? "ativado" : "arquivado"}` });
  };

  const duplicate = (item: PlanoAssinatura) => {
    const nextId = Math.max(...allData.map((d) => d.id)) + 1;
    setAllData((prev) => [...prev, { ...item, id: nextId, nome: `${item.nome} (cópia)`, status: "Rascunho" }]);
    toast({ title: "Plano duplicado como rascunho" });
  };

  const bulkRemove = (indices: number[]) => {
    const ids = indices.map((i) => allData[i]?.id).filter(Boolean);
    setAllData((prev) => prev.filter((d) => !ids.includes(d.id)));
    toast({ title: `${ids.length} plano(s) removido(s)`, variant: "destructive" });
  };

  const selectionActions: SelectionAction[] = [
    {
      label: "Remover",
      icon: <Trash2 className="h-4 w-4" />,
      onClick: bulkRemove,
      variant: "destructive",
      description: "Remove permanentemente os planos selecionados",
    },
  ];

  const columns: Column<PlanoAssinatura>[] = [
    {
      key: "nome",
      label: "Nome",
      pinned: true,
      render: (v, row) => (
        <div className="flex items-center gap-2">
          {row.destaque && <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500 flex-shrink-0" />}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              openEdit(row);
            }}
            className="hover:underline font-medium"
          >
            {v}
          </a>
        </div>
      ),
    },
    {
      key: "valor",
      label: "Valor",
      render: (v, row) => `R$ ${Number(v).toFixed(2).replace(".", ",")} / ${row.recorrencia}`,
    },
    {
      key: "status",
      label: "Status",
      render: (v) => statusBadge(v as any),
    },
    {
      key: "servicos",
      label: "Serviços",
      render: (v) => `${(v as ServicoPlano[]).length} serviço${(v as ServicoPlano[]).length !== 1 ? "s" : ""}`,
    },
    {
      key: "acoes" as any,
      label: "Ações",
      sortable: false,
      filterable: false,
      align: "center",
      render: (_, row) => (
        <ActionsMenu
          items={[
            { label: "Editar", icon: <Pencil className="h-4 w-4" />, onClick: () => openEdit(row) },
            { label: "Duplicar", icon: <Copy className="h-4 w-4" />, onClick: () => duplicate(row) },
            {
              label: row.status === "Ativo" ? "Arquivar" : "Ativar",
              icon: row.status === "Ativo" ? <ToggleLeft className="h-4 w-4" /> : <ToggleRight className="h-4 w-4" />,
              onClick: () => toggleStatus(row),
            },
            {
              label: "Excluir",
              icon: <Trash2 className="h-4 w-4" />,
              variant: "destructive",
              onClick: () => openDelete(row),
            },
          ]}
        />
      ),
    },
  ];

  return (
    <AppLayout>
      <DataTable
        title="Planos de Assinatura"
        data={allData}
        columns={columns}
        selectable
        selectionActions={selectionActions}
        novoMenuItems={[{ label: "Novo plano", onClick: openNew }]}
        pageSize={15}
        tableId="lista_planos"
      />

      {/* New / Edit — modal largo para comportar o formulário */}
      <Dialog open={modal?.type === "new" || modal?.type === "edit"} onOpenChange={(open) => !open && closeModal()}>
        <DialogContent className="border-0 bg-transparent p-0 shadow-none [&>button]:hidden max-w-3xl">
          {form && (
            <FormModal
              title={modal?.type === "new" ? "Novo plano de assinatura" : "Editar plano"}
              subtitle="Configure os detalhes, serviços e regras do plano."
              onClose={closeModal}
              footer={<SaveButton onClick={handleSave} />}
            >
              {showErrors && (errors.nome || errors.servicos) && (
                <div className="mb-4 px-3 py-2 rounded-md bg-destructive/10 border border-destructive/30 text-[12px] text-destructive font-medium space-y-0.5">
                  {errors.nome && <p>· {errors.nome}</p>}
                  {errors.servicos && <p>· {errors.servicos}</p>}
                </div>
              )}
              <PlanForm plano={form} onChange={setForm} />
            </FormModal>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete */}
      <Dialog open={modal?.type === "delete"} onOpenChange={(open) => !open && closeModal()}>
        <DialogContent className="border-0 bg-transparent p-0 shadow-none [&>button]:hidden">
          <DeleteModal
            title="Excluir plano"
            message={
              modal?.type === "delete"
                ? `Deseja excluir o plano "${modal.item.nome}"? Clientes com assinatura ativa serão afetados.`
                : ""
            }
            onConfirm={handleDelete}
            onClose={closeModal}
          />
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
