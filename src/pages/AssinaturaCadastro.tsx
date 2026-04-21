import { useState } from "react";

// ── mock data ──────────────────────────────────────────────────────────────────
const diasSemana = [
  { key: "seg", label: "Seg" },
  { key: "ter", label: "Ter" },
  { key: "qua", label: "Qua" },
  { key: "qui", label: "Qui" },
  { key: "sex", label: "Sex" },
  { key: "sab", label: "Sáb" },
  { key: "dom", label: "Dom" },
];

const profissionaisDisponiveis = [
  { id: 1, nome: "Ana Silva" },
  { id: 2, nome: "Bruno Costa" },
  { id: 3, nome: "Carla Melo" },
];

const recorrenciaOptions = [
  { value: "mensal", label: "Mensal" },
  { value: "trimestral", label: "Trimestral" },
  { value: "anual", label: "Anual" },
];

const formaPagamentoOptions = [
  { value: "cartao", label: "Cartão" },
  { value: "pix", label: "Pix" },
  { value: "boleto", label: "Boleto" },
];

const servicosMock = [
  { id: 1, nome: "Corte de cabelo" },
  { id: 2, nome: "Hidratação" },
  { id: 3, nome: "Escova" },
  { id: 4, nome: "Coloração" },
  { id: 5, nome: "Manicure" },
];

const produtosMock = [
  { id: 1, nome: "Shampoo Premium" },
  { id: 2, nome: "Condicionador" },
  { id: 3, nome: "Máscara Capilar" },
  { id: 4, nome: "Leave-in" },
];

// ── helpers ────────────────────────────────────────────────────────────────────
function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

// ── sub-components ─────────────────────────────────────────────────────────────
function SectionBlock({ title, children }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <h3 className="text-sm font-semibold mb-4 text-foreground">{title}</h3>
      {children}
    </div>
  );
}

function TextField({ label, value, onChange, error, placeholder }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "h-10 rounded-lg border px-3 text-sm focus:outline-none focus:ring-2 focus:ring-foreground",
          error ? "border-red-500" : "border-border",
        )}
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}

function CurrencyInput({ label, value, onChange }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="R$ 0,00"
        className="h-10 rounded-lg border border-border px-3 text-sm focus:outline-none focus:ring-2 focus:ring-foreground"
      />
    </div>
  );
}

function Dropdown({ label, value, setValue, options }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      <select
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="h-10 rounded-lg border border-border bg-card px-3 text-sm focus:outline-none focus:ring-2 focus:ring-foreground"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function Switch({ checked, onCheckedChange }) {
  return (
    <button
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
        checked ? "bg-foreground" : "bg-muted",
      )}
    >
      <span
        className={cn(
          "inline-block h-4 w-4 transform rounded-full bg-background transition-transform",
          checked ? "translate-x-6" : "translate-x-1",
        )}
      />
    </button>
  );
}

