import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { TextField, Dropdown } from "@/components/FormModal";
import { useToast } from "@/hooks/use-toast";
import { Plus, CalendarDays, Users, Trash2, ArrowUp, ArrowDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";

interface ServicoOpt { id: number; nome: string; }
interface ProdutoOpt { id: number; nome: string; }
interface ProfissionalOpt { id: number; nome: string; iniciais: string; }

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

interface ProdutoIncluso {
  id: number;
  quantidade: string;
  desconto: string;
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
  title,
  description,
  children,
  className = "",
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rounded-xl border border-border bg-card p-4", className)}>
      <div className="mb-3">
        <h2 className="text-base font-semibold text-foreground">{title}</h2>
        {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
      </div>
      {children}
    </div>
  );
}

function MultiSelectSearch({
  label,
  placeholder,
  options,
  selected,
  onChange,
}: {
  label: string;
  placeholder?: string;
  options: { id: number; nome: string }[];
  selected: number[];
  onChange: (ids: number[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const [busca, setBusca] = useState("");
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = options.filter((o) => o.nome.toLowerCase().includes(busca.toLowerCase()));
  const toggle = (id: number) =>
    onChange(selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id]);
  const allSelected = filtered.length > 0 && filtered.every((o) => selected.includes(o.id));
  const toggleAll = () => {
    if (allSelected) onChange(selected.filter((id) => !filtered.some((o) => o.id === id)));
    else onChange(Array.from(new Set([...selected, ...filtered.map((o) => o.id)])));
  };

  return (
    <div className="relative" ref={ref}>
      <label className="mb-1 block text-sm font-medium text-foreground">{label}</label>
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="flex h-10 w-full items-center justify-between rounded-lg border border-border bg-background px-3 text-sm text-foreground transition-all hover:border-muted-foreground"
      >
        <span className={cn("truncate", selected.length === 0 && "text-muted-foreground")}>
          {selected.length === 0
            ? placeholder || "Selecione..."
            : `${selected.length} selecionado(s)`}
        </span>
        <Search className="h-4 w-4 text-muted-foreground" />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 w-full overflow-hidden rounded-lg border border-border bg-card shadow-xl">
          <div className="border-b border-border p-2">
            <input
              placeholder="Buscar..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="h-9 w-full rounded-lg border border-border bg-card px-3 text-sm text-foreground outline-none focus:border-foreground"
              autoFocus
            />
          </div>
          <div className="max-h-60 overflow-auto">
            {filtered.length > 0 && (
              <button
                type="button"
                onClick={toggleAll}
                className="flex w-full items-center gap-3 border-b border-border px-4 py-2.5 text-sm font-semibold text-foreground transition hover:bg-muted"
              >
                {allSelected ? "Desmarcar todos" : "Selecionar todos"}
              </button>
            )}
            {filtered.map((o) => (
              <button
                key={o.id}
                type="button"
                onClick={() => toggle(o.id)}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-sm transition hover:bg-muted"
              >
                <Checkbox
                  checked={selected.includes(o.id)}
                  className="pointer-events-none h-4 w-4 rounded-md border border-zinc-400 bg-background shadow-sm data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 data-[state=checked]:text-white"
                />
                <span className="text-foreground">{o.nome}</span>
              </button>
            ))}
            {filtered.length === 0 && (
              <p className="px-4 py-3 text-center text-sm text-muted-foreground">Nenhum item encontrado</p>
            )}
          </div>
        </div>
      )}
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

  // Serviços (multi-select)
  const [servicosPendentes, setServicosPendentes] = useState<number[]>([]);
  const [descontoServico, setDescontoServico] = useState("100");
  const [usosServico, setUsosServico] = useState("ILIMITADO");
  const [comissaoServico, setComissaoServico] = useState("TEMPO");
  const [servicosInclusos, setServicosInclusos] = useState<ServicoIncluso[]>([
    { id: 1, desconto: "100", usos: "ILIMITADO", comissao: "TEMPO" },
    { id: 5, desconto: "100", usos: "ILIMITADO", comissao: "TEMPO" },
  ]);

  // Produtos (multi-select)
  const [produtosPendentes, setProdutosPendentes] = useState<number[]>([]);
  const [quantidadeProdutoForm, setQuantidadeProdutoForm] = useState("1");
  const [descontoProdutoForm, setDescontoProdutoForm] = useState("10");
  const [produtosSelecionados, setProdutosSelecionados] = useState<ProdutoIncluso[]>([]);

  // Disponibilidade
  const [diasAceitos, setDiasAceitos] = useState<string[]>([
    "seg", "ter", "qua", "qui", "sex",
  ]);
  const [profissionaisAtendem, setProfissionaisAtendem] = useState<number[]>([1, 2, 3, 4]);

  const [showErrors, setShowErrors] = useState(false);
  const errors = {
    nome: !nome.trim() ? "Informe o nome do plano" : "",
  };
  const showError = (k: keyof typeof errors) => (showErrors ? errors[k] : "");

  // Helpers
  const servicosDisponiveisFiltrados = useMemo(
    () => servicosDisponiveis.filter((s) => !servicosInclusos.some((i) => i.id === s.id)),
    [servicosInclusos],
  );
  const produtosDisponiveisFiltrados = useMemo(
    () => produtosDisponiveis.filter((p) => !produtosSelecionados.some((i) => i.id === p.id)),
    [produtosSelecionados],
  );

  const adicionarServico = () => {
    if (servicosPendentes.length === 0) return;
    const novos: ServicoIncluso[] = servicosPendentes
      .filter((id) => !servicosInclusos.some((s) => s.id === id))
      .map((id) => ({
        id,
        desconto: descontoServico || "0",
        usos: usosServico,
        comissao: comissaoServico,
      }));
    setServicosInclusos((prev) => [...prev, ...novos]);
    setServicosPendentes([]);
  };

  const removerServico = (id: number) =>
    setServicosInclusos((prev) => prev.filter((s) => s.id !== id));

  const adicionarProduto = () => {
    if (produtosPendentes.length === 0) return;
    const novos: ProdutoIncluso[] = produtosPendentes
      .filter((id) => !produtosSelecionados.some((p) => p.id === id))
      .map((id) => ({
        id,
        quantidade: quantidadeProdutoForm || "1",
        desconto: descontoProdutoForm || "0",
      }));
    setProdutosSelecionados((prev) => [...prev, ...novos]);
    setProdutosPendentes([]);
  };

  const removerProduto = (id: number) =>
    setProdutosSelecionados((prev) => prev.filter((p) => p.id !== id));

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

  const nomeServico = (id: number) =>
    servicosDisponiveis.find((s) => s.id === id)?.nome || "";
  const nomeProduto = (id: number) =>
    produtosDisponiveis.find((p) => p.id === id)?.nome || "";
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
                Configure os dados, serviços e produtos do plano.
              </p>
            </div>
          </div>
        </div>

        {/* CONTENT */}
        {/* Navegação âncora sticky */}
        <div className="sticky top-0 z-30 mx-6 mt-4 flex gap-1 border-b border-border bg-background/80 pt-2 backdrop-blur">
          {[
            { id: "detalhes", label: "Detalhes" },
            { id: "servicos", label: "Serviços" },
            { id: "produtos", label: "Produtos" },
          ].map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="relative px-3 pb-2.5 text-sm font-medium text-muted-foreground transition hover:text-foreground"
            >
              {s.label}
            </a>
          ))}
        </div>

        {/* CONTENT */}
        <div className="mx-6 mt-5 flex max-w-5xl flex-col gap-5 pb-24">
          {/* DETALHES */}
          <section id="detalhes" className="scroll-mt-20 grid gap-5">
            <SectionBlock title="Dados do plano" description="Identificação e cobrança do plano de assinatura.">
              <div className="grid gap-4">
                <div className="grid gap-4 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
                  <TextField
                    label="Nome do plano *"
                    value={nome}
                    onChange={setNome}
                    placeholder="Ex: Plano Mensal Premium"
                    error={showError("nome")}
                  />
                  <CurrencyInput label="Valor" value={valor} onChange={setValor} />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
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
                <div className="mt-1 flex items-center justify-between rounded-lg border border-border bg-muted/30 px-3 py-2.5">
                  <div>
                    <p className="text-sm font-semibold text-foreground">Disponível na vitrine</p>
                    <p className="text-xs text-muted-foreground">
                      Quando ativo, o plano fica disponível para venda aos clientes.
                    </p>
                  </div>
                  <Switch checked={disponivelVenda} onCheckedChange={setDisponivelVenda} />
                </div>
              </div>
            </SectionBlock>
          </section>

          {/* SERVIÇOS - 2 colunas estilo NovaCompra */}
          <section id="servicos" className="scroll-mt-20">
            <SectionBlock
              title="Serviços"
              description="Selecione os serviços inclusos no plano e configure desconto, usos e comissão."
            >
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
              {/* Form esquerda */}
              <div className="space-y-4 self-start">
                <MultiSelectSearch
                  label="Serviços"
                  placeholder="Buscar e selecionar..."
                  options={servicosDisponiveisFiltrados}
                  selected={servicosPendentes}
                  onChange={setServicosPendentes}
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

                <Dropdown
                  label="Usos / mês"
                  value={usosServico}
                  setValue={setUsosServico}
                  options={usosOptions}
                />

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
                    disabled={servicosPendentes.length === 0}
                    className="h-10 rounded-lg bg-foreground px-4 text-sm font-semibold text-background transition disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Adicionar{servicosPendentes.length > 0 ? ` (${servicosPendentes.length})` : ""}
                  </button>
                </div>
              </div>

              {/* Tabela direita */}
              <div className="space-y-4 self-start">
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
                          <td colSpan={5} className="px-4 py-16 text-center text-sm text-muted-foreground">
                            Adicione um serviço para incluir no plano.
                          </td>
                        </tr>
                      ) : (
                        servicosInclusos.map((s) => (
                          <tr key={s.id} className="border-t border-border bg-card">
                            <td className="px-4 py-3 text-sm text-foreground">{nomeServico(s.id)}</td>
                            <td className="px-4 py-3 text-right text-sm font-medium text-emerald-600">{s.desconto}%</td>
                            <td className="px-4 py-3 text-center text-sm text-foreground">{labelUsos(s.usos)}</td>
                            <td className="px-4 py-3 text-center text-sm text-foreground">{labelComissao(s.comissao)}</td>
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
            </SectionBlock>
          </section>

          {/* PRODUTOS - 2 colunas estilo NovaCompra */}
          <section id="produtos" className="scroll-mt-20">
            <SectionBlock
              title="Produtos"
              description="Selecione os produtos inclusos no plano com quantidade e desconto."
            >
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
              <div className="space-y-4 self-start">
                <MultiSelectSearch
                  label="Produtos"
                  placeholder="Buscar e selecionar..."
                  options={produtosDisponiveisFiltrados}
                  selected={produtosPendentes}
                  onChange={setProdutosPendentes}
                />

                <div className="grid gap-1.5">
                  <label className="text-sm font-medium text-foreground">Quantidade</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={quantidadeProdutoForm}
                    onChange={(e) => setQuantidadeProdutoForm(e.target.value.replace(/\D/g, ""))}
                    placeholder="1"
                    className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>

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
                    disabled={produtosPendentes.length === 0}
                    className="h-10 rounded-lg bg-foreground px-4 text-sm font-semibold text-background transition disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Adicionar{produtosPendentes.length > 0 ? ` (${produtosPendentes.length})` : ""}
                  </button>
                </div>
              </div>

              <div className="space-y-4 self-start">
                <div className="overflow-hidden rounded-lg border border-border bg-card">
                  <table className="w-full border-collapse">
                    <thead className="bg-muted/40">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Produto</th>
                        <th className="px-4 py-3 text-center text-sm font-semibold text-foreground">Quantidade</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">Desconto</th>
                        <th className="w-14 px-2 py-3" />
                      </tr>
                    </thead>
                    <tbody>
                      {produtosSelecionados.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-4 py-16 text-center text-sm text-muted-foreground">
                            Adicione um produto para aplicar desconto.
                          </td>
                        </tr>
                      ) : (
                        produtosSelecionados.map((p) => (
                          <tr key={p.id} className="border-t border-border bg-card">
                            <td className="px-4 py-3 text-sm text-foreground">{nomeProduto(p.id)}</td>
                            <td className="px-4 py-3 text-center text-sm text-foreground">{p.quantidade}</td>
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
            </SectionBlock>
          </section>
        </div>

        {/* FOOTER único - sempre visível */}
        <div className="sticky bottom-0 border-t border-border bg-card px-6 py-4">
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
