import { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, ChevronDown, Tag, X } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { AulaButton, YouTubeModal } from "@/components/YouTubeModal";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";

// Serviços desta conta (exemplo; o sistema real traz os serviços do próprio salão)
const catalogo = [
  { nome: "Corte", preco: 45 },
  { nome: "Barba", preco: 35 },
  { nome: "Corte & Barba", preco: 70 },
  { nome: "Hidratação", preco: 90 },
  { nome: "Sobrancelha", preco: 20 },
  { nome: "Pigmentação", preco: 60 },
  { nome: "Corte & Barba com Henrique", preco: 80 },
];

type Item = { s: number; q: number; p: number };

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

function Campo({ label, className, erro, dica, children }: { label: string; className?: string; erro?: string; dica?: string; children: React.ReactNode }) {
  return (
    <div className={cn("grid min-w-0 content-start gap-0.5", className)}>
      <label className="text-[13px] font-semibold text-foreground">{label}</label>
      {children}
      {erro ? <p className="text-xs text-destructive">{erro}</p> : dica ? <p className="text-xs text-muted-foreground">{dica}</p> : null}
    </div>
  );
}

function CampoReais({ value, onChange, onEnter, className, inputRef, ...rest }: {
  value: string;
  onChange: (v: string) => void;
  onEnter?: () => void;
  className?: string;
  inputRef?: React.Ref<HTMLInputElement>;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange">) {
  return (
    <div className={cn("relative", className)}>
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">R$</span>
      <input
        {...rest}
        ref={inputRef}
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
        className={cn(campo, "pl-9", rest.id?.startsWith("linha") && "h-8 text-[13px]")}
      />
    </div>
  );
}

export default function NovoPacote() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [aulaOpen, setAulaOpen] = useState(false);
  const [nome, setNome] = useState("");
  const [expira, setExpira] = useState(false);
  const [dias, setDias] = useState("");
  const [itens, setItens] = useState<Item[]>([]);
  const [salvo, setSalvo] = useState(JSON.stringify({ nome: "", expira: false, dias: "", itens: [] }));
  const [erroNome, setErroNome] = useState("");
  const [erroAdd, setErroAdd] = useState("");

  // rascunho do serviço que está sendo adicionado
  const [busca, setBusca] = useState(false);
  const [sel, setSel] = useState(-1);
  const [qtd, setQtd] = useState("1");
  const [preco, setPreco] = useState("");
  const [precoEditado, setPrecoEditado] = useState(false);
  const qtdRef = useRef<HTMLInputElement>(null);
  const servicoRef = useRef<HTMLButtonElement>(null);

  const total = itens.reduce((s, i) => s + i.p, 0);
  const tabela = itens.reduce((s, i) => s + catalogo[i.s].preco * i.q, 0);
  const economia = tabela - total;
  const sujo = useMemo(() => JSON.stringify({ nome, expira, dias, itens }) !== salvo, [nome, expira, dias, itens, salvo]);

  const recalcula = (idx: number, q: string) => {
    if (idx < 0 || precoEditado) return;
    setPreco(virgula(catalogo[idx].preco * Math.max(1, Math.floor(+q) || 1)));
  };

  const escolher = (idx: number) => {
    setSel(idx);
    setQtd("1");
    setPrecoEditado(false);
    setPreco(virgula(catalogo[idx].preco));
    setErroAdd("");
    setBusca(false);
    setTimeout(() => {
      qtdRef.current?.focus();
      qtdRef.current?.select();
    }, 0);
  };

  const adicionar = () => {
    const q = Math.floor(+qtd);
    if (sel < 0) return setErroAdd("Escolha um serviço.");
    if (!(q >= 1)) return setErroAdd("A quantidade deve ser 1 ou mais.");
    setErroAdd("");
    const p = paraNumero(preco);
    setItens((prev) => {
      const existente = prev.find((x) => x.s === sel);
      return existente ? prev.map((x) => (x.s === sel ? { ...x, q: x.q + q, p: x.p + p } : x)) : [...prev, { s: sel, q, p }];
    });
    setSel(-1);
    setQtd("1");
    setPreco("");
    setPrecoEditado(false);
    setTimeout(() => servicoRef.current?.focus(), 0);
  };

  const mudarQtd = (k: number, v: string) => {
    const q = Math.max(1, Math.floor(+v) || 1);
    setItens((prev) => prev.map((x, i) => (i === k ? { ...x, p: (x.p / x.q) * q, q } : x)));
  };

  const salvar = () => {
    let ok = true;
    if (!nome.trim()) {
      setErroNome("Informe o nome do pacote.");
      ok = false;
    }
    if (itens.length === 0) {
      setErroAdd("Adicione ao menos um serviço.");
      ok = false;
    }
    if (!ok) return;
    setSalvo(JSON.stringify({ nome, expira, dias, itens }));
    toast({ title: "Pacote salvo" });
    navigate("/comboPesquisa");
  };

  return (
    <AppLayout>
      <div className="flex flex-col gap-0">
        {/* HEADER */}
        <div className="pb-3">
          <div className="flex flex-row flex-wrap items-center gap-3">
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-bold leading-none tracking-tight text-foreground sm:text-2xl">Novo pacote</h1>
              <AulaButton onOpen={() => setAulaOpen(true)} />
            </div>
            <span aria-hidden="true" className="inline-block h-6 w-px bg-border" />
            <button type="button" onClick={salvar} className={btnEscuro}>
              Salvar pacote
            </button>
            {sujo && <span className="text-xs text-muted-foreground">Alterações não salvas</span>}
          </div>
        </div>

        <div className="mt-1 grid grid-cols-1 items-start gap-4 pb-12 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="flex min-w-0 flex-col gap-4">
            <section className="rounded-xl border border-border bg-card p-4">
              <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-foreground">Dados do pacote</h2>
              <div className="grid grid-cols-12 gap-3">
                <Campo label="Nome do pacote *" className="col-span-12" erro={erroNome}>
                  <input
                    className={cn(campo, erroNome && "border-destructive focus:border-destructive focus:ring-destructive/30")}
                    value={nome}
                    placeholder="Ex.: Corte + Barba 4x"
                    onChange={(e) => {
                      setNome(e.target.value);
                      setErroNome("");
                    }}
                  />
                </Campo>
                <div className="col-span-12 flex flex-wrap items-center gap-x-6 gap-y-2">
                  <label className="flex cursor-pointer items-center gap-2.5 text-sm">
                    <Switch
                      checked={expira}
                      onCheckedChange={(v) => {
                        setExpira(v);
                        if (v && !dias) setDias("30");
                      }}
                      aria-label="Pacote expira"
                    />
                    Pacote expira
                  </label>
                  {expira && (
                    <div className="flex items-center gap-2 text-sm">
                      <input
                        type="number"
                        min={1}
                        aria-label="Dias para expirar"
                        className={cn(campo, "h-9 w-24")}
                        value={dias}
                        onFocus={(e) => e.target.select()}
                        onChange={(e) => setDias(e.target.value)}
                      />
                      dias após a compra
                    </div>
                  )}
                </div>
              </div>
            </section>

            <section className="rounded-xl border border-border bg-card p-4">
              <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-foreground">Serviços do pacote</h2>
              <div className="grid grid-cols-1 items-end gap-2.5 sm:grid-cols-[minmax(0,5fr)_minmax(0,2fr)_minmax(0,3fr)_auto]">
                <Campo label="Serviço">
                  <Popover open={busca} onOpenChange={setBusca}>
                    <PopoverTrigger asChild>
                      <button ref={servicoRef} type="button" className={cn(campo, "flex items-center justify-between gap-2 text-left")}>
                        <span className={cn("truncate", sel < 0 && "text-muted-foreground/70")}>{sel >= 0 ? catalogo[sel].nome : "Buscar serviço"}</span>
                        <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent align="start" className="w-[var(--radix-popover-trigger-width)] min-w-[260px] p-0">
                      <Command filter={(value, search) => (semAcento(value).includes(semAcento(search)) ? 1 : 0)}>
                        <CommandInput placeholder="Buscar serviço" />
                        <CommandList>
                          <CommandEmpty className="py-4 text-center text-sm text-muted-foreground">Nenhum serviço encontrado.</CommandEmpty>
                          <CommandGroup>
                            {catalogo.map((c, i) => (
                              <CommandItem key={c.nome} value={c.nome} onSelect={() => escolher(i)}>
                                <span className="flex-1 truncate">{c.nome}</span>
                                <span className="text-muted-foreground">{R(c.preco)}</span>
                                {sel === i && <Check className="ml-2 h-4 w-4 text-info" />}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </Campo>
                <Campo label="Quantidade">
                  <input
                    ref={qtdRef}
                    type="number"
                    min={1}
                    className={campo}
                    value={qtd}
                    onFocus={(e) => e.target.select()}
                    onChange={(e) => {
                      setQtd(e.target.value);
                      recalcula(sel, e.target.value);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        adicionar();
                      }
                    }}
                  />
                </Campo>
                <Campo label="Preço">
                  <CampoReais
                    value={preco}
                    placeholder="0,00"
                    onChange={(v) => {
                      setPreco(v);
                      setPrecoEditado(true);
                    }}
                    onEnter={adicionar}
                  />
                </Campo>
                <button type="button" onClick={adicionar} className={cn(btnEscuro, "h-10 whitespace-nowrap")}>
                  + Adicionar
                </button>
              </div>
              {erroAdd && <p className="mt-1.5 text-xs text-destructive">{erroAdd}</p>}

              {itens.length === 0 ? (
                <div className="mt-3.5 rounded-[10px] border border-dashed border-border p-5 text-center text-[13px] text-muted-foreground">
                  Nenhum serviço adicionado. Escolha um serviço acima.
                </div>
              ) : (
                <table className="mt-3.5 w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      <th className="px-2 pb-2">Serviço</th>
                      <th className="px-2 pb-2">Quantidade</th>
                      <th className="px-2 pb-2 text-right">Valor no pacote</th>
                      <th className="px-2 pb-2 text-right">Valor sem desconto</th>
                      <th className="w-10" />
                    </tr>
                  </thead>
                  <tbody>
                    {itens.map((it, k) => (
                      <tr key={it.s} className="border-t border-border">
                        <td className="px-2 py-2">{catalogo[it.s].nome}</td>
                        <td className="px-2 py-2">
                          <input
                            type="number"
                            min={1}
                            aria-label="Quantidade"
                            value={it.q}
                            onFocus={(e) => e.target.select()}
                            onChange={(e) => mudarQtd(k, e.target.value)}
                            className={cn(campo, "h-8 w-[72px] text-[13px]")}
                          />
                        </td>
                        <td className="px-2 py-2 text-right">
                          <CampoReais
                            id={`linha-${k}`}
                            aria-label="Valor"
                            className="ml-auto inline-block w-[112px]"
                            value={virgula(it.p)}
                            onChange={(v) => setItens((prev) => prev.map((x, i) => (i === k ? { ...x, p: paraNumero(v) } : x)))}
                          />
                        </td>
                        <td className="px-2 py-2 text-right text-muted-foreground">{R(catalogo[it.s].preco * it.q)}</td>
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
                    <tr className="border-t border-border">
                      <td colSpan={2} />
                      <td className="px-2 py-2 text-right text-[15px] font-bold">Total {R(total)}</td>
                      <td className="px-2 py-2 text-right text-[15px] font-semibold text-muted-foreground">Total {R(tabela)}</td>
                      <td />
                    </tr>
                  </tbody>
                </table>
              )}
            </section>
          </div>

          {/* RESUMO */}
          <aside className="rounded-xl border border-border bg-card p-4 lg:sticky lg:top-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-foreground">Resumo</p>
            <div className="flex items-center justify-between gap-3 py-1 text-[13px]">
              <span className="text-muted-foreground">Pacote</span>
              <b className={cn("truncate font-semibold", nome.trim() ? "text-foreground" : "text-muted-foreground")}>{nome.trim() || "Sem nome"}</b>
            </div>
            <div className="flex items-baseline justify-between py-1 text-[13px]">
              <span className="text-muted-foreground">Valor do pacote</span>
              <b className="text-xl font-bold tabular-nums text-foreground">{R(total)}</b>
            </div>
            {economia > 0.005 ? (
              <div className="mt-1 flex justify-end">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-info/10 px-2.5 py-0.5 text-xs font-semibold text-info">
                  <Tag className="h-3.5 w-3.5" /> Economia de {R(economia)} ({Math.round((economia / tabela) * 100)}%)
                </span>
              </div>
            ) : itens.length > 0 ? (
              <p className="mt-1 text-right text-xs text-muted-foreground">Sem desconto sobre a tabela</p>
            ) : null}
            <hr className="my-2.5 border-border" />
            {[
              ["Valor sem desconto", R(tabela)],
              ["Serviços", String(itens.length)],
              ["Sessões no total", String(itens.reduce((s, i) => s + i.q, 0))],
              ["Expiração", expira && dias ? `${dias} dias` : "Não expira"],
            ].map(([k, v]) => (
              <div key={k} className="flex items-center justify-between py-1 text-[13px]">
                <span className="text-muted-foreground">{k}</span>
                <b className="font-semibold tabular-nums text-foreground">{v}</b>
              </div>
            ))}
          </aside>
        </div>
      </div>
      <YouTubeModal
        open={aulaOpen}
        onClose={() => setAulaOpen(false)}
        videoUrl="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
        title="Aula - Novo pacote"
      />
    </AppLayout>
  );
}