function MultiSelectSearch({ label, options, selected, onChange }) {
  const [busca, setBusca] = useState("");

  const filtrados = options.filter((o) => o.nome.toLowerCase().includes(busca.toLowerCase()));

  function toggle(id) {
    if (selected.includes(id)) {
      onChange(selected.filter((x) => x !== id));
    } else {
      onChange([...selected, id]);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      <input
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        placeholder={`Buscar ${label.toLowerCase()}...`}
        className="h-10 rounded-lg border border-border px-3 text-sm focus:outline-none focus:ring-2 focus:ring-foreground"
      />
      <div className="rounded-lg border border-border divide-y divide-border max-h-48 overflow-y-auto">
        {filtrados.length === 0 ? (
          <div className="py-4 text-center text-xs text-muted-foreground">Nenhum resultado</div>
        ) : (
          filtrados.map((o) => (
            <label key={o.id} className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-muted/40 text-sm">
              <input
                type="checkbox"
                checked={selected.includes(o.id)}
                onChange={() => toggle(o.id)}
                className="rounded"
              />
              {o.nome}
            </label>
          ))
        )}
      </div>
    </div>
  );
}

// ── main component ─────────────────────────────────────────────────────────────
export default function AssinaturaCadastro() {
  const editing = false; // troque para `true` para modo de edição

  // Detalhes
  const [nome, setNome] = useState("");
  const [valor, setValor] = useState("");
  const [recorrencia, setRecorrencia] = useState("mensal");
  const [formaPagamento, setFormaPagamento] = useState("cartao");

  // Benefícios
  const [beneficios, setBeneficios] = useState([]);
  const [novoBeneficio, setNovoBeneficio] = useState("");

  // Vitrine
  const [disponivelVenda, setDisponivelVenda] = useState(true);

  // Disponibilidade
  const [diasAceitos, setDiasAceitos] = useState([]);
  const [profissionaisAtendem, setProfissionaisAtendem] = useState([]);

  // Serviços
  const [servicosPendentes, setServicosPendentes] = useState([]);
  const [servicosInclusos, setServicosInclusos] = useState([]);

  // Produtos
  const [produtosPendentes, setProdutosPendentes] = useState([]);
  const [produtosSelecionados, setProdutosSelecionados] = useState([]);

  // Erros
  const [errors, setErrors] = useState({});

  // ── funções ──────────────────────────────────────────────────────────────────
  function showError(field) {
    return errors[field] || null;
  }

  function toggleDia(key) {
    setDiasAceitos((prev) => (prev.includes(key) ? prev.filter((d) => d !== key) : [...prev, key]));
  }

  function toggleProfissional(id) {
    setProfissionaisAtendem((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]));
  }

  function adicionarServico() {
    const novos = servicosPendentes.filter((id) => !servicosInclusos.find((s) => s.id === id)).map((id) => ({ id }));
    setServicosInclusos((prev) => [...prev, ...novos]);
    setServicosPendentes([]);
  }

  function removerServico(id) {
    setServicosInclusos((prev) => prev.filter((s) => s.id !== id));
  }

  function adicionarProduto() {
    const novos = produtosPendentes
      .filter((id) => !produtosSelecionados.find((p) => p.id === id))
      .map((id) => ({ id }));
    setProdutosSelecionados((prev) => [...prev, ...novos]);
    setProdutosPendentes([]);
  }

  function removerProduto(id) {
    setProdutosSelecionados((prev) => prev.filter((p) => p.id !== id));
  }

  function nomeServico(id) {
    return servicosMock.find((s) => s.id === id)?.nome ?? `Serviço #${id}`;
  }

  function nomeProduto(id) {
    return produtosMock.find((p) => p.id === id)?.nome ?? `Produto #${id}`;
  }

  const servicosDisponiveisFiltrados = servicosMock.filter((s) => !servicosInclusos.find((x) => x.id === s.id));

  const produtosDisponiveisFiltrados = produtosMock.filter((p) => !produtosSelecionados.find((x) => x.id === p.id));

  function handleSalvar() {
    const erros: Record<string, string> = {};
    if (!nome.trim()) erros.nome = "Campo obrigatório";
    setErrors(erros);
    if (Object.keys(erros).length > 0) return;
    alert(editing ? "Alterações salvas!" : "Plano criado com sucesso!");
  }

  // ── render ───────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-0 min-h-screen bg-background">
      {/* HEADER */}
      <div className="mx-6 mt-4">
        <h1 className="text-xl font-bold text-foreground">
          {editing ? "Editar plano de assinatura" : "Novo plano de assinatura"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">Configure os dados, serviços e produtos do plano.</p>
      </div>

      {/* ONE PAGE */}
      <div className="mx-6 mt-5 pb-24 space-y-10">
        {/* ===== DETALHES ===== */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Detalhes do plano</h2>

          <div className="grid max-w-6xl gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
            {/* ESQUERDA */}
            <div className="grid gap-5">
              <SectionBlock title="Dados do plano">
                <div className="grid gap-4">
                  <TextField
                    label="Nome do plano *"
                    value={nome}
                    onChange={setNome}
                    error={showError("nome")}
                    placeholder="Ex: Plano Mensal"
                  />
                  <div className="grid gap-4 md:grid-cols-3">
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
                </div>
              </SectionBlock>

              <SectionBlock title="Benefícios">
                <div className="grid gap-2">
                  <div className="flex gap-2">
                    <input
                      value={novoBeneficio}
                      onChange={(e) => setNovoBeneficio(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && novoBeneficio.trim()) {
                          setBeneficios([...beneficios, novoBeneficio.trim()]);
                          setNovoBeneficio("");
                        }
                      }}
                      placeholder="Descreva um benefício..."
                      className="h-10 flex-1 rounded-lg border border-border px-3 text-sm focus:outline-none focus:ring-2 focus:ring-foreground"
                    />
                    <button
                      onClick={() => {
                        if (!novoBeneficio.trim()) return;
                        setBeneficios([...beneficios, novoBeneficio.trim()]);
                        setNovoBeneficio("");
                      }}
                      className="h-10 px-4 border border-border rounded-lg text-sm hover:bg-muted transition-colors"
                    >
                      Adicionar
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-1">
                    {beneficios.length === 0 && (
                      <span className="text-xs text-muted-foreground">Nenhum benefício adicionado</span>
                    )}
                    {beneficios.map((b, i) => (
                      <span
                        key={i}
                        className="flex items-center gap-1 px-3 py-1 bg-foreground text-background rounded-full text-xs"
                      >
                        {b}
                        <button
                          onClick={() => setBeneficios(beneficios.filter((_, idx) => idx !== i))}
                          className="ml-1 opacity-60 hover:opacity-100 leading-none"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </SectionBlock>
            </div>

            {/* DIREITA */}
            <div className="grid gap-5 content-start">
              <SectionBlock title="Vitrine">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Disponível para venda</span>
                  <Switch checked={disponivelVenda} onCheckedChange={setDisponivelVenda} />
                </div>
              </SectionBlock>

              <SectionBlock title="Disponibilidade">
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Dias da semana</p>
                  <div className="flex flex-wrap gap-2">
                    {diasSemana.map((d) => (
                      <button
                        key={d.key}
                        onClick={() => toggleDia(d.key)}
                        className={cn(
                          "px-3 py-1 border rounded text-xs transition-colors",
                          diasAceitos.includes(d.key)
                            ? "bg-green-100 border-green-400 text-green-800"
                            : "border-border text-muted-foreground hover:bg-muted",
                        )}
                      >
                        {d.label}
                      </button>
                    ))}
                  </div>

                  <p className="text-xs text-muted-foreground mt-4 mb-2">Profissionais</p>
                  <div className="flex flex-wrap gap-2">
                    {profissionaisDisponiveis.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => toggleProfissional(p.id)}
                        className={cn(
                          "px-3 py-1 border rounded text-xs transition-colors",
                          profissionaisAtendem.includes(p.id)
                            ? "bg-green-100 border-green-400 text-green-800"
                            : "border-border text-muted-foreground hover:bg-muted",
                        )}
                      >
                        {p.nome}
                      </button>
                    ))}
                  </div>
                </div>
              </SectionBlock>
            </div>
          </div>
        </div>

        {/* ===== SERVIÇOS ===== */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Serviços</h2>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[330px_minmax(0,1fr)]">
            <div className="space-y-4">
              <MultiSelectSearch
                label="Serviços"
                options={servicosDisponiveisFiltrados}
                selected={servicosPendentes}
                onChange={setServicosPendentes}
              />
              <button
                onClick={adicionarServico}
                disabled={servicosPendentes.length === 0}
                className="h-10 px-4 border border-border rounded-lg text-sm hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Adicionar ({servicosPendentes.length})
              </button>
            </div>

            <div>
              {servicosInclusos.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground text-sm">Nenhum serviço adicionado</div>
              ) : (
                <div className="rounded-xl border border-border divide-y divide-border">
                  {servicosInclusos.map((s) => (
                    <div key={s.id} className="flex items-center justify-between px-4 py-3">
                      <span className="text-sm">{nomeServico(s.id)}</span>
                      <button
                        onClick={() => removerServico(s.id)}
                        className="text-xs text-muted-foreground hover:text-red-500 transition-colors"
                      >
                        Remover
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ===== PRODUTOS ===== */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Produtos</h2>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[330px_minmax(0,1fr)]">
            <div className="space-y-4">
              <MultiSelectSearch
                label="Produtos"
                options={produtosDisponiveisFiltrados}
                selected={produtosPendentes}
                onChange={setProdutosPendentes}
              />
              <button
                onClick={adicionarProduto}
                disabled={produtosPendentes.length === 0}
                className="h-10 px-4 border border-border rounded-lg text-sm hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Adicionar ({produtosPendentes.length})
              </button>
            </div>

            <div>
              {produtosSelecionados.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground text-sm">Nenhum produto adicionado</div>
              ) : (
                <div className="rounded-xl border border-border divide-y divide-border">
                  {produtosSelecionados.map((p) => (
                    <div key={p.id} className="flex items-center justify-between px-4 py-3">
                      <span className="text-sm">{nomeProduto(p.id)}</span>
                      <button
                        onClick={() => removerProduto(p.id)}
                        className="text-xs text-muted-foreground hover:text-red-500 transition-colors"
                      >
                        Remover
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="sticky bottom-0 border-t border-border bg-card px-6 py-4">
        <div className="flex justify-end">
          <button
            onClick={handleSalvar}
            className="px-6 py-2 bg-foreground text-background rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
          >
            {editing ? "Salvar alterações" : "Criar plano"}
          </button>
        </div>
      </div>
    </div>
  );
}
