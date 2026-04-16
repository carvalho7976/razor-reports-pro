import { useMemo, useState, type KeyboardEvent } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { TextField, Dropdown } from "@/components/FormModal";
import { useToast } from "@/hooks/use-toast";
import { Trash2, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

const formatBRL = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

interface ItemCompraForm {
  id: number;
  produto: string;
  valor: string;
  quantidade: string;
}

const produtosOptions = [
  { value: "CREME DE BARBEAR", label: "CREME DE BARBEAR" },
  { value: "GEL FIXADOR", label: "GEL FIXADOR" },
  { value: "POMADA MODELADORA", label: "POMADA MODELADORA" },
  { value: "SHAMPOO ANTICASPA", label: "SHAMPOO ANTICASPA" },
  { value: "ÓLEO DE BARBA", label: "ÓLEO DE BARBA" },
  { value: "CONDICIONADOR", label: "CONDICIONADOR" },
];

const debitoOptions = [
  { value: "caixa", label: "Retirar do Caixa" },
  { value: "conta", label: "Retirar da Conta" },
  { value: "parcelar", label: "Parcelar" },
];

function toNumberBR(value: string) {
  if (!value) return 0;
  const cleaned = value.replace(/[^\d,]/g, "");
  return Number(cleaned.replace(/\./g, "").replace(",", ".")) || 0;
}

function formatCurrencyInput(value: string) {
  const digits = value.replace(/\D/g, "");
  if (!digits) return "R$ 0,00";
  const numberValue = Number(digits) / 100;
  return numberValue.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function sanitizeQuantity(value: string) {
  const digits = value.replace(/\D/g, "");
  return digits || "1";
}

function digitsToMoneyNumber(digits: string) {
  if (!digits) return 0;
  if (digits.length === 1) return Number(`${digits}.0`);
  return Number(`${digits.slice(0, -1)}.${digits.slice(-1)}`);
}

function formatCurrencyFromDigits(digits: string) {
  if (!digits) return "R$ 0,00";
  if (digits.length === 1) return `R$ ${digits},00`;
  const inteiro = digits.slice(0, -1).replace(/^0+/, "") || "0";
  const decimal1 = digits.slice(-1);
  const inteiroFormatado = Number(inteiro).toLocaleString("pt-BR");
  return `R$ ${inteiroFormatado},${decimal1}0`;
}

const tabs = [
  { id: "itens", label: "Itens" },
  { id: "fechamento", label: "Fechamento" },
];

export default function NovaCompra() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState("itens");
  const [produtoSelecionado, setProdutoSelecionado] = useState("");
  const [valorItemDigits, setValorItemDigits] = useState("");
  const [quantidadeItem, setQuantidadeItem] = useState("1");
  const [desconto, setDesconto] = useState("R$ 0,00");
  const [debitoTipo, setDebitoTipo] = useState("caixa");
  const [itensCompra, setItensCompra] = useState<ItemCompraForm[]>([]);
  const [showErrors, setShowErrors] = useState(false);
  const [xmlFile, setXmlFile] = useState<File | null>(null);
  const [localNotice, setLocalNotice] = useState<{ title: string; description?: string } | null>(null);

  const showLocalNotice = (title: string, description?: string) => {
    setLocalNotice({ title, description });
    window.setTimeout(() => setLocalNotice(null), 2200);
  };

  const itemPreviewTotal = useMemo(() => {
    const valor = digitsToMoneyNumber(valorItemDigits);
    const quantidade = Number(quantidadeItem) || 0;
    return valor * quantidade;
  }, [valorItemDigits, quantidadeItem]);

  const subtotalCompra = useMemo(() => {
    return itensCompra.reduce((acc, item) => {
      const valor = toNumberBR(item.valor);
      const quantidade = Number(item.quantidade) || 0;
      return acc + valor * quantidade;
    }, 0);
  }, [itensCompra]);

  const descontoCompra = useMemo(() => toNumberBR(desconto), [desconto]);

  const totalCompra = useMemo(() => {
    const total = subtotalCompra - descontoCompra;
    return total < 0 ? 0 : total;
  }, [subtotalCompra, descontoCompra]);

  const errors = {
    itensCompra: itensCompra.length === 0 ? "Adicione pelo menos um produto." : "",
  };

  const handleValorItemKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const allowedControlKeys = ["Tab", "Shift", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"];
    if (allowedControlKeys.includes(e.key)) return;
    if (e.key === "Backspace") {
      e.preventDefault();
      setValorItemDigits((prev) => prev.slice(0, -1));
      return;
    }
    if (/^\d$/.test(e.key)) {
      e.preventDefault();
      setValorItemDigits((prev) => (prev + e.key).replace(/^0+(?=\d)/, ""));
      return;
    }
    e.preventDefault();
  };

  const handleAdicionarItem = () => {
    const valor = digitsToMoneyNumber(valorItemDigits);
    const quantidade = Number(quantidadeItem) || 0;
    if (!produtoSelecionado || valor <= 0 || quantidade <= 0) {
      showLocalNotice("Preencha o item corretamente", "Selecione o produto, informe valor e quantidade válidos.");
      return;
    }
    const produtoLabel = produtosOptions.find((p) => p.value === produtoSelecionado)?.label || produtoSelecionado;
    setItensCompra((prev) => [
      ...prev,
      { id: Date.now(), produto: produtoLabel, valor: formatCurrencyFromDigits(valorItemDigits), quantidade: quantidadeItem },
    ]);
    setProdutoSelecionado("");
    setValorItemDigits("");
    setQuantidadeItem("1");
    showLocalNotice("Item adicionado", produtoLabel);
  };

  const handleRemoverItem = (id: number) => {
    setItensCompra((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAvancarFechamento = () => {
    setShowErrors(true);
    if (errors.itensCompra) return;
    setActiveTab("fechamento");
  };

  const handleSalvarCompra = () => {
    setShowErrors(true);
    if (errors.itensCompra) {
      setActiveTab("itens");
      return;
    }
    toast({ title: "Compra registrada", description: "A entrada de produtos foi salva com sucesso." });
    navigate("/comprasPesquisa");
  };

  return (
    <AppLayout>
      <div className="flex flex-col gap-0">
        {/* HEADER */}
        <div className="mx-6 mt-4">
          <div className="flex items-start justify-between gap-4">
            <div className="pt-1">
              <h1 className="text-xl font-bold text-foreground">Entrada de Produtos</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {activeTab === "itens"
                  ? "Monte a lista de itens da compra."
                  : "Revise e conclua o fechamento da compra."}
              </p>
            </div>
          </div>
        </div>

        {/* TABS */}
        <div className="mx-6 mt-4 border-b border-border">
          <div className="flex gap-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "relative pb-2.5 text-sm font-medium transition-colors",
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

        {/* CONTENT */}
        <div className="mx-6 mt-5 pb-10">
          {activeTab === "itens" && (
            <>
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[330px_minmax(0,1fr)]">
              {/* Left: form */}
              <div className="space-y-4 self-start">
                <Dropdown
                  label="Produto"
                  value={produtoSelecionado}
                  setValue={setProdutoSelecionado}
                  options={produtosOptions}
                />

                <div className="grid gap-1.5">
                  <label className="text-sm font-medium text-foreground">Custo unitário</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={formatCurrencyFromDigits(valorItemDigits)}
                    onKeyDown={handleValorItemKeyDown}
                    onChange={() => {}}
                    placeholder="R$ 0,00"
                    className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <TextField
                  label="Quantidade"
                  value={quantidadeItem}
                  onChange={(value) => setQuantidadeItem(sanitizeQuantity(value))}
                  type="text"
                  placeholder="1"
                />

                <TextField label="Custo total" value={formatBRL(itemPreviewTotal)} onChange={() => {}} disabled />

                <div className="flex items-end gap-3 pt-1">
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept=".xml,text/xml,application/xml"
                      onChange={(e) => setXmlFile(e.target.files?.[0] || null)}
                      className="hidden"
                    />
                    <span className="inline-flex h-10 items-center justify-center rounded-lg border border-black bg-white px-4 text-sm font-semibold text-black">
                      Importar XML
                    </span>
                  </label>

                  <button
                    type="button"
                    onClick={handleAdicionarItem}
                    className="h-10 rounded-lg bg-foreground px-4 text-sm font-semibold text-background"
                  >
                    Adicionar item
                  </button>
                </div>
              </div>

              {/* Right: table */}
              <div className="space-y-4 self-start">
                <div className="overflow-hidden rounded-lg border border-border bg-card">
                  <table className="w-full border-collapse">
                    <thead className="bg-muted/40">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Produto</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">Valor</th>
                        <th className="px-4 py-3 text-center text-sm font-semibold text-foreground">Quantidade</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">Total</th>
                        <th className="w-14 px-2 py-3 text-center text-sm font-semibold text-foreground" />
                      </tr>
                    </thead>
                    <tbody>
                      {itensCompra.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-4 py-16 text-center text-sm text-muted-foreground">
                            Adicione um produto para montar esta entrada.
                          </td>
                        </tr>
                      ) : (
                        itensCompra.map((item) => {
                          const valor = toNumberBR(item.valor);
                          const quantidade = Number(item.quantidade) || 0;
                          const total = valor * quantidade;
                          return (
                            <tr key={item.id} className="border-t border-border bg-card">
                              <td className="px-4 py-3 text-sm text-foreground">{item.produto}</td>
                              <td className="px-4 py-3 text-right text-sm text-foreground">{formatBRL(valor)}</td>
                              <td className="px-4 py-3 text-center text-sm text-foreground">{quantidade}</td>
                              <td className="px-4 py-3 text-right text-sm font-medium text-emerald-600">
                                {formatBRL(total)}
                              </td>
                              <td className="px-2 py-3 text-center">
                                <button
                                  type="button"
                                  onClick={() => handleRemoverItem(item.id)}
                                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-destructive transition hover:bg-destructive/10"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                {localNotice && (
                  <div className="animate-fade-in-up">
                    <div className="flex min-h-[44px] items-center overflow-hidden rounded-[8px] border border-[#bfd7f2] bg-[#eef4fb] text-sm">
                      <div className="px-4 py-3 font-medium text-[#1f2937]">1 selecionado</div>
                      <div className="h-6 w-px bg-[#d7e5f5]" />
                      <div className="flex items-center gap-4 px-4 py-3">
                        <span className="font-medium text-[#16a34a]">{localNotice.title}</span>
                        {localNotice.description && (
                          <span className="text-[#374151]">{localNotice.description}</span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleAvancarFechamento}
                    className="h-10 rounded-lg bg-foreground px-6 text-sm font-semibold text-background"
                  >
                    Avançar para fechamento
                  </button>
                </div>
              </div>

              {showErrors && errors.itensCompra ? (
                <p className="text-sm text-destructive">{errors.itensCompra}</p>
              ) : null}
            </div>
            </>
          )}

          {activeTab === "fechamento" && (
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
              <div className="space-y-4">
                <div className="overflow-hidden rounded-lg border border-border bg-card min-h-[233px]">
                  <table className="w-full border-collapse">
                    <thead className="bg-muted/40">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Produto</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">Valor</th>
                        <th className="px-4 py-3 text-center text-sm font-semibold text-foreground">Quantidade</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {itensCompra.map((item) => {
                        const valor = toNumberBR(item.valor);
                        const quantidade = Number(item.quantidade) || 0;
                        const total = valor * quantidade;
                        return (
                          <tr key={item.id} className="border-t border-border bg-card">
                            <td className="px-4 py-3 text-sm text-foreground">{item.produto}</td>
                            <td className="px-4 py-3 text-right text-sm text-foreground">{formatBRL(valor)}</td>
                            <td className="px-4 py-3 text-center text-sm text-foreground">{quantidade}</td>
                            <td className="px-4 py-3 text-right text-sm font-medium text-emerald-600">
                              {formatBRL(total)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="space-y-4 self-start">
                <TextField
                  label="Desconto total"
                  value={desconto}
                  onChange={(value) => setDesconto(formatCurrencyInput(value))}
                  placeholder="R$ 0,00"
                />

                <Dropdown
                  label="Origem do pagamento"
                  value={debitoTipo}
                  setValue={setDebitoTipo}
                  options={debitoOptions}
                />

                <div className="rounded-lg border border-border bg-card px-4 py-4">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Subtotal</span>
                    <span className="font-medium text-foreground">{formatBRL(subtotalCompra)}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-sm text-muted-foreground">
                    <span>Desconto</span>
                    <span className="font-medium text-foreground">{formatBRL(descontoCompra)}</span>
                  </div>
                  <div className="mt-3 flex items-center justify-between border-t border-border pt-3 text-[16px] font-semibold text-foreground">
                    <span>Total final</span>
                    <span className="text-emerald-600">{formatBRL(totalCompra)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* FOOTER - only on fechamento tab */}
        {activeTab === "fechamento" && (
          <div className="sticky bottom-0 border-t border-border bg-card px-6 py-4">
            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setActiveTab("itens")}
                className="inline-flex h-11 items-center gap-2 rounded-lg border border-border px-4 text-sm font-semibold text-foreground"
              >
                <ChevronLeft className="h-4 w-4" />
                Voltar
              </button>
              <button
                type="button"
                onClick={handleSalvarCompra}
                className="inline-flex h-11 items-center justify-center rounded-lg bg-foreground px-6 text-sm font-semibold text-background"
              >
                Concluir compra
              </button>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
