import { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, ChevronDown, HelpCircle, Upload, X } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { AulaButton, YouTubeModal } from "@/components/YouTubeModal";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

// Produtos desta conta com o último custo (exemplo; o sistema real traz o estoque do próprio salão)
const produtos = [
  { nome: "Creme de barbear", custo: 18 },
  { nome: "Gel fixador", custo: 22 },
  { nome: "Pomada modeladora", custo: 35 },
  { nome: "Shampoo anticaspa", custo: 28 },
  { nome: "Óleo de barba", custo: 30 },
  { nome: "Condicionador", custo: 24 },
  { nome: "Máscara facial", custo: 45 },
];

const origens = [
  { value: "caixa", label: "Retirar do caixa" },
  { value: "conta", label: "Retirar da conta" },
  { value: "parcelar", label: "Parcelar" },
];

type Item = { p: number; q: number; c: number };

const R = (v: number) => `R$ ${v.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const paraNumero = (v: string) => {
  const n = parseFloat(v.replace(/\./g, "").replace(",", "."));
  return Number.isFinite(n) ? n : 0;
};
const virgula = (n: number) => n.toFixed(2).replace(".", ",");
const semAcento = (t: string) => t.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

const campo =
  "h-10 w-full rounded-lg border border-info/50 bg-card px-3 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground/70 focus:border-info/60 focus:ring-2 focus:ring-info/40";
const btnEscuro =
  "inline-flex h-8 shrink-0 items-center justify-center gap-1.5 rounded-lg bg-foreground px-4 text-sm font-semibold text-background";
const linkAcao = "inline-flex cursor-pointer items-center gap-1.5 text-[13px] font-medium text-info hover:underline";

function Campo({ label, ajuda, className, erro, dica, children }: { label: string; ajuda?: string; className?: string; erro?: string; dica?: string; children: React.ReactNode }) {
  return (
    <div className={cn("grid min-w-0 content-start gap-0.5", className)}>
      <label className="flex items-center gap-1 text-[13px] font-semibold text-foreground">
        {label}
        {ajuda && (
          <Tooltip>
            <TooltipTrigger asChild>
              <button type="button" aria-label={ajuda} className="text-muted-foreground hover:text-foreground">
                <HelpCircle className="h-3.5 w-3.5" />
              </button>
            </TooltipTrigger>
            <TooltipContent className="max-w-[240px] text-xs">{ajuda}</TooltipContent>
          </Tooltip>
        )}
      </label>
      {children}
      {erro ? <p className="text-xs text-destructive">{erro}</p> : dica ? <p className="text-xs text-muted-foreground">{dica}</p> : null}
    </div>
  );
}

function CampoReais({ value, onChange, onEnter, className, pequeno, ...rest }: {
  value: string;
  onChange: (v: string) => void;
  onEnter?: () => void;
  className?: string;
  pequeno?: boolean;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange">) {
  return (
    <div className={cn("relative", className)}>
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">R$</span>
      <input
        {...rest}
        inputMode="decimal"
        value={value}
        onFocus={(e) => e.target.select()}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && onEnter) {
            e.preventDefault();
            onEnter();
          }
        }}
        className={cn(campo, "pl-9", pequeno && "h-8 text-[13px]")}
      />
    </div>
  );
}

export default function NovaCompra() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [aulaOpen, setAulaOpen] = useState(false);
  const [itens, setItens] = useState<Item[]>([]);
  const [desconto, setDesconto] = useState("");
  const [origem, setOrigem] = useState("caixa");
  const [parcelas, setParcelas] = useState(2);
  const [salvo, setSalvo] = useState(JSON.stringify({ itens: [], desconto: "", origem: "caixa", parcelas: 2 }));
  const [erroAdd, setErroAdd] = useState("");

  // rascunho do item que está sendo adicionado
  const [busca, setBusca] = useState(false);
  const [sel, setSel] = useState(-1);
  const [qtd, setQtd] = useState("1");
  const [custo, setCusto] = useState("");
  const qtdRef = useRef<HTMLInputElement>(null);
  const produtoRef = useRef<HTMLButtonElement>(null);

  const subtotal = itens.reduce((s, i) => s + i.c * i.q, 0);
  const descontoNum = paraNumero(desconto);
  const total = Math.max(0, subtotal - descontoNum);
  const erroDesconto = descontoNum > subtotal && subtotal > 0 ? "O desconto não pode passar do subtotal." : "";
  const sujo = useMemo(
    () => JSON.stringify({ itens, desconto, origem, parcelas }) !== salvo,
    [itens, desconto, origem, parcelas, salvo],
  );

  const escolher = (idx: number) => {
    setSel(idx);
    setQtd("1");
    setCusto(virgula(produtos[idx].custo));
    setErroAdd("");
    setBusca(false);
    setTimeout(() => {
      qtdRef.current?.focus();
      qtdRef.current?.select();
    }, 0);
  };

  const juntar = (prev: Item[], novo: Item) => {
    const existente = prev.find((x) => x.p === novo.p && Math.abs(x.c - novo.c) < 0.005);
    return existente ? prev.map((x) => (x === existente ? { ...x, q: x.q + novo.q } : x)) : [...prev, novo];
  };

  const adicionar = () => {
    const q = Math.floor(+qtd);
    const c = paraNumero(custo);
    if (sel < 0) return setErroAdd("Escolha um produto.");
    if (!(q >= 1)) return setErroAdd("A quantidade deve ser 1 ou mais.");
    if (!(c > 0)) return setErroAdd("Informe o custo unitário.");
    setErroAdd("");
    setItens((prev) => juntar(prev, { p: sel, q, c }));
    setSel(-1);
    setQtd("1");
    setCusto("");
    setTimeout(() => produtoRef.current?.focus(), 0);
  };

  const importarXml = (arq: File | undefined) => {
    if (!arq) return;
    // Exemplo: o sistema real lê os itens da nota; aqui entram 3 itens de demonstração
    setItens((prev) => [
      { p: 0, q: 6, c: 18 },
      { p: 2, q: 4, c: 35 },
      { p: 4, q: 3, c: 30 },
    ].reduce(juntar, prev));
    toast({ title: "3 itens importados do XML" });
  };

  const concluir = () => {
    if (itens.length === 0) return setErroAdd("Adicione ao menos um produto.");
    if (erroDesconto) return;
    setSalvo(JSON.stringify({ itens, desconto, origem, parcelas }));
    toast({ title: "Compra registrada", description: "A entrada de produtos foi salva com sucesso." });
    navigate("/comprasPesquisa");
  };

  return (
    <AppLayout>
      <div className="flex flex-col gap-0">
        {/* HEADER */}
        <div className="pb-3">
          <div className="flex flex-row flex-wrap items-center gap-3">
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-bold leading-none tracking-tight text-foreground sm:text-2xl">Entrada de produtos</h1>
              <AulaButton onOpen={() => setAulaOpen(true)} />
            </div>
            <span aria-hidden="true" className="inline-block h-6 w-px bg-border" />
            <button type="button" onClick={concluir} className={btnEscuro}>
              Concluir compra
            </button>
            {sujo && <span className="text-xs text-muted-foreground">Alterações não salvas</span>}
          </div>
        </div>

        <div className="mt-1 grid grid-cols-1 items-start gap-4 pb-12 lg:grid-cols-[minmax(0,1fr)_300px]">
          <section className="min-w-0 rounded-xl border border-border bg-card p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="text-base font-semibold text-foreground">Itens da compra</h2>
              <label className={linkAcao}>
                <Upload className="h-4 w-4" /> Importar XML
                <input
                  type="file"
                  accept=".xml,text/xml,application/xml"
                  hidden
                  onChange={(e) => {
                    importarXml(e.target.files?.[0]);
                    e.target.value = "";
                  }}
                />
              </label>
            </div>

            <div className="grid grid-cols-1 items-end gap-2.5 sm:grid-cols-[minmax(0,5fr)_minmax(0,3fr)_minmax(0,2fr)_auto]">
              <Campo label="Produto">
                <Popover open={busca} onOpenChange={setBusca}>
                  <PopoverTrigger asChild>
                    <button ref={produtoRef} type="button" className={cn(campo, "flex items-center justify-between gap-2 text-left")}>
                      <span className={cn("truncate", sel < 0 && "text-muted-foreground/70")}>{sel >= 0 ? produtos[sel].nome : "Buscar produto"}</span>
                      <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent align="start" className="w-[var(--radix-popover-trigger-width)] min-w-[260px] p-0">
                    <Command filter={(value, search) => (semAcento(value).includes(semAcento(search)) ? 1 : 0)}>
                      <CommandInput placeholder="Buscar produto" />
                      <CommandList>
                        <CommandEmpty className="py-4 text-center text-sm text-muted-foreground">Nenhum produto encontrado.</CommandEmpty>
                        <CommandGroup>
                          {produtos.map((p, i) => (
                            <CommandItem key={p.nome} value={p.nome} onSelect={() => escolher(i)}>
                              <span className="flex-1 truncate">{p.nome}</span>
                              <span className="text-muted-foreground">último {R(p.custo)}</span>
                              {sel === i && <Check className="ml-2 h-4 w-4 text-info" />}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </Campo>
              <Campo label="Custo unitário">
                <CampoReais value={custo} placeholder="0,00" onChange={setCusto} onEnter={adicionar} />
              </Campo>
              <Campo label="Quantidade" ajuda="Se o estoque atual estiver negativo, a quantidade inserida passa a ser o novo estoque.">
                <input
                  ref={qtdRef}
                  type="number"
                  min={1}
                  className={campo}
                  value={qtd}
                  onFocus={(e) => e.target.select()}
                  onChange={(e) => setQtd(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      adicionar();
                    }
                  }}
                />
              </Campo>
              <button type="button" onClick={adicionar} className={cn(btnEscuro, "h-10 whitespace-nowrap")}>
                + Adicionar
              </button>
            </div>
            {erroAdd && <p className="mt-1.5 text-xs text-destructive">{erroAdd}</p>}

            {itens.length === 0 ? (
              <div className="mt-3.5 rounded-[10px] border border-dashed border-border p-5 text-center text-[13px] text-muted-foreground">
                Nenhum produto adicionado. Escolha um produto acima.
              </div>
            ) : (
              <table className="mt-3.5 w-full text-sm">
                <thead>
                  <tr className="text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    <th className="px-2 pb-2">Produto</th>
                    <th className="px-2 pb-2">Quantidade</th>
                    <th className="px-2 pb-2 text-right">Custo unitário</th>
                    <th className="px-2 pb-2 text-right">Total</th>
                    <th className="w-10" />
                  </tr>
                </thead>
                <tbody>
                  {itens.map((it, k) => (
                    <tr key={`${it.p}-${k}`} className="border-t border-border">
                      <td className="px-2 py-2">{produtos[it.p].nome}</td>
                      <td className="px-2 py-2">
                        <input
                          type="number"
                          min={1}
                          aria-label="Quantidade"
                          value={it.q}
                          onFocus={(e) => e.target.select()}
                          onChange={(e) => {
                            const q = Math.max(1, Math.floor(+e.target.value) || 1);
                            setItens((prev) => prev.map((x, i) => (i === k ? { ...x, q } : x)));
                          }}
                          className={cn(campo, "h-8 w-[72px] text-[13px]")}
                        />
                      </td>
                      <td className="px-2 py-2 text-right">
                        <CampoReais
                          pequeno
                          aria-label="Custo unitário"
                          className="ml-auto inline-block w-[112px]"
                          value={virgula(it.c)}
                          onChange={(v) => setItens((prev) => prev.map((x, i) => (i === k ? { ...x, c: paraNumero(v) } : x)))}
                        />
                      </td>
                      <td className="px-2 py-2 text-right tabular-nums">{R(it.c * it.q)}</td>
                      <td className="px-2 py-2 text-right">
                        <button
                          type="button"
                          aria-label="Remover"
                          onClick={() => setItens((prev) => prev.filter((_, i) => i !== k))}
                          className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-destructive"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>

          {/* RESUMO */}
          <aside className="rounded-xl border border-border bg-card p-4 lg:sticky lg:top-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-foreground">Resumo</p>
            <div className="flex items-center justify-between py-1 text-[13px]">
              <span className="text-muted-foreground">Subtotal</span>
              <b className="font-semibold tabular-nums text-foreground">{R(subtotal)}</b>
            </div>
            <Campo label="Desconto" className="my-1.5" erro={erroDesconto}>
              <CampoReais value={desconto} placeholder="0,00" onChange={setDesconto} />
            </Campo>
            <hr className="my-2.5 border-border" />
            <div className="flex items-baseline justify-between py-1 text-[13px]">
              <span className="text-muted-foreground">Total final</span>
              <b className="text-xl font-bold tabular-nums text-foreground">{R(total)}</b>
            </div>
            <hr className="my-2.5 border-border" />
            <Campo label="Origem do pagamento">
              <select className={campo} value={origem} onChange={(e) => setOrigem(e.target.value)}>
                {origens.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </Campo>
            {origem === "parcelar" && (
              <Campo label="Parcelas" className="mt-2" dica={total > 0 ? `${parcelas}x de ${R(total / parcelas)}` : undefined}>
                <select className={campo} value={parcelas} onChange={(e) => setParcelas(+e.target.value)}>
                  {Array.from({ length: 11 }, (_, k) => k + 2).map((n) => (
                    <option key={n} value={n}>
                      {n}x
                    </option>
                  ))}
                </select>
              </Campo>
            )}
          </aside>
        </div>
      </div>
      <YouTubeModal
        open={aulaOpen}
        onClose={() => setAulaOpen(false)}
        videoUrl="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
        title="Aula - Entrada de produtos"
      />
    </AppLayout>
  );
}
